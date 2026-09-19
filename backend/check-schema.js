// Check what tables exist in the database
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function checkSchema() {
  console.log('🔍 Checking database schema...\n')
  
  // Try to list tables using information_schema
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
  
  if (error) {
    console.log('Cannot query information_schema, trying direct table access...\n')
    
    // Try common table names
    const tablesToCheck = [
      'careers',
      'counselors',
      'career_assessments',
      'career_matches',
      'profiles',
      'jobs'
    ]
    
    for (const table of tablesToCheck) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true })
        
        if (tableError) {
          console.log(`❌ ${table}: ${tableError.message}`)
        } else {
          console.log(`✅ ${table}: EXISTS`)
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`)
      }
    }
  } else {
    console.log('Tables in database:')
    data.forEach(row => console.log(`  - ${row.table_name}`))
  }
}

checkSchema()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err.message)
    process.exit(1)
  })
