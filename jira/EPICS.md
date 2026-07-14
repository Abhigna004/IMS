# Epics

Modernization Epics for the Inventory Management System. Each Epic is a high-level business objective aligned with the modernization strategy defined in [modernization-config.md](../modernization-config.md): a React frontend communicating through a REST API backend over the **existing, unchanged** MySQL database, with all existing business functionality preserved. Each Epic represents a large body of work intended to be broken down into multiple Stories later.

---

## EPIC-01

**Epic ID:** EPIC-01

**Epic Name:** Frontend Modernization (React)

**Objective:** Replace the legacy server-rendered user interface with a modern React frontend while preserving all existing user workflows.

**Description:** The current presentation layer is tightly coupled to server-side code, limiting reusability and maintainability. This Epic re-establishes the user experience as a modern, component-based React application that consumes the backend REST APIs, keeping the way users interact with the system unchanged.

**Scope (high level):**
- Deliver the existing user-facing screens and workflows through a React frontend.
- Preserve current navigation and user experience.
- Improve reusability, consistency, and separation of concerns in the UI.
- No UI redesign beyond the React implementation and no new functional features.

**Modernization Goal:** Move from server-rendered pages to a maintainable, modern React frontend that renders data provided by REST APIs.

**Priority:** High

**Dependencies:** EPIC-02 (Backend REST API Modernization), EPIC-03 (Authentication Modernization)

---

## EPIC-02

**Epic ID:** EPIC-02

**Epic Name:** Backend REST API Modernization

**Objective:** Convert the existing server-side business functionality into a REST API backend consumed by the React frontend, preserving all existing business logic and behavior.

**Description:** Today business logic, presentation, and data access are interleaved in page-based procedural code with inconsistent, duplicated database access. This Epic re-establishes the backend as a clean, layered REST API that exposes the existing functionality as services, with a single consistent and secure data-access approach over the existing MySQL database. Standardizing data access is included here as part of building a robust API backend, with no schema, table, or data changes.

**Scope (high level):**
- Expose existing product and login functionality through REST APIs.
- Reuse existing business rules and keep functional behavior unchanged.
- Consolidate and standardize database access behind the API layer.
- Keep the existing MySQL database unchanged — no schema, table, or data changes.

**Modernization Goal:** Replace page-based procedural logic with a clean, layered REST API backend that serves the React frontend over the existing database.

**Priority:** High

**Dependencies:** None

---

## EPIC-03

**Epic ID:** EPIC-03

**Epic Name:** Authentication Modernization (API-Based)

**Objective:** Modernize the login capability into an API-based authentication flow that properly enforces access control, while preserving the existing authentication behavior.

**Description:** The legacy login does not establish a proper authenticated session, allowing protected areas to be reached without signing in. Because the target architecture uses a React frontend and REST APIs, authentication must be delivered as an API-based flow. This Epic re-establishes secure, enforced authentication that reuses the existing credential model and login workflow.

**Scope (high level):**
- Provide API-based authentication for the React frontend.
- Enforce authenticated access across all protected functionality.
- Reuse the existing authentication behavior and single-admin model.
- Preserve the existing login workflow.

**Modernization Goal:** Replace the legacy session-less login with proper API-based authentication and enforced access control.

**Priority:** High

**Dependencies:** EPIC-02 (Backend REST API Modernization)

---

## EPIC-04

**Epic ID:** EPIC-04

**Epic Name:** Build Tooling & Deployment Modernization

**Objective:** Introduce modern dependency management and a repeatable build and deployment process to support the modernized frontend and backend.

**Description:** The legacy project lacks dependency management, a build process, and a repeatable deployment approach. This Epic establishes managed dependencies and a repeatable build/deploy workflow for both the React frontend and the REST API backend, improving maintainability and scalability without altering functionality.

**Scope (high level):**
- Introduce dependency management for the frontend and backend.
- Establish a repeatable build and deployment process.
- Externalize environment configuration out of source code.
- No changes to functional behavior.

**Modernization Goal:** Replace manual, tool-less setup with managed dependencies and a repeatable build and deployment workflow.

**Priority:** Medium

**Dependencies:** EPIC-01 (Frontend Modernization), EPIC-02 (Backend REST API Modernization)

---

## EPIC-05

**Epic ID:** EPIC-05

**Epic Name:** Testing & Regression Assurance

**Objective:** Ensure the modernized application preserves existing functionality by validating it against the same regression coverage as the legacy system.

**Description:** The legacy system has no automated tests or documented behavioral baseline. Per the success criteria in [modernization-config.md](../modernization-config.md), the legacy and modernized applications must pass the same regression tests. This Epic establishes a behavioral baseline and regression coverage to guarantee unchanged functional behavior across the migration.

**Scope (high level):**
- Capture a behavioral baseline of the existing functionality.
- Establish regression coverage across all existing features.
- Verify feature parity between the legacy and modernized applications.
- Enable repeatable, ongoing test execution.

**Modernization Goal:** Guarantee that modernized functionality matches the legacy system through repeatable regression assurance.

**Priority:** Medium

**Dependencies:** EPIC-01 (Frontend Modernization), EPIC-02 (Backend REST API Modernization), EPIC-03 (Authentication Modernization)
