import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API = "/api";

function App() {
  const [page, setPage] = useState("main");
  const [issueKey, setIssueKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function generate(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueKey })
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("The server returned an invalid response. Please try again.");
      }
      if (!response.ok) throw new Error(data.error || "Could not generate the test plan.");
      setResult(data);
    } catch (caught) {
      setError(caught.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <nav>
        <button className={page === "main" ? "active" : ""} onClick={() => setPage("main")}>Main Page</button>
        <button className={page === "settings" ? "active" : ""} onClick={() => setPage("settings")}>Settings</button>
      </nav>
      {page === "main" ? (
        <section className="card">
          <h1>Jira Test Plan Generator</h1>
          <form onSubmit={generate}>
            <label htmlFor="issue">Jira issue ID</label>
            <input
              id="issue"
              value={issueKey}
              onChange={(event) => setIssueKey(event.target.value)}
              placeholder="KAN-123"
              disabled={loading}
              autoComplete="off"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Prompt (JIRA Ticket)"}
            </button>
          </form>
          {error && <div className="error" role="alert">{error}</div>}
          {result ? (
            <article className="reply">
              <div className="meta">
                <strong>{result.issue.key}</strong>
                <span>{result.generator}</span>
              </div>
              <pre>{result.plan}</pre>
            </article>
          ) : (
            <div className="reply empty">
              {loading ? "Retrieving Jira and generating the test plan..." : "Reply with test plan"}
            </div>
          )}
        </section>
      ) : <Settings />}
    </main>
  );
}

function Settings() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");

  async function test(endpoint, label) {
    setBusy(label);
    setMessage("");
    try {
      const response = await fetch(`${API}/settings/${endpoint}`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Connection test failed.");
      setMessage(label === "Jira" ? `Jira connected${data.account ? ` as ${data.account}` : "."}` : "Groq connected.");
    } catch (caught) {
      setMessage(caught.message);
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="card settings-card">
      <h1>Settings</h1>
      <div className="settings-box">
        <h2>JIRA Connection</h2>
        <p>Token, Email, URL</p>
        <button onClick={() => test("test-jira", "Jira")} disabled={Boolean(busy)}>
          {busy === "Jira" ? "Testing..." : "Test connection"}
        </button>
      </div>
      <div className="settings-box">
        <h2>LLM Configuration</h2>
        <p>1. OLLAMA connection<br />2. <span>groq.com</span> (API Key)</p>
        <button onClick={() => test("test-ai", "Groq")} disabled={Boolean(busy)}>
          {busy === "Groq" ? "Testing..." : "Test groq.com"}
        </button>
      </div>
      {message && <div className="status">{message}</div>}
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
