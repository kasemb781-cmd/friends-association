
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cqoeejakrgjxstwxohqd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxb2VlamFrcmdqeHN0d3hvaHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDYyNTUsImV4cCI6MjA4NTE4MjI1NX0.bkNvsIOGdykBTb3IWLq4X1YD8u4c-hXl5q45fRNmE-U';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
