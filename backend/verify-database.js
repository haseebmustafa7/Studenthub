// Quick script to verify if database tables exist
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function verifyTables() {
  console.log('🔍 Checking database tables...\n')
  
  const tables = [
    'careers',
    'counselors',
    'career_assessments',
    'career_matches',
    'skill_analyses',
    'learning_roadmaps',
    'counseling_sessions'
  ]
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ Table '${table}': NOT FOUND`)
      } else {
        console.log(`✅ Table '${table}': EXISTS`)
      }
    } catch (err) {
      console.log(`❌ Table '${table}': ERROR - ${err.message}`)
    }
  }
  
  // Check data counts
  console.log('\n📊 Data counts:')
  
  try {
    const { count: careerCount } = await supabase
      .from('careers')
      .select('*', { count: 'exact', head: true })
    console.log(`   Careers: ${careerCount || 0}`)
  } catch (err) {
    console.log(`   Careers: N/A`)
  }
  
  try {
    const { count: counselorCount } = await supabase
      .from('counselors')
      .select('*', { count: 'exact', head: true })
    console.log(`   Counselors: ${counselorCount || 0}`)
  } catch (err) {
    console.log(`   Counselors: N/A`)
  }
}

verifyTables()
  .then(() => {
    console.log('\n✅ Verification complete')
    process.exit(0)
  })
  .catch(err => {
    console.error('\n❌ Error:', err.message)
    process.exit(1)
  })
