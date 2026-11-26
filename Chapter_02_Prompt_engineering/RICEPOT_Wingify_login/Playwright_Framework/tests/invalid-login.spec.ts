import { test } from "../src/fixtures/testFixtures";

test.describe("Wingify invalid login", () => {
  test("shows an authentication error for invalid credentials", async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login("invalid.user@example.com", "InvalidPassword123!");
    await loginPage.expectAuthenticationError();
  });
});
