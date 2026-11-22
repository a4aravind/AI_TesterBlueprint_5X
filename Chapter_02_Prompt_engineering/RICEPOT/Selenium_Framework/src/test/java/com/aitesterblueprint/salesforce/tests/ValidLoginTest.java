package com.aitesterblueprint.salesforce.tests;

import com.aitesterblueprint.salesforce.base.BaseTest;
import com.aitesterblueprint.salesforce.pages.LoginPage;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.Test;

@Epic("Salesforce Login")
@Feature("Valid Login")
public class ValidLoginTest extends BaseTest {

    @Test(description = "Verify valid username and password login")
    @Description("Uses test credentials supplied through System properties or environment variables.")
    public void validLoginWithConfiguredCredentials() {
        String username = firstConfiguredValue("salesforce.username", "SALESFORCE_USERNAME");
        String password = firstConfiguredValue("salesforce.password", "SALESFORCE_PASSWORD");

        if (username.isBlank() || password.isBlank()) {
            throw new SkipException(
                    "Set -Dsalesforce.username and -Dsalesforce.password, or SALESFORCE_USERNAME and SALESFORCE_PASSWORD.");
        }

        LoginPage loginPage = new LoginPage(driver);
        loginPage.open();
        Assert.assertTrue(loginPage.isEmailLoginVisible(), "Email login controls must be visible");
        loginPage.openUsernameLogin();
        loginPage.enterUsername(username);
        loginPage.enterPassword(password);
        loginPage.clickLogIn();

        org.openqa.selenium.support.ui.WebDriverWait wait =
                new org.openqa.selenium.support.ui.WebDriverWait(driver, java.time.Duration.ofSeconds(20));
        wait.until(currentDriver -> !currentDriver.getCurrentUrl().contains("login.salesforce.com"));
        Assert.assertFalse(loginPage.isOnSalesforceLoginPage(), "A valid login must navigate away from login.salesforce.com");
    }

    private String firstConfiguredValue(String propertyName, String environmentName) {
        String propertyValue = System.getProperty(propertyName);
        if (propertyValue != null) {
            return propertyValue.trim();
        }
        String environmentValue = System.getenv(environmentName);
        return environmentValue == null ? "" : environmentValue.trim();
    }
}
