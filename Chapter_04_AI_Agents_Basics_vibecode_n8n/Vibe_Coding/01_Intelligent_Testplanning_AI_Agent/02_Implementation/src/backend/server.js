import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON request body." });
  }
  next(error);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../../..");
const envPath = path.join(projectRoot, ".env");

function readEnvFile() {
  if (!fs.existsSync(envPath)) return {};
  const values = {};
  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim().replace(/^[\u200B-\u200D\uFEFF]+/, "");
    if (!line || line.startsWith("#")) continue;
    const colonIndex = line.indexOf(":");
    const equalsIndex = line.indexOf("=");
    const separator = colonIndex >= 0 && (equalsIndex < 0 || colonIndex < equalsIndex) ? ":" : "=";
    const index = line.indexOf(separator);
    if (index > 0) values[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return values;
}

function getConfig() {
  const file = readEnvFile();
  return {
    jiraUrl: process.env.JIRA_URL || file.JIRA_URL || "",
    jiraEmail: process.env.JIRA_EMAIL || file.JIRA_EMAIL || "",
    jiraToken: process.env.JIRA_TOKEN || file.JIRA_TOKEN || "",
    groqKey: process.env.GROQ_API_KEY || file.GROQ_API_KEY || ""
  };
}

function jiraAuth(config) {
  return "Basic " + Buffer.from(`${config.jiraEmail}:${config.jiraToken}`).toString("base64");
}

function validateIssueKey(key) {
  return /^[A-Z][A-Z0-9]*-[1-9][0-9]*$/i.test(String(key || "").trim());
}

function adfToText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(adfToText).filter(Boolean).join("\n");
  if (typeof value === "object") {
    const ownText = typeof value.text === "string" ? value.text : "";
    const content = adfToText(value.content);
    return [ownText, content].filter(Boolean).join(ownText && content ? "\n" : "");
  }
  return "";
}

function extractFields(issue) {
  const fields = issue.fields || {};
  const customText = Object.entries(fields)
    .filter(([key]) => key.startsWith("customfield_"))
    .map(([, value]) => adfToText(value).trim())
    .filter(Boolean)
    .join("\n");
  return {
    key: issue.key,
    title: fields.summary || "Insufficient information to determine.",
    description: adfToText(fields.description).trim() || "Insufficient information to determine.",
    acceptanceCriteria: customText || "Insufficient information to determine.",
    status: fields.status?.name || "Insufficient information to determine.",
    issueType: fields.issuetype?.name || "Insufficient information to determine.",
    priority: fields.priority?.name || "Insufficient information to determine.",
    labels: Array.isArray(fields.labels) ? fields.labels : [],
    components: Array.isArray(fields.components) ? fields.components.map(item => item.name) : [],
    fixVersions: Array.isArray(fields.fixVersions) ? fields.fixVersions.map(item => item.name) : []
  };
}

const missing = "Insufficient information to determine.";

function buildFallbackPlan(issue) {
  const description = issue.description === missing ? "" : issue.description;
  const acceptance = issue.acceptanceCriteria === missing ? "" : issue.acceptanceCriteria;
  const inScope = description ? `- ${description}` : `- ${missing}`;
  const objective = acceptance
    ? "Verify the Jira requirement and proposed acceptance scenarios."
    : `Verify the retrieved Jira issue ${issue.key} against its documented behavior.`;
  return `# Test Plan — ${issue.key}: ${issue.title}

> Status: **DRAFT — pending human review.** Not approved until a QA owner signs off.

## 1. Scope & Objectives
- **In scope:**
${inScope}
- **Out of scope:**
- ${missing}
- **Objective:** ${objective}

## 2. Gaps & Questions for the author
| # | Area | Finding (⚠️/❌) | Question to author |
|---|------|----------------|--------------------|
| 1 | Requirements | ${acceptance ? "⚠️ Acceptance detail requires review." : "⚠️ No separate acceptance criteria was retrieved."} | ${acceptance ? "Please confirm the acceptance criteria are complete." : "Please provide acceptance criteria."} |

## 3. Test Scenarios
| ID | Priority | Type (pos/neg/boundary) | Scenario | Maps to (AC / gap) |
|----|----------|-------------------------|----------|--------------------|
| TS-1 | P0 | positive | Proposed: Verify the documented Jira behavior for ${issue.key}. | ${acceptance ? "Retrieved AC" : "Gap"} |
| TS-2 | P1 | negative | Proposed: Verify the behavior for a clearly invalid or unsupported input, if applicable. | Gap |

## 4. Test Data & Environment
- **Data:** ${missing}
- **Environment / flags:** ${missing}
- **Roles / permissions:** ${missing}

## 5. Risks & Assumptions
- **Assumptions made:** Proposed testing activities are derived only from retrieved issue information.
- **Risks:** ${missing}

## 6. Entry / Exit criteria
- **Entry:** ${missing}
- **Exit:** ${missing}

## 7. Resource Allocation
- ${missing}

## 8. Timelines, Sprint Details
- ${missing}

---
## HUMAN REVIEW GATE
- **I assumed:** The issue description and retrieved metadata are complete and authoritative.
- **I could not confirm:** ${missing}
- **Open questions blocking sign-off:** ${acceptance ? "Confirm acceptance criteria and test environment." : "Confirm acceptance criteria, test environment, test data, entry/exit criteria, and resources."}
- **Approve, or edit, before I write test cases / automation.**`;
}

async function generateWithGroq(config, issue) {
  if (!config.groqKey) return null;
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.groqKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "Generate a test plan only from provided Jira data. Use the exact template supplied by the user. Do not invent facts. Label proposals as Proposed. Where details are absent, use exactly: Insufficient information to determine."
        },
        {
          role: "user",
          content: `Follow this exact structure and section names:\n${await fs.promises.readFile(path.resolve(projectRoot, "01_Plan/Test_plan_template.md"), "utf8")}\n\nJira issue JSON:\n${JSON.stringify(issue)}`
        }
      ]
    })
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI generation failed (${response.status})${detail ? ": provider returned an error" : ""}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

app.get("/api/health", (_req, res) => {
  const config = getConfig();
  res.json({
    jiraConfigured: Boolean(config.jiraUrl && config.jiraEmail && config.jiraToken),
    aiConfigured: Boolean(config.groqKey)
  });
});

app.post("/api/settings/test-jira", async (_req, res) => {
  const config = getConfig();
  if (!config.jiraUrl || !config.jiraEmail || !config.jiraToken) {
    return res.status(400).json({ error: "Jira configuration is missing." });
  }
  try {
    const response = await fetch(`${config.jiraUrl.replace(/\/$/, "")}/rest/api/3/myself`, {
      headers: { Authorization: jiraAuth(config), Accept: "application/json" }
    });
    if (!response.ok) return res.status(response.status).json({ error: "Jira authentication or permission check failed." });
    const data = await response.json();
    res.json({ ok: true, account: data.displayName || data.emailAddress || "Authenticated" });
  } catch {
    res.status(502).json({ error: "Could not reach the Jira server." });
  }
});

app.post("/api/settings/test-ai", async (_req, res) => {
  const config = getConfig();
  if (!config.groqKey) return res.status(400).json({ error: "Groq API key is missing." });
  try {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${config.groqKey}` }
    });
    if (!response.ok) return res.status(response.status).json({ error: "Groq authentication or configuration check failed." });
    res.json({ ok: true });
  } catch {
    res.status(502).json({ error: "Could not reach the Groq API." });
  }
});

app.post("/api/generate", async (req, res) => {
  const key = String(req.body?.issueKey || "").trim().toUpperCase();
  if (!validateIssueKey(key)) return res.status(400).json({ error: "Enter a valid Jira issue ID, for example KAN-123." });
  const config = getConfig();
  if (!config.jiraUrl || !config.jiraEmail || !config.jiraToken) {
    return res.status(400).json({ error: "Jira configuration is missing. Add JIRA_URL, JIRA_EMAIL, and JIRA_TOKEN." });
  }
  try {
    const response = await fetch(
      `${config.jiraUrl.replace(/\/$/, "")}/rest/api/3/issue/${encodeURIComponent(key)}?fields=*all`,
      { headers: { Authorization: jiraAuth(config), Accept: "application/json" } }
    );
    if (response.status === 404) return res.status(404).json({ error: "The Jira issue was not found." });
    if (response.status === 401) return res.status(401).json({ error: "Jira authentication failed." });
    if (response.status === 403) return res.status(403).json({ error: "Permission denied by Jira." });
    if (!response.ok) return res.status(response.status).json({ error: "Jira could not retrieve this issue." });
    const issue = extractFields(await response.json());
    let plan;
    let generator = "Deterministic template";
    try {
      plan = await generateWithGroq(config, issue);
      if (plan) generator = "Groq";
    } catch {}
    if (!plan) plan = buildFallbackPlan(issue);
    res.json({ issue, plan, generator });
  } catch (error) {
    if (error instanceof TypeError) return res.status(502).json({ error: "Could not reach Jira or the network connection failed." });
    return res.status(500).json({ error: "Unexpected server error while generating the test plan." });
  }
});

const port = Number(process.env.PORT || 3001);
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
}

export default app;
