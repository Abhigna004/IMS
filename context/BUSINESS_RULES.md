# Business Rules

## 1. Business Rules Overview

The business rules governing this system are minimal and are enforced implicitly through the procedural PHP code rather than through a formal rules layer or database constraints. They cover authentication, basic product CRUD, and simple input expectations. Most rules are advisory (client-side hints) and are not consistently enforced on the server, which is a key source of the system's current risks.

## 2. User Rules

- Only an authenticated user may reach the dashboard flow; the sole account is the seeded administrator (`admin@apple.com`).
- There is a single implicit role (administrator); no registration, roles, or permission levels exist.
- A login attempt is considered valid only when exactly one `user` row matches the submitted email and password ([login.php](../login.php)).

## 3. Validation Rules

- **Login form:** `email` field requires a valid email format and both fields are `required` (HTML5 only) in [index.html](../index.html).
- **Add product:** `quantity` uses `type="number"` with `min="1"` in [table.php](../table.php); `product_name` and `price` are free-text.
- **Edit load:** a product is loaded only when the `id` is numeric and greater than 0 ([edit.php](../edit.php)).
- Server-side validation is otherwise absent — price is never checked to be numeric/positive, and lengths/types are not verified beyond the database column limits.

## 4. Workflow Rules

- **Login → Dashboard:** successful authentication renders the dashboard inline; failure shows a "Login Failed" message ([login.php](../login.php)).
- **Add:** insert executes only when the `add` submit button is present, then the product list is redisplayed ([additem.php](../additem.php)).
- **Edit:** the form loads the product on GET and applies the change on POST (when `submit` is set), then redirects to the list ([edit.php](../edit.php)).
- **Delete:** removal executes whenever an `id` is supplied, then redirects to the list — with no confirmation step ([delete.php](../delete.php)).

## 5. Calculation Rules

- No business calculations are performed. Price and quantity are stored and displayed as entered; there is no total valuation, tax, discount, or aggregate stock computation.
- The dashboard row number is a display-only running counter, not the actual `product_id` ([table.php](../table.php)).

## 6. Approval Rules

- None. All create, update, and delete actions take effect immediately with no approval, review, or multi-step authorization workflow.

## 7. Security Rules

- Access should be limited to authenticated users — but this rule is **not enforced**: protected pages lack session/auth guards and are reachable by direct URL.
- Passwords are matched as plaintext (no hashing).
- No CSRF protection; state-changing delete/edit actions are reachable via `GET`.
- Database credentials are hardcoded (`root`, empty password).

## 8. Data Integrity Rules

- `product_id` and `user.id` are unique primary keys with auto-increment.
- `product_name`, `price`, and `quantity` are `NOT NULL`; `product_name` ≤ 30 chars, `password` ≤ 50 chars.
- No foreign keys, no unique constraint on `email`, and no referential integrity between tables.
- Input is inconsistently escaped (`mysqli_real_escape_string` in [additem.php](../additem.php)/[edit.php](../edit.php) but raw concatenation in [login.php](../login.php)/[delete.php](../delete.php)).

## 9. Exception Rules

- DB connection failures print an error message (`Failed to connect...`) but generally allow execution to continue rather than halting cleanly.
- Add-product outcome is surfaced via JS `alert` (`Successfully stored` / `Somthing wrong!!!`).
- A missing product on edit shows `No results!`; a successful delete echoes `sucess` (misspelled) before redirecting.
- There is no structured error handling, logging, or user-friendly failure page.

## 10. Compliance Rules

- No explicit compliance controls are implemented (no GDPR/PII handling, audit logging, password policy, or data-retention rules). Storing plaintext credentials is itself a compliance/security concern to be remediated.

## 11. Module-wise Business Rules

- **Authentication ([login.php](../login.php)):** exactly one matching row = success; no session established.
- **View ([table.php](../table.php)):** list all products unfiltered; display sequential counter instead of real ID.
- **Add ([additem.php](../additem.php)):** insert only on `add` submit; quantity ≥ 1 (client-side).
- **Edit ([edit.php](../edit.php)):** load only when `id` is numeric and > 0; update on `submit`; redirect after save.
- **Delete ([delete.php](../delete.php)):** delete on any supplied `id`; no confirmation; redirect after.

## 12. Rule Dependencies

- All feature rules depend on the authentication rule (in principle), but that dependency is broken because protected pages don't verify login.
- Add/Edit/Delete all depend on the dashboard ([table.php](../table.php)) as their redirect/redisplay target.
- Edit and Delete depend on a valid `product_id` existing in the `product` table.

## 13. Critical Rules

- **Authentication gate** (currently unenforced) — the single most important rule to restore.
- **One-row login match** — defines successful authentication.
- **Positive quantity / valid numeric price** — core inventory correctness (currently only partially enforced).
- **Valid, existing `id` for edit/delete** — prevents acting on invalid records.

## 14. Modernization Considerations

- Move all rule enforcement to the **server/API layer** (React frontend + PHP REST API): authenticate every protected endpoint, validate types/ranges server-side, and return structured JSON errors instead of `alert`/echo.
- Enforce the authentication rule with sessions/tokens and route guards so no endpoint is reachable unauthenticated.
- Add server-side validation for price (numeric, ≥ 0) and quantity (integer, ≥ 1), and require confirmation for delete via a proper `DELETE` request.
- Introduce data-integrity rules (hashed passwords, unique `email`) without changing the core schema.

## 15. AI Notes

- **Do not trust client-side rules:** re-implement every validation (email format, quantity ≥ 1, numeric price, `id` > 0) on the server.
- **Restore the auth invariant:** treat "user must be authenticated" as a hard precondition on all product endpoints.
- **Preserve existing behavior semantics** (one-row login = success, immediate CRUD) while fixing enforcement gaps and typos (`sucess`, `Somthing wrong!!!`).
- **Keep rules schema-compatible:** enforce integrity in code/API against the existing `product` and `user` tables; only widen `password` and add a unique `email` index as agreed.
- **Replace ad-hoc feedback** (`alert`, echoed strings) with consistent HTTP status codes and JSON messages.