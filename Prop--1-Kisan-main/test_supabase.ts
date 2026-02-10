
import { createClient } from '@supabase/supabase-js'

const url = "https://ykvatttsnpjrwqfhhysu.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdmF0dHRzbnBqcndxZmhoeXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTk5NjQsImV4cCI6MjA4NjA3NTk2NH0.5Njnh8NBEcPDddHjwv3CoUpCcAHu-ALNUQHQVdAdq-Y"

const supabase = createClient(url, key)

async function test() {
  console.log("Testing connection...")
  const { data, error } = await supabase.from('listings').select('*').limit(1)
  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Success! Data:", data)
  }
}

test()
