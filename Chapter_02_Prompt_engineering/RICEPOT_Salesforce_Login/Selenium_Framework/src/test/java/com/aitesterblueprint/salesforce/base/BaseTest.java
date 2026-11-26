package com.aitesterblueprint.salesforce.base;

import io.github.bonigarcia.wdm.WebDriverManager;
import java.time.Duration;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import io.qameta.allure.Allure;
import java.io.ByteArrayInputStream;

public class BaseTest {
    protected WebDriver driver;

    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        try {
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
            options.setBinary("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe");
            options.addArguments("--start-maximized");
            options.addArguments("--disable-notifications");

            if ("true".equalsIgnoreCase(System.getProperty("headless"))) {
                options.addArguments("--headless=new");
            }

            driver = new ChromeDriver(options);
            driver.manage().timeouts().implicitlyWait(Duration.ZERO);
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
        } catch (RuntimeException exception) {
            throw new IllegalStateException("Unable to start the Chrome WebDriver", exception);
        }
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        try {
            if (result != null && !result.isSuccess() && driver instanceof TakesScreenshot screenshotDriver) {
                Allure.addAttachment(
                        "Failure screenshot",
                        "image/png",
                        new ByteArrayInputStream(screenshotDriver.getScreenshotAs(OutputType.BYTES)),
                        ".png");
            }
        } finally {
            if (driver != null) {
                try {
                    driver.quit();
                } catch (RuntimeException exception) {
                    Allure.addAttachment("Teardown warning", exception.getMessage());
                }
            }
        }
    }
}
