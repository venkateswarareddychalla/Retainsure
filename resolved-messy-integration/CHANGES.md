# CHANGES.md

## Major Issues Identified

- SQL Injection: Fixed via parameterized queries.
- Plaintext passwords: Now hashed with bcrypt.
- Email uniqueness: Enforced at DB level and handled error.
- Input validation: Check required fields in every endpoint.
- Insecure/unclear error handling: Proper HTTP codes/messages.
- Password leakage: Passwords never returned in responses.
- Mixed response formats: Now always returns JSON.

## What was changed

- Modularized code: routes/controllers/middleware/utils structure.
- All queries parameterized, all input validated.
- Error and not found responses handled cleanly.
- Added JWT support in login for best practice (can extend for auth later).

## Justification

- Follows current secure JS and REST conventions.
- Easy for someone new to jump in and extend.
- JWT implemented for extensibility, even if not enforced yet.
- Included seed users for easy testing.

## AI Usage

- ChatGPT was used for code suggestions and structure review, code manually edited and verified for security and project fit.

## With more time

- Would add input validation library (like joi).
- Add automated and integration testing with jest/supertest.
- Add e2e authentication middleware for protected endpoints.
