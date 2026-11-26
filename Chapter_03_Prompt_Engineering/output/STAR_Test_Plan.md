# Test Plan

## 1. Test Plan

| Field | Details |
|---|---|
| ID | TP-VWO-LOGIN-001 |
| Title | Functional Test Plan for the VWO Login Module |
| Objective | Verify that the login module allows registered users to authenticate, rejects invalid credentials, enforces mandatory email and password fields, and opens the authenticated dashboard only after successful login. |

## 2. Scope

### In Scope
- Valid login for a registered user.
- Invalid credentials and rejection behavior.
- Mandatory email and password fields.
- Authenticated dashboard access after successful login.
- Positive, negative, and supported boundary scenarios for the login form.
- Observable UI, navigation, and access behavior.

### Out of Scope
- Password creation or reset functionality.
- Password complexity and strength rules.
- Account registration and account administration.
- Session timeout behavior.
- IP address and location validation details.
- Performance, load, security, penetration, and usability testing.
- Mobile applications and browser compatibility unless separately approved.

## 3. Test Approach

Testing will use manual functional testing against the approved login requirements. Scenarios will be executed in an authenticated and unauthenticated browser state, and results will be traced to the supplied requirements.

| Test Scenario | Priority | Test Type |
|---|---|---|
| Valid registered email and password | High | Positive |
| Invalid password for a registered email | High | Negative |
| Unregistered or unknown email | High | Negative |
| Empty email field | High | Negative |
| Empty password field | High | Negative |
| Both email and password fields empty | High | Negative |
| Email and password containing only whitespace | Medium | Boundary / Negative |
| Valid login followed by dashboard access | High | Positive |
| Direct access to dashboard before login | High | Negative / Access control |
| Direct access to dashboard after logout | High | Negative / Access control |
| Login with one valid and one invalid field | Medium | Negative |
| No successful login for invalid credentials | High | Negative |

> Exact field-validation messages, password-policy behavior, session timeout behavior, and post-logout behavior are not specified. These items are marked **Requires clarification** and are not inferred.

## 4. Test Environment and Test Data

### Environment Needs
- Browser access to `https://app.vwo.com/`
- An active registered test account for valid-login scenarios
- A test account that can be logged out and used repeatedly
- A stable test environment that does not affect production data
- Test credentials stored through approved secure test-data processes

### Test Data

| Data | Value |
|---|---|
| Registered email | `<registered_email>` |
| Valid password | `<valid_password>` |
| Invalid password | `<invalid_password>` |
| Unregistered email | `<unregistered_email>` |
| Empty email | Empty value |
| Empty password | Empty value |
| Whitespace-only value | `<whitespace_only>` |

## 5. Entry and Exit Criteria

### Entry Criteria
- Approved login requirements are available.
- The test environment and login page are reachable.
- At least one active registered test account is available.
- Secure test credentials are prepared.
- Test environment account state can be reset or changed as needed.

### Exit Criteria
- Recommendation: All High-priority login scenarios are executed.
- Recommendation: No open Critical or High defects prevent valid login or unauthorized access protection.
- Recommendation: Remaining defects and open clarifications are documented and assigned.
- Invalid-credential error behavior is verified against: `Your email, password, IP address or location did not match`
- Test evidence and execution results are recorded.

## 6. Test Deliverables

- Executed login test plan results.
- Login test case evidence, such as screenshots or logs where available.
- Defect reports for reproducible failures.
- Requirement traceability summary.
- List of clarified and unresolved requirements.

## 7. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| External login service or network is unavailable. | Login scenarios cannot be executed. | Retest when the service is available and record environment downtime. |
| Test account is not active or credentials are invalid. | Valid-login scenarios may be blocked. | Confirm account status before execution and maintain a controlled test account. |
| Real or sensitive credentials are used. | Credential exposure. | Use placeholders and approved test credentials only. |
| Missing requirements are guessed during testing. | Tests may validate unintended behavior. | Mark unknown behavior as **Requires clarification** and obtain approval before adding assertions. |
| IP address or location differences affect login. | Invalid-login behavior may appear inconsistent. | Record test environment network and location, and seek clarification for environment-dependent behavior. |
| Direct dashboard access behavior is not consistently enforceable. | Protected resources may be exposed. | Verify in an isolated browser session and document all redirects and unauthorized content. |

## 8. Open Questions

| ID | Open Question | Status |
|---|---|---|
| OQ-001 | What exact validation message, if any, must be shown when email or password is empty? | Requires clarification |
| OQ-002 | Are email addresses trimmed, and are whitespace-only values treated as empty? | Requires clarification |
| OQ-003 | What is the required behavior after logout or on direct dashboard access? | Requires clarification |
| OQ-004 | What password rules or password-length boundaries apply? | Requires clarification |
| OQ-005 | Is there a lockout, retry limit, or session timeout for repeated attempts? | Requires clarification |
| OQ-006 | Are IP address and location checks configurable, and which expected behavior applies in the test environment? | Requires clarification |
