# User Management API

## Endpoints

- `GET /` — Health check
- `GET /users` — Get all users
- `GET /user/:id` — Get specific user by ID
- `POST /users` — Create user `{ name, email, password }`
- `PUT /user/:id` — Update user `{ name, email }`
- `DELETE /user/:id` — Delete user
- `GET /search?name=<name>` — Search users by name
- `POST /login` — Login `{ email, password }`

## Usage

1. `npm install`
2. `npm start`
3. API at http://localhost:3000

## Example user logins (see db.js for passwords!)
- john@example.com / password123
- jane@example.com / secret456
- bob@example.com / qwerty789
