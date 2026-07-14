# Acceptance Criteria

Acceptance criteria for every Story in [STORIES.md](STORIES.md), aligned with [EPICS.md](EPICS.md) and [../modernization-config.md](../modernization-config.md). Each Story defines functional acceptance criteria, Given/When/Then scenarios, and explicit success and failure conditions. The overarching rule for all Stories: **existing business rules, workflows, and the MySQL database schema remain unchanged; only the architecture is modernized, and the modern application must demonstrate parity with the legacy application.**

---

# EPIC-01 — Frontend Modernization (React)

## AC-101 — Modernize the Login Experience

**Functional Acceptance Criteria**
- The administrator can sign in through the React frontend using the existing credential model.
- Successful sign-in routes the user to the authenticated landing view; failure shows an error and does not.
- No protected view is shown without successful authentication.

**Scenarios**
- Given valid credentials, When the administrator submits the login form, Then they are authenticated and taken to the product list.
- Given invalid credentials, When the administrator submits the login form, Then an error is shown and access is denied.
- Given empty fields, When the administrator submits, Then client-side validation blocks submission.

**Success Conditions:** Valid credentials authenticate with the same outcome as legacy; the session/token is established.
**Failure Conditions:** Invalid or empty credentials are rejected; no landing view is rendered without authentication.

## AC-102 — Modernize the Product Listing View

**Functional Acceptance Criteria**
- The list displays the same product fields (name, price, quantity) and per-row actions as the legacy dashboard.
- Both empty and populated inventories render correctly.
- Displayed data is safely encoded.

**Scenarios**
- Given products exist, When the list loads, Then all products and their actions appear as in legacy.
- Given no products, When the list loads, Then an empty state is shown without error.
- Given a product name containing markup, When it is displayed, Then it renders as text, not executable markup.

**Success Conditions:** Listing matches legacy content and actions for empty and populated states.
**Failure Conditions:** Missing fields/actions, rendering errors, or unsafe rendering of data.

## AC-103 — Modernize the Add Product Experience

**Functional Acceptance Criteria**
- A new product can be created with the same inputs and result as the legacy add flow.
- Invalid input is handled consistent with legacy; refresh after submit does not duplicate.

**Scenarios**
- Given valid product details, When the administrator submits the add form, Then the product is created and the list reflects it.
- Given a non-numeric price or quantity < 1, When submitting, Then the input is rejected.
- Given a successful submission, When the page is refreshed, Then no duplicate product is created.

**Success Conditions:** Valid input creates an equivalent record to legacy; no duplicate on refresh.
**Failure Conditions:** Invalid input persists a record; refresh creates duplicates.

## AC-104 — Modernize the Edit Product Experience

**Functional Acceptance Criteria**
- An existing product loads pre-filled, can be modified, and saved with the same behavior as legacy.
- Invalid or non-existent identifiers are handled consistent with legacy.

**Scenarios**
- Given a valid product, When the administrator opens edit, Then the form is pre-filled with current values.
- Given modified valid values, When saving, Then the product updates and the change persists.
- Given a non-existent identifier, When loading edit, Then a not-found outcome is shown as in legacy.

**Success Conditions:** Valid updates persist as in legacy; invalid identifiers are handled gracefully.
**Failure Conditions:** Updates fail to persist, or invalid identifiers cause inconsistent behavior.

## AC-105 — Modernize the Delete Product Experience

**Functional Acceptance Criteria**
- A product can be removed with the same result as legacy, only after an explicit confirmation.
- Cancelling the confirmation makes no change.

**Scenarios**
- Given a product, When the administrator confirms deletion, Then the product is removed as in legacy.
- Given a product, When the administrator cancels the confirmation, Then nothing is deleted.
- Given a non-existent identifier, When deletion is attempted, Then the outcome is consistent with legacy.

**Success Conditions:** Confirmed deletions remove the equivalent record to legacy; cancellations are no-ops.
**Failure Conditions:** Deletion occurs without confirmation, or fails to remove a valid product.

## AC-106 — Consistent Frontend Navigation and Shared UI

**Functional Acceptance Criteria**
- All modernized screens are reachable through consistent navigation that mirrors the legacy user journey.

**Scenarios**
- Given the application is running, When the administrator navigates between screens, Then navigation is consistent across all screens.
- Given any modernized screen, When viewed, Then it uses the shared shell/styling.

**Success Conditions:** The user journey matches legacy across all screens with consistent navigation.
**Failure Conditions:** Unreachable screens, inconsistent navigation, or a broken user journey.

---

# EPIC-02 — Backend REST API Modernization

## AC-201 — Expose Product Retrieval as a Service

**Functional Acceptance Criteria**
- The service returns the same product information as the legacy listing, over the unchanged database, and requires authentication.

**Scenarios**
- Given an authenticated request, When retrieval is called, Then the same products/fields as legacy are returned.
- Given no products, When retrieval is called, Then an empty result is returned without error.
- Given an unauthenticated request, When retrieval is called, Then access is denied.

**Success Conditions:** Retrieved data matches legacy; database unchanged; auth enforced.
**Failure Conditions:** Missing/incorrect fields, schema changes, or unauthenticated access allowed.

## AC-202 — Expose Product Creation as a Service

**Functional Acceptance Criteria**
- The service creates a product using the same inputs and rules as the legacy add flow, requires authentication, and does not change the schema.

**Scenarios**
- Given valid input and authentication, When create is called, Then an equivalent record to legacy is created.
- Given invalid input, When create is called, Then it is rejected with a consistent failure.
- Given an unauthenticated request, When create is called, Then access is denied.

**Success Conditions:** Valid creation matches legacy; invalid input rejected; DB unchanged.
**Failure Conditions:** Invalid input persists, auth not enforced, or schema altered.

## AC-203 — Expose Product Update as a Service

**Functional Acceptance Criteria**
- The service updates an existing product consistent with the legacy edit flow, requires authentication, and does not change the schema.

**Scenarios**
- Given a valid identifier and values with authentication, When update is called, Then the product is updated as in legacy.
- Given a non-existent identifier, When update is called, Then a not-found outcome is returned.
- Given an unauthenticated request, When update is called, Then access is denied.

**Success Conditions:** Valid updates match legacy; invalid identifiers handled; DB unchanged.
**Failure Conditions:** Updates diverge from legacy, auth not enforced, or schema altered.

## AC-204 — Expose Product Deletion as a Service

**Functional Acceptance Criteria**
- The service removes a product consistent with the legacy delete outcome, requires authentication, and does not change the schema.

**Scenarios**
- Given a valid identifier with authentication, When delete is called, Then the equivalent record to legacy is removed.
- Given a non-existent identifier, When delete is called, Then a not-found outcome is returned.
- Given an unauthenticated request, When delete is called, Then access is denied.

**Success Conditions:** Valid deletions match legacy; invalid identifiers handled; DB unchanged.
**Failure Conditions:** Deletions diverge from legacy, auth not enforced, or schema altered.

## AC-205 — Standardize and Centralize Data Access

**Functional Acceptance Criteria**
- All backend services access the existing database through one standardized, secure, parameterized data-access layer, with no schema, table, or data changes.

**Scenarios**
- Given any backend service, When it accesses data, Then it uses the single shared data-access layer.
- Given user input in a query, When executed, Then it is parameterized (no injection).
- Given the migration is complete, When the schema/data are inspected, Then they are unchanged.

**Success Conditions:** One shared, secure layer in use; no per-service connections; DB verified unchanged.
**Failure Conditions:** Ad-hoc connections remain, non-parameterized queries exist, or schema/data changed.

## AC-206 — Consistent Service Responses and Error Handling

**Functional Acceptance Criteria**
- All services return consistent, predictable success and failure responses that preserve legacy functional outcomes.

**Scenarios**
- Given a successful operation, When it completes, Then a consistent success response is returned.
- Given a failure condition, When it occurs, Then a consistent, predictable failure response is returned without leaking sensitive detail.
- Given equivalent legacy conditions, When compared, Then the functional outcomes match.

**Success Conditions:** Uniform responses across services; functional outcomes match legacy.
**Failure Conditions:** Inconsistent responses, sensitive detail leakage, or changed functional outcomes.

---

# EPIC-03 — Authentication Modernization (API-Based)

## AC-301 — Provide API-Based Authentication

**Functional Acceptance Criteria**
- Authentication is provided as an API-based flow reusing the existing credential model, with outcomes matching the legacy login and no schema change.

**Scenarios**
- Given valid credentials, When authenticating, Then a session/token is established as success.
- Given invalid credentials, When authenticating, Then authentication fails as in legacy.
- Given the single-admin model, When authenticating, Then existing behavior is preserved.

**Success Conditions:** Valid credentials authenticate; invalid fail; parity with legacy; DB unchanged.
**Failure Conditions:** Divergent outcomes, credential model changed, or schema altered.

## AC-302 — Enforce Authenticated Access to Protected Functionality

**Functional Acceptance Criteria**
- No protected functionality is reachable without a valid authenticated session; authorized behavior matches legacy.

**Scenarios**
- Given an unauthenticated request, When accessing protected functionality, Then access is denied.
- Given an authenticated session, When accessing protected functionality, Then access is granted as in legacy.
- Given every protected operation, When tested, Then all enforce authentication (no bypass).

**Success Conditions:** Complete enforcement; authorized behavior matches legacy.
**Failure Conditions:** Any protected operation reachable unauthenticated.

## AC-303 — Secure Credential Handling

**Functional Acceptance Criteria**
- Credentials are stored and verified securely using current practices while preserving login behavior and the unchanged database structure.

**Scenarios**
- Given stored credentials, When inspected, Then they are protected (not plaintext).
- Given valid credentials, When logging in, Then login succeeds as before.
- Given the database structure, When inspected, Then it is unchanged (values-only migration).

**Success Conditions:** Credentials secured; login parity preserved; structure unchanged.
**Failure Conditions:** Credentials exposed, login behavior changed, or structure altered.

---

# EPIC-04 — Build Tooling & Deployment Modernization

## AC-401 — Introduce Managed Dependencies

**Functional Acceptance Criteria**
- Frontend and backend dependencies are managed through a defined, version-tracked mechanism, with no change to functional behavior.

**Scenarios**
- Given the project, When dependencies are inspected, Then they are declared and version-tracked for both tiers.
- Given a clean setup, When dependencies are resolved, Then the application runs.
- Given the managed setup, When behavior is checked, Then it matches legacy.

**Success Conditions:** Managed, resolvable dependencies; behavior unchanged.
**Failure Conditions:** Ungoverned/ad-hoc dependencies remain, or behavior changes.

## AC-402 — Establish a Repeatable Build and Deployment Process

**Functional Acceptance Criteria**
- The application builds and deploys through a documented, repeatable process producing consistent results, without changing functional behavior.

**Scenarios**
- Given the process, When run repeatedly, Then results are consistent across runs.
- Given a deployment, When completed, Then the application runs and passes smoke checks.
- Given the deployed app, When behavior is checked, Then it matches legacy.

**Success Conditions:** Repeatable, consistent build/deploy; behavior unchanged.
**Failure Conditions:** Inconsistent results, or behavior changes.

## AC-403 — Externalize Environment Configuration

**Functional Acceptance Criteria**
- Environment-specific settings are provided externally (no secrets in source), enabling cross-environment runs without code changes and preserving behavior.

**Scenarios**
- Given the source, When inspected, Then no environment-specific values or secrets are embedded.
- Given external configuration, When the app runs, Then it works across environments without code changes.
- Given the running app, When behavior is checked, Then it matches legacy.

**Success Conditions:** External config in use; no embedded secrets; behavior unchanged.
**Failure Conditions:** Embedded secrets/values remain, or behavior changes.

---

# EPIC-05 — Testing & Regression Assurance

## AC-501 — Capture the Legacy Behavioral Baseline

**Functional Acceptance Criteria**
- A complete, accurate behavioral baseline covering all existing features is documented as the parity reference.

**Scenarios**
- Given the legacy application, When each feature is exercised, Then its behavior/outputs are documented.
- Given the baseline, When reviewed, Then it is complete and accurate.
- Given the baseline, When used later, Then it serves as the comparison reference.

**Success Conditions:** Baseline covers all features across behavior/API/UI/database dimensions.
**Failure Conditions:** Missing features, inaccuracies, or unusable reference.

## AC-502 — Establish Regression Coverage for Core Functionality

**Functional Acceptance Criteria**
- A repeatable regression suite covers all core features and is executable against both legacy and modern applications.

**Scenarios**
- Given the baseline, When the suite is authored, Then it covers all core features.
- Given the suite, When run repeatedly, Then it produces consistent, comparable results.
- Given both applications, When the suite runs, Then cases execute against each for comparison.

**Success Conditions:** Complete, repeatable, dual-runnable coverage aligned to the baseline.
**Failure Conditions:** Coverage gaps, non-repeatable cases, or inability to run against both applications.

## AC-503 — Verify Legacy-to-Modern Feature Parity

**Functional Acceptance Criteria**
- The modern application demonstrates functional parity with the legacy application across behavior, API, UI, and database (schema unchanged), with all discrepancies resolved before cutover.

**Scenarios**
- Given the regression suite, When run against both applications, Then outputs are compared across all dimensions.
- Given a discrepancy, When found, Then it is resolved before cutover.
- Given full parity, When confirmed, Then cutover is approved.

**Success Conditions:** Full parity across all dimensions; no unresolved discrepancies; schema unchanged.
**Failure Conditions:** Any unresolved discrepancy, or a database schema change.
