import { test, expect } from "../src/fixtures/testFixtures";

test.describe("Wingify valid login", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus && !page.isClosed()) {
      await testInfo.attach("failure-page-url", {
        body: Buffer.from(page.url()),
        contentType: "text/plain"
      });
    }
  });

  test("transitions away from the login page with valid credentials", async ({ loginPage, page }) => {
    const email = process.env.VALID_USER;
    const password = process.env.VALID_PASSWORD;

    test.skip(!email || !password, "VALID_USER and VALID_PASSWORD must be configured.");

    await loginPage.signIn(email!, password!, true);
    await expect(page).not.toHaveURL(/#\/login/);
  });
});
