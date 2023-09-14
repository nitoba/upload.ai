
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const credentials = {
    SUPABASE_URL: process.env.SUPABASE_URL as string,
    SUPABASE_KEY: process.env.SUPABASE_KEY as string
}

export const supabaseClient = createClient(
    credentials.SUPABASE_URL, 
    credentials.SUPABASE_KEY,
    { auth: { persistSession: false } } 
)