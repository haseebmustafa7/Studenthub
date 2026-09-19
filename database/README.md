# Database Migrations and Seed Data

This directory contains SQL migration files and seed data for the StudentHub application.

## Files

1. **01_add_company_features.sql** - Adds company functionality to the database
2. **02_seed_demo_jobs.sql** - Seeds 10 demo jobs with realistic Pakistani companies

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Open your Supabase project dashboard: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query
4. Copy the contents of `01_add_company_features.sql`
5. Paste into the SQL editor
6. Click **Run** to execute
7. Repeat steps 3-6 for `02_seed_demo_jobs.sql`

### Option 2: Supabase CLI

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Run migrations
supabase db push

# Or run individual files
supabase db execute --file database/01_add_company_features.sql
supabase db execute --file database/02_seed_demo_jobs.sql
```

## What the Migrations Do

### 01_add_company_features.sql

This migration adds company functionality without breaking existing data:

- **Profiles Table Updates:**
  - Adds `company_name`, `company_website`, `company_description` columns
  - Adds `company_logo_url`, `industry` columns
  - Adds `city`, `country` columns for location
  - Updates role constraint to include 'company'

- **Jobs Table Updates:**
  - Adds `city`, `country` for job location
  - Adds `latitude`, `longitude` for map display
  - Adds `skills` (comma-separated text)
  - Adds `status` column (active, pending, rejected, paused)
  - Adds `approved_at`, `approved_by` for admin approval workflow
  - Adds `company_id` foreign key to link jobs to companies

- **RLS Policies:**
  - Companies can insert, update, and delete their own jobs
  - Companies can view all their jobs including pending ones
  - Students see only active approved jobs
  - Admins can manage all jobs

- **Performance:**
  - Creates indexes on city, status, company_id, and location
  - Creates a view for public jobs

### 02_seed_demo_jobs.sql

Seeds the database with 10 realistic demo jobs:

**Companies included:**
- Systems Limited (Lahore)
- NetSol Technologies (Lahore)
- i2c Inc. (Islamabad)
- LMKR (Islamabad)
- TPS Worldwide (Karachi)
- Inbox Business Technologies (Rawalpindi)
- Devsinc (Remote)
- TkXel (Remote)

**Job types:**
- Internships: 3
- Full-time: 5
- Part-time: 2

**Categories:**
- Software Engineering
- Web Development
- AI/ML
- Data Science
- UI/UX
- Marketing
- QA

**Work modes:**
- Remote: 3
- Hybrid: 2
- On-site: 5

**Features:**
- All jobs have realistic coordinates for map display
- Salary ranges in Pakistani Rupees (PKR)
- Detailed descriptions, requirements, and benefits
- Application deadlines
- Company contact emails

## Troubleshooting

### Error: "relation already exists"

This is safe to ignore. The migration uses `IF NOT EXISTS` to prevent errors if columns already exist.

### Error: "permission denied"

Make sure you're using the correct Supabase credentials with sufficient permissions.

### Jobs not appearing

1. Check that `is_active = true` in the jobs
2. Check that `status = 'active'` 
3. Verify RLS policies are set correctly
4. Check the frontend is filtering correctly

## Resetting the Database

If you need to start fresh:

```sql
-- WARNING: This will delete all data
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Then re-run the base schema from SETUP_INSTRUCTIONS.md
-- Then run these migrations
```

## Notes

- The migrations are designed to be **safe** and **idempotent** (can be run multiple times)
- They use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` to prevent conflicts
- Existing data is preserved
- The seed jobs use `ON CONFLICT DO NOTHING` to prevent duplicates
