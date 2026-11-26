# Bug Report

**Label:** Hypothetical training example

## Title

Password left empty: Login form submits without visible validation feedback

## Environment

| Item | Details |
|---|---|
| Application | https://app.vwo.com/ |
| Browser / version | Not supplied |
| Operating system | Not supplied |
| Build | Not supplied |
| Execution time | Not supplied |

## Preconditions

- The user is logged out.
- A registered test email placeholder is available.

## Test Data

| Field | Value |
|---|---|
| Email | `<registered_email>` |
| Password | `<empty_password>` |

## Steps to Reproduce

1. Open https://app.vwo.com/.
2. Enter `<registered_email>` in the email field.
3. Leave the password field empty.
4. Submit the login form.

## Expected Result

The login request must not proceed because the password is mandatory. The interface should provide visible feedback that the password is required. The exact validation text is not specified and must not be assumed.

## Actual Result

Observed: The form submits, and no visible validation feedback appears after submission.

Assumption: This behavior may indicate that mandatory-password validation is absent or does not run at the UI. This is not confirmed until the application behavior and logs are reviewed.

## Reproducibility

3 out of 3 attempts.

## Suggested Severity

**Provisional:** Medium.

Rationale: The reported state allows the login submission to proceed without supplying a mandatory password. This prevents immediate authentication without known password data, but the impact on authentication, account security, and user workflow requires confirmation. Severity is provisional because the issue is hypothetical and browser, build, environment, and security details were not supplied.

## Attachments

Not provided.
