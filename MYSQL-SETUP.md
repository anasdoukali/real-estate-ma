# Hostinger MySQL setup

The application now uses MySQL via mysql2 and Drizzle. PostgreSQL credentials no longer work with this version. No existing database has been modified or copied by this code change.

## 1. Configure the Node.js application

Set these variables in the Hostinger application's environment settings:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u373105865_Admin
DB_USER=u373105865_Loukavendy
DB_PASSWORD=REPLACE_WITH_YOUR_REAL_PASSWORD
DB_SSL=false
```

Hostinger documents `localhost` as the usual host for an application running there. Use the database host specified for your application if it differs. On your Mac, `localhost` means your Mac, not Hostinger; local development against Hostinger requires its remote MySQL hostname and an allowed client IP.

Keep the real password in hosting settings or the ignored `.env.local`, never in Git. Separate `DB_*` variables take precedence over `DATABASE_URL`. Alternatively, omit `DB_HOST` and set a `mysql://` connection URL with percent-encoded credentials. Set `DB_SSL=true` when the database endpoint supports/requires certificate-verified TLS.

Keep `ADMIN_JWT_SECRET` configured with a private random value. Image uploads still use the existing `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; switching the database does not move image storage.

## 2. Import the schema into an empty database

In phpMyAdmin, select `u373105865_Admin`, choose **Import**, and upload:

`src/db/migrations/mysql/0000_initial_mysql.sql`

This creates 13 tables, with UTF-8 support for French and Arabic text. It contains no credentials, sample listings or destructive DROP/DELETE statements. Import it once into an empty database. If tables already exist, export a backup and compare their schema before importing; do not overwrite existing data.

The SQL files directly in `src/db/migrations/` are historical PostgreSQL migrations. Do not import those into MySQL. New schema generation uses the separate `mysql/` directory.

Existing PostgreSQL listings, accounts and other records are not automatically transferred. A data migration must preserve IDs and password hashes. Do not run `src/db/seed.ts` on a production database: it deletes existing content and inserts demo content.

## 3. Verify and start

Run `npm install`, `npm run db:check`, then `npm run build` and restart the Next.js application with `npm start` (or the Hostinger restart control). The database check only reads connection/table metadata; it does not insert records.

After connection succeeds, verify admin login, property creation/editing, contact submissions, newsletter re-subscription and neighborhood profiles on the connected application. The existing first-login flow creates the initial administrator when `admin_users` is empty, so initialize that account before opening the site publicly.

Reference: https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/
