# Traceability Matrix

End-to-end traceability across the modernization program, mapping **Business Feature → Epic → Story → Task → Acceptance Criteria → Test Coverage**. Sources: [EPICS.md](EPICS.md), [STORIES.md](STORIES.md), [TASKS.md](TASKS.md), [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md), and [../context/TEST_STRATEGY.md](../context/TEST_STRATEGY.md). Scope is preserved throughout: Legacy PHP → React frontend → REST API backend → existing MySQL database (unchanged).

Task legend per Story: **-1** = Coding, **-2** = Code Review, **-3** = Testing (validation/parity).

## 1. Master Matrix

| Business Feature | Epic | Story | Tasks | Acceptance Criteria | Test Coverage |
| ---------------- | ---- | ----- | ----- | ------------------- | ------------- |
| User Login (UI) | EPIC-01 | STORY-101 | TASK-101-1/2/3 | AC-101 | Frontend, Acceptance, Parity (login) |
| View Products (UI) | EPIC-01 | STORY-102 | TASK-102-1/2/3 | AC-102 | Frontend, Regression, Parity (list) |
| Add Product (UI) | EPIC-01 | STORY-103 | TASK-103-1/2/3 | AC-103 | Frontend, Regression, Parity (add) |
| Edit Product (UI) | EPIC-01 | STORY-104 | TASK-104-1/2/3 | AC-104 | Frontend, Regression, Parity (edit) |
| Delete Product (UI) | EPIC-01 | STORY-105 | TASK-105-1/2/3 | AC-105 | Frontend, Regression, Parity (delete) |
| Navigation & Shared UI | EPIC-01 | STORY-106 | TASK-106-1/2/3 | AC-106 | Frontend, Acceptance (journey) |
| Product Retrieval (API) | EPIC-02 | STORY-201 | TASK-201-1/2/3 | AC-201 | Unit, API, Parity (retrieve) |
| Product Creation (API) | EPIC-02 | STORY-202 | TASK-202-1/2/3 | AC-202 | Unit, API, Parity (create) |
| Product Update (API) | EPIC-02 | STORY-203 | TASK-203-1/2/3 | AC-203 | Unit, API, Parity (update) |
| Product Deletion (API) | EPIC-02 | STORY-204 | TASK-204-1/2/3 | AC-204 | Unit, API, Parity (delete) |
| Data Access (cross-cutting) | EPIC-02 | STORY-205 | TASK-205-1/2/3 | AC-205 | Unit, Integration, Database parity |
| Consistent Responses/Errors | EPIC-02 | STORY-206 | TASK-206-1/2/3 | AC-206 | API, Integration, Parity (outcomes) |
| API-Based Authentication | EPIC-03 | STORY-301 | TASK-301-1/2/3 | AC-301 | Unit, API, Security, Parity (auth) |
| Access Control Enforcement | EPIC-03 | STORY-302 | TASK-302-1/2/3 | AC-302 | Security, API, Acceptance |
| Secure Credential Handling | EPIC-03 | STORY-303 | TASK-303-1/2/3 | AC-303 | Security, Unit, Parity (login) |
| Managed Dependencies | EPIC-04 | STORY-401 | TASK-401-1/2/3 | AC-401 | Smoke, Behavior parity |
| Build & Deployment Process | EPIC-04 | STORY-402 | TASK-402-1/2/3 | AC-402 | Smoke, Behavior parity |
| Environment Configuration | EPIC-04 | STORY-403 | TASK-403-1/2/3 | AC-403 | Smoke, Behavior parity |
| Legacy Baseline | EPIC-05 | STORY-501 | TASK-501-1/2 | AC-501 | Baseline capture (all dimensions) |
| Regression Coverage | EPIC-05 | STORY-502 | TASK-502-1/2 | AC-502 | Regression suite (dual-runnable) |
| Feature Parity Verification | EPIC-05 | STORY-503 | TASK-503-1/2 | AC-503 | Behavior/API/UI/Database parity |

## 2. Feature Traceability Detail

### 2.1 User Login
- **Epic → Story:** EPIC-01 (frontend) + EPIC-03 (auth) → STORY-101, enabled by STORY-301/302/303.
- **Tasks:** TASK-101-1/2/3 (UI), TASK-301-1/2/3 (auth service), TASK-303-1/2/3 (credential security).
- **Acceptance:** AC-101 (UI), AC-301 (auth), AC-303 (credentials).
- **Test Coverage:** frontend component tests, API/security tests, and legacy-vs-modern login parity.

### 2.2 View Products
- **Epic → Story:** EPIC-01 → STORY-102, served by EPIC-02 → STORY-201.
- **Tasks:** TASK-102-1/2/3 (UI), TASK-201-1/2/3 (retrieval service), TASK-205-* (data access).
- **Acceptance:** AC-102 (UI), AC-201 (service).
- **Test Coverage:** frontend rendering/safe-encoding, API contract tests, and list parity (empty/populated).

### 2.3 Add Product
- **Epic → Story:** EPIC-01 → STORY-103, served by EPIC-02 → STORY-202.
- **Tasks:** TASK-103-1/2/3 (UI), TASK-202-1/2/3 (create service), TASK-205-* (data access).
- **Acceptance:** AC-103 (UI), AC-202 (service).
- **Test Coverage:** validation unit tests, API create tests (incl. PRG/no-duplicate), and add parity.

### 2.4 Edit Product
- **Epic → Story:** EPIC-01 → STORY-104, served by EPIC-02 → STORY-203.
- **Tasks:** TASK-104-1/2/3 (UI), TASK-203-1/2/3 (update service), TASK-205-* (data access).
- **Acceptance:** AC-104 (UI), AC-203 (service).
- **Test Coverage:** identifier-validation unit tests, API update tests (valid/invalid/non-existent), and edit parity.

### 2.5 Delete Product
- **Epic → Story:** EPIC-01 → STORY-105, served by EPIC-02 → STORY-204.
- **Tasks:** TASK-105-1/2/3 (UI + confirmation), TASK-204-1/2/3 (delete service), TASK-205-* (data access).
- **Acceptance:** AC-105 (UI), AC-204 (service).
- **Test Coverage:** confirmation interaction tests, API delete tests, and delete parity.

### 2.6 Navigation & Shared UI
- **Epic → Story:** EPIC-01 → STORY-106.
- **Tasks:** TASK-106-1/2/3.
- **Acceptance:** AC-106.
- **Test Coverage:** navigation/journey tests and acceptance of preserved user journey.

### 2.7 Data Access (cross-cutting)
- **Epic → Story:** EPIC-02 → STORY-205 (foundational for STORY-201–204 and STORY-301).
- **Tasks:** TASK-205-1/2/3.
- **Acceptance:** AC-205.
- **Test Coverage:** unit tests (parameterized access), integration tests, and database-parity/integrity checks (schema unchanged).

### 2.8 Consistent Responses & Error Handling
- **Epic → Story:** EPIC-02 → STORY-206 (applies to STORY-201–204).
- **Tasks:** TASK-206-1/2/3.
- **Acceptance:** AC-206.
- **Test Coverage:** API response/error tests and outcome parity comparison.

### 2.9 Authentication & Access Control
- **Epic → Story:** EPIC-03 → STORY-301 (auth), STORY-302 (enforcement), STORY-303 (credentials).
- **Tasks:** TASK-301-*, TASK-302-*, TASK-303-*.
- **Acceptance:** AC-301, AC-302, AC-303.
- **Test Coverage:** security tests (auth-bypass, injection), API tests, and login parity.

### 2.10 Build Tooling, Deployment & Configuration
- **Epic → Story:** EPIC-04 → STORY-401 (dependencies), STORY-402 (build/deploy), STORY-403 (config).
- **Tasks:** TASK-401-*, TASK-402-*, TASK-403-*.
- **Acceptance:** AC-401, AC-402, AC-403.
- **Test Coverage:** smoke tests after deploy and behavior-parity checks post-setup.

### 2.11 Testing & Regression Assurance
- **Epic → Story:** EPIC-05 → STORY-501 (baseline), STORY-502 (regression), STORY-503 (parity).
- **Tasks:** TASK-501-*, TASK-502-*, TASK-503-*.
- **Acceptance:** AC-501, AC-502, AC-503.
- **Test Coverage:** baseline capture, dual-runnable regression suite, and full behavior/API/UI/database parity verification.

## 3. Cross-Cutting Dependency Trace

- **STORY-205 (Data Access)** underpins → STORY-201, 202, 203, 204, 301.
- **STORY-301 (Auth)** underpins → STORY-302, 303, and STORY-101 (login UI).
- **Backend services** underpin their UI screens: 201→102, 202→103, 203→104, 204→105.
- **STORY-206** standardizes → 201–204.
- **STORY-106** integrates → 101–105.
- **STORY-501 → 502 → 503** provide the assurance chain gating cutover.
- **EPIC-04 (401–403)** underpins build/run for all phases.

## 4. Coverage Completeness Check

- ✓ Every business feature maps to at least one Epic, Story, Task set, Acceptance Criteria, and Test Coverage entry.
- ✓ Every Story (STORY-101 … STORY-503) has a corresponding AC (AC-101 … AC-503).
- ✓ Every Story has Coding, Review, and Testing tasks (Stories 501–503 use Testing + Review appropriate to their type).
- ✓ Every Testing task compares legacy and modern outcomes (parity-gated).
- ✓ No feature is left without traceability from requirement through implementation to testing.
- ✓ Modernization scope preserved: existing MySQL schema and business functionality unchanged.
