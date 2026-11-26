package com.aitesterblueprint.salesforce.pages;

import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//input[@placeholder='Enter your email address...']")
    private WebElement emailInput;

    @FindBy(xpath = "//button[normalize-space()='Continue']")
    private WebElement continueButton;

    @FindBy(xpath = "//input[@type='checkbox']")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//a[normalize-space()='Log In with Username']")
    private WebElement usernameLoginLink;

    @FindBy(xpath = "//input[@aria-label='Username' or @placeholder='Username']")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@aria-label='Password' or @placeholder='Password' or @type='password']")
    private WebElement passwordInput;

    @FindBy(xpath = "//input[@value='Log In']")
    private WebElement logInButton;

    @FindBy(xpath = "//*[contains(normalize-space(), 'Please enter') or contains(normalize-space(), 'Invalid') or contains(normalize-space(), 'incorrect') or contains(normalize-space(), 'not recognized')]")
    private WebElement validationMessage;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        try {
            PageFactory.initElements(driver, this);
        } catch (RuntimeException exception) {
            throw new IllegalStateException("Unable to initialize Salesforce login page elements", exception);
        }
    }

    public void open() {
        try {
            driver.get("https://login.salesforce.com/?locale=in");
            wait.until(org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf(emailInput));
        } catch (TimeoutException exception) {
            throw new IllegalStateException("Salesforce email login page did not load", exception);
        }
    }

    public boolean isEmailLoginVisible() {
        try {
            return wait.until(org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf(emailInput)).isDisplayed()
                    && continueButton.isDisplayed();
        } catch (RuntimeException exception) {
            return false;
        }
    }

    public void enterEmail(String email) {
        try {
            wait.until(org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf(emailInput)).clear();
            emailInput.sendKeys(email);
        } catch (RuntimeException exception) {
            throw new IllegalStateException("Unable to enter the Salesforce email", exception);
        }
    }

    public void clickContinue() {
        try {
            wait.until(org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable(continueButton)).click();
        } catch (RuntimeException exception) {
            throw new IllegalStateException("Unable to click Continue", exception);
        }
    }

    public void toggleRememberMe() {
        try {
            WebElement checkbox = wait.until(
                    org.openqa.selenium.support.ui.ExpectedConditions.presenceOfElementLocated(
                            By.xpath("//input[@type='checkbox']")));
            org.openqa.selenium.JavascriptExecutor executor =
                    (org.openqa.selenium.JavascriptExecutor) driver;
            executor.executeScript("arguments[0].click();", checkbox);
        } catch (RuntimeException exception) {
            throw new IllegalStateException("Unable to toggle Remember Me", exception);
        }
    }

    public boolean isRememberMeSelected() {
        try {
            return rememberMeCheckbox.isSelected();
        } catch (RuntimeException exception) {
            return false;
        }
    }

    public void openUsernameLogin() {
        try {
            if (!driver.getCurrentUrl().contains("login=1")) {
                wait.until(org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable(usernameLoginLink)).click();
            }
            wait.until(org.openqa.selenium.support.ui.ExpectedConditions.or(
                    org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated(
                            By.xpath("//input[@aria-label='Username' or @placeholder='Username']")),
                    org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated(
                                    By.xpath("//input[@type='email']"))));
        } catch (RuntimeException exception) {
            throw new IllegalStateException("Unable to open username login", exception);
        }
    }

    public void enterUsername(String username) {
        try {
            WebElement input = wait.until(org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//input[@aria-label='Username' or @placeholder='Username' or @type='email']")));
            input.clear();
            input.sendKeys(username);
        } catch (RuntimeException exception) {
            throw new IllegalStateException("Unable to enter username", exception);
        }
    }

    public void enterPassword(String password) {
        try {
            java.util.List<WebElement> passwordInputs = driver.findElements(
                    By.xpath("//input[@aria-label='Password' or @placeholder='Password' or @type='password']"));
            if (!passwordInputs.isEmpty()) {
                WebElement input = wait.until(
                        org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf(passwordInputs.get(0)));
                input.clear();
                input.sendKeys(password);
            }
        } catch (RuntimeException exception) {
            throw new IllegalStateException("Unable to enter password", exception);
        }
    }

    public void clickLogIn() {
        try {
            WebElement button = wait.until(org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable(
                    By.xpath("//input[@value='Log In']")));
            button.click();
        } catch (RuntimeException exception) {
            throw new IllegalStateException("Unable to click Log In", exception);
        }
    }

    public boolean isValidationMessageVisible() {
        try {
            WebElement message = wait.until(
                    org.openqa.selenium.support.ui.ExpectedConditions.presenceOfElementLocated(
                            By.xpath("//*[contains(normalize-space(), 'Please enter') or contains(normalize-space(), 'Invalid') or contains(normalize-space(), 'incorrect') or contains(normalize-space(), 'not recognized')]")));
            return message.isDisplayed();
        } catch (RuntimeException exception) {
            return false;
        }
    }

    public String getValidationText() {
        try {
            return wait.until(org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//*[contains(normalize-space(), 'Please enter') or contains(normalize-space(), 'Invalid') or contains(normalize-space(), 'incorrect') or contains(normalize-space(), 'not recognized')]")))
                    .getText();
        } catch (TimeoutException exception) {
            return "";
        }
    }

    public boolean isOnSalesforceLoginPage() {
        return driver.getCurrentUrl().contains("login.salesforce.com");
    }
}
