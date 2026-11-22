package com.aitesterblueprint.salesforce.tests;

import com.aitesterblueprint.salesforce.base.BaseTest;
import com.aitesterblueprint.salesforce.pages.LoginPage;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

@Epic("Salesforce Login")
@Feature("Invalid Login")
public class InvalidLoginTest extends BaseTest {

    @DataProvider(name = "invalidEmails")
    public Object[][] invalidEmails() {
        return new Object[][]{
                {""},
                {"not-an-email"}
        };
    }

    @Test(description = "Verify invalid email values are rejected", dataProvider = "invalidEmails")
    @Description("Checks required and malformed email input on the email-first login page.")
    public void invalidEmailMustRemainOnLoginPage(String invalidEmail) {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.open();
        loginPage.enterEmail(invalidEmail);
        loginPage.clickContinue();

        Assert.assertTrue(loginPage.isOnSalesforceLoginPage(), "Invalid email must not navigate beyond login");
        Assert.assertTrue(loginPage.isValidationMessageVisible(),
                "A validation message or unchanged login page must be visible");
    }

    @Test(description = "Verify invalid username and password are rejected")
    @Description("Uses obviously invalid credentials and verifies that login remains on Salesforce.")
    public void invalidCredentialsMustRemainOnLoginPage() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.open();
        loginPage.openUsernameLogin();
        loginPage.enterUsername("invalid.user@example.invalid");
        loginPage.enterPassword("InvalidPassword!123");
        loginPage.clickLogIn();

        new org.openqa.selenium.support.ui.WebDriverWait(driver, java.time.Duration.ofSeconds(20))
                .until(currentDriver -> currentDriver.getCurrentUrl().contains("login.salesforce.com"));
        Assert.assertTrue(loginPage.isOnSalesforceLoginPage(),
                "Invalid credentials must remain on Salesforce login");
    }

    @Test(description = "Verify Remember Me can be toggled")
    public void rememberMeCanBeToggled() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.open();
        boolean initiallySelected = loginPage.isRememberMeSelected();
        loginPage.toggleRememberMe();
        Assert.assertNotEquals(loginPage.isRememberMeSelected(), initiallySelected,
                "Remember Me selection state must change after one click");
    }
}
