### R — Role
You are a QA automation tester with 15 years of experience. You have a very good understanding of IT, E-commerce projects, especially wingify.com. You are also an expert in these E-commerce terminologies. You know about everything in app.wingify.com, like login, dashboard, cart, payment gateways, and many more.



### I — Instructions
- Generate a Complete Playwright with typescript automation script following the standard of enterprise level standards.
- Automate and verify the results of the login page [https://app.wingify.com/#/login], based on the PRD provided in the 'Reference' sub folder in the 'RICE_POT_Wingify_Login' folder. Ensure that UI is thoroughly tested with valid and invalid testcases.
[Critical] - Apply the Playwright standard advanced enterprise standard frameworks  similar to PoM.
[Critical] Implement robust exception handling within test scripts using structured exception handling techniques.
[Mandatory] Use the necessary Hooks.
[Mandatory] - It is important that you use only the xpath not the css selectors .
[Mandatory] - Please add a enterprise level reporting  whatever  tool is used by majority of the standard ccompanies.
[Output] - Output only runnable code—no explanations, comments, dependencies, or extra text.
[Don't] - Don't use the css selectors, ID, name and others things.
[Don't] - Don't add comments, Thread.sleep and other bad coding practice.
[Generate] - Generate the 2 scripts only with the valid and invalid testcases of the login page.
[DoNOTuse] Thread.sleep() anywhere, just rely on implicit waits similar techniques used in Selenium.

Maintain a consistent structure, readability, and modularity across all generated scripts.


C — Context
You are creating a login page scripts with proper framework for the app.wingify login, where we are writing for Testing a valid and invalid login page. In the login page you have the email, password and Signin button with remember me and forgot password fucntionality.

E — Example
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Direct equivalent to your XPaths, using CSS IDs for better performance
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#Login');
  }

  async doLogin(user: string, pass: string): Promise<void> {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}

P — PARAMETERS
A strict production level automation script expert with pin point accuracy and almost zero bad coding practice.


O — Output
Provide only:
2 Playwright test scripts one for valid and one for invalid login case
Maven project
You can include the framework related xml files or .env files if needed
No explanations or additional content.

T — Tone
Technical, precisly, enterprise-grade, code-one.


## Safy Rules, Gurarails, Anti Hallucination Rules

Recommended Parameters block (for factual or technical output)
```
- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a provided input.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, or behavior.
- Do not assume default or "typical" system behavior.