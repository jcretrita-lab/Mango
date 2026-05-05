# Local PostgreSQL + pgAdmin Guide for Diwa HRIS

This guide shows how to create your own local PostgreSQL database with `pgAdmin` and connect it to this project.

Use this when you want your own local copy of the Diwa HRIS Phase 1 database for development, seeding, and testing.

## What you are setting up

For this project, the flow is:

1. PostgreSQL stores the data
2. pgAdmin helps you create and inspect the database
3. the backend connects through Prisma
4. the frontend talks only to the backend

The frontend does **not** connect directly to pgAdmin or PostgreSQL.

## Project defaults

Recommended local values for this repo:

- database name: `diwa_hris`
- host: `localhost`
- port: `5432`
- schema: `public`

You can use the default `postgres` user if you want, but a dedicated local dev user is cleaner.

## Before you start

You need:

- PostgreSQL installed on Windows
- pgAdmin installed
- Bun installed
- this repo available locally

Project paths used below:

- backend env file: [backend/.env](</C:/Users/joshu/Documents/Diwa HRIS/backend/.env>)
- Prisma schema: [backend/prisma/schema.prisma](</C:/Users/joshu/Documents/Diwa HRIS/backend/prisma/schema.prisma>)
- seed script: [backend/prisma/seed.ts](</C:/Users/joshu/Documents/Diwa HRIS/backend/prisma/seed.ts>)
- dummy data: [backend/prisma/dummy-data.ts](</C:/Users/joshu/Documents/Diwa HRIS/backend/prisma/dummy-data.ts>)

## 1. Open pgAdmin and connect to your local server

1. Open `pgAdmin 4`.
2. If this is your first time, set your pgAdmin master password.
3. In the left sidebar, look for `Servers`.
4. If your local PostgreSQL server is already there, expand it.
5. If not, right-click `Servers` and choose `Register` -> `Server...`

Use these values:

- `General` tab
  - Name: `Local PostgreSQL`
- `Connection` tab
  - Host name/address: `localhost`
  - Port: `5432`
  - Maintenance database: `postgres`
  - Username: your PostgreSQL username, usually `postgres`
  - Password: your PostgreSQL password

Click `Save`.

## 2. Create a dedicated local user in pgAdmin

This step is optional, but recommended.

If you want a dedicated local user for this project:

1. Expand your local server.
2. Expand `Login/Group Roles`.
3. Right-click `Login/Group Roles` -> `Create` -> `Login/Group Role...`

Use something like:

- Name: `diwa_hris_dev`
- Password: choose your own password

Under `Privileges`, turn on:

- `Can login?` = `Yes`

You do **not** need to make this user a superuser for normal project use.

Click `Save`.

## 3. Create the Diwa HRIS database

1. Expand your local server.
2. Right-click `Databases` -> `Create` -> `Database...`

Use:

- Database: `diwa_hris`
- Owner: `postgres` or `diwa_hris_dev`

Click `Save`.

If you created `diwa_hris_dev`, set the owner to that user if possible.

## 4. Grant access if needed

If the database owner is not the same user you want to use in the app, give that user access.

In pgAdmin:

1. Click the `diwa_hris` database.
2. Open `Tools` -> `Query Tool`.
3. Run a grant statement like this:

```sql
GRANT ALL PRIVILEGES ON DATABASE diwa_hris TO diwa_hris_dev;
```

If you created the database with `diwa_hris_dev` as owner, you usually do not need this.

## 5. Update the backend connection string

Open [backend/.env](</C:/Users/joshu/Documents/Diwa HRIS/backend/.env>).

Set `DATABASE_URL` to your local database.

Example using `postgres`:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/diwa_hris?schema=public"
```

Example using a dedicated user:

```env
PORT=3000
DATABASE_URL="postgresql://diwa_hris_dev:your_password@localhost:5432/diwa_hris?schema=public"
```

Important:

- replace `your_password`
- keep `diwa_hris`
- keep `?schema=public`

## 6. Generate Prisma client

From the project backend folder:

```bash
cd backend
bun install
bun run prisma:generate
```

What this does:

- installs backend dependencies
- generates the Prisma client from [backend/prisma/schema.prisma](</C:/Users/joshu/Documents/Diwa HRIS/backend/prisma/schema.prisma>)

## 7. Push the schema into PostgreSQL

Run:

```bash
cd backend
bun run prisma:push
```

What this does:

- creates the tables in your local `diwa_hris` database
- updates them to match the Prisma schema

After this step, pgAdmin should show the tables under:

`Databases -> diwa_hris -> Schemas -> public -> Tables`

## 8. Seed the project data

Run:

```bash
cd backend
bun run db:seed
```

What this does:

- clears the existing rows in seed order
- inserts the shared Phase 1 enterprise dummy data
- loads employees, org units, salary grades, pay templates, approvals, RBAC, and related records

Seed source files:

- [backend/prisma/dummy-data.ts](</C:/Users/joshu/Documents/Diwa HRIS/backend/prisma/dummy-data.ts>)
- [backend/prisma/phase1-demo-accounts.ts](</C:/Users/joshu/Documents/Diwa HRIS/backend/prisma/phase1-demo-accounts.ts>)

## 9. Start the backend

Run:

```bash
cd backend
bun run start:dev
```

Useful URLs:

- API base: [http://localhost:3000/api](http://localhost:3000/api)
- Swagger: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health)

## 10. Start the frontend

In a second terminal:

```bash
cd frontend
bun install
bun run dev
```

The frontend is configured to send `/api` calls to the backend on port `3000`.

## 11. Login with the seeded Phase 1 accounts

After seeding, these demo accounts are available:

- `Superadmin`
  - email: `platform.admin@diwalearning.seed`
  - password: `DiwaPhase1!`
- `Approver`
  - email: `antonio.roxas@diwalearning.local`
  - password: `DiwaPhase1!`
- `Employee`
  - email: `lance.robredo@diwalearning.local`
  - password: `DiwaPhase1!`

These are defined from:

- [backend/prisma/phase1-demo-accounts.ts](</C:/Users/joshu/Documents/Diwa HRIS/backend/prisma/phase1-demo-accounts.ts>)

## 12. Quick verification in pgAdmin

If you want to confirm the seed loaded correctly:

1. In pgAdmin, select the `diwa_hris` database.
2. Open `Tools` -> `Query Tool`.
3. Run these checks.

### Check users

```sql
SELECT id, email, display_name, status
FROM "User"
ORDER BY id;
```

### Check roles

```sql
SELECT id, code, name
FROM "Role"
ORDER BY id;
```

### Check employees

```sql
SELECT id, employee_number, display_name, role_title, status
FROM "Employee"
ORDER BY id
LIMIT 20;
```

### Check org units

```sql
SELECT id, code, name, is_active
FROM "OrgUnit"
ORDER BY id
LIMIT 20;
```

### Check salary grades

```sql
SELECT id, code, name, status
FROM "SalaryGrade"
ORDER BY id;
```

## 13. How to reset your local database later

If schema or seed data changes:

```bash
cd backend
bun run prisma:generate
bun run prisma:push
bun run db:seed
```

That is the normal refresh cycle for this project.

## 14. Common problems

### PostgreSQL is not running

Symptoms:

- Prisma cannot connect
- `prisma:push` fails immediately

Fix:

1. open Windows `Services`
2. find your PostgreSQL service
3. start it

### Wrong username or password

Symptoms:

- authentication failed
- cannot connect in pgAdmin or Prisma

Fix:

- verify the same credentials work in pgAdmin
- then copy them into [backend/.env](</C:/Users/joshu/Documents/Diwa HRIS/backend/.env>)

### Wrong port

Symptoms:

- localhost connection fails

Fix:

- check the port in pgAdmin server connection settings
- use that same port in `DATABASE_URL`

### Database does not exist

Symptoms:

- Prisma says the target database was not found

Fix:

- create `diwa_hris` first in pgAdmin

### Tables are missing after connect

Symptoms:

- database exists but no app tables appear

Fix:

Run:

```bash
cd backend
bun run prisma:push
```

### No dummy data

Symptoms:

- tables exist but pages stay empty

Fix:

Run:

```bash
cd backend
bun run db:seed
```

## 15. Recommended setup for your machine

For this project, the clean local setup is:

- PostgreSQL server on your machine
- one local database named `diwa_hris`
- one optional local login role named `diwa_hris_dev`
- backend connected through `DATABASE_URL`
- pgAdmin used to inspect data, run queries, and check tables

That gives you a local environment that matches how this HRIS is meant to run.
