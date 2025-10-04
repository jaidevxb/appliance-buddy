import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qsnmybgvrwokifqndhga.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbm15Ymd2cndva2lmcW5kaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxNzMsImV4cCI6MjA3MjgxMDE3M30.mcLOZmFtAmxxWbZlta-YfC7JyrEIx03qxTlWEfSHVxM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)