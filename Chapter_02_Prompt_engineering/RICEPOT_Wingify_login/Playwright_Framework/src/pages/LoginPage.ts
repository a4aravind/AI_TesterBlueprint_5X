import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly forgotPasswordButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly authenticationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("(//input[@placeholder='Enter email ID'])[1]");
    this.passwordInput = page.locator("(//input[@placeholder='Enter password'])[1]");
    this.signInButton = page.locator("(//button[normalize-space()='Sign in'])[1]");
    this.forgotPasswordButton = page.locator("(//button[normalize-space()='Forgot Password?'])[1]");
    this.rememberMeCheckbox = page.locator("(//input[@type='checkbox'])[1]");
    this.authenticationError = page.locator("(//div[contains(@class, 'notification-box')][contains(normalize-space(), 'Your email, password, IP address or location did not match')])[1]");
  }

  async open(): Promise<void> {
    await this.page.goto("/#/login");
    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string, rememberMe = false): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    await this.signInButton.click();
  }

  async expectAuthenticationError(): Promise<void> {
    await expect(this.authenticationError).toBeVisible();
  }
}
