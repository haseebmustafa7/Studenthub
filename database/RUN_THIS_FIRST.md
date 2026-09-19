# 🚨 RUN THIS MIGRATION FIRST!

## Root Cause of "Failed to create profile" Error:

**The database still has the old schema that only allows roles: 'student' and 'admin'**

When you try to register a company with role='company', the database rejects it because of the CHECK constraint.

## Solution:

Run the upgrade migration to add 'company' support.

## Steps:

1. Open https://app.supabase.com
2. Go to your StudentHub project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy ENTIRE contents of `00_upgrade_for_companies.sql`
6. Paste into SQL Editor
7. Click **Run** (or Ctrl+Enter)
8. Wait for success message: "✅ DATABASE UPGRADED SUCCESSFULLY!"

## What This Does:

- ✅ Adds 'company' to role constraint
- ✅ Adds company_name, company_website, company_description to profiles
- ✅ Adds company_id, city, latitude, longitude to jobs
- ✅ Updates all RLS policies for company access
- ✅ Creates indexes for performance
- ✅ Makes database ready for companies

## After Running:

Company registration will work immediately!

## If You Already Ran `01_add_company_features.sql`:

That's fine! Run this one anyway - it's safe and will fill any gaps.
