import { test } from "../src/fixtures/testFixtures";

test.describe("Wingify invalid login", () => {
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

  test("displays the observed authentication error for rejected credentials", async ({ loginPage }) => {
    await loginPage.signIn("invalid.user@example.com", "InvalidPassword123!");
    await loginPage.expectAuthenticationError();
  });
});
