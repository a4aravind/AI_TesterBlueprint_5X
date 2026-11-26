import { test, expect } from "../src/fixtures/testFixtures";

test.describe("Wingify valid login", () => {
  test("logs in with configured valid credentials", async ({ loginPage, page }) => {
    const email = process.env.WINGIFY_VALID_EMAIL;
    const password = process.env.WINGIFY_VALID_PASSWORD;

    test.skip(!email || !password, "Set WINGIFY_VALID_EMAIL and WINGIFY_VALID_PASSWORD to run this test.");

    await loginPage.open();
    await loginPage.login(email!, password!, true);

    await expect
      .poll(
        () => page.url(),
        { timeout: 30_000 }
      )
      .not.toContain("/#/login");
  });
});
