import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qvqfzujvcnmquohieevl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_k6-4t7JwPfhKmkX8yym6fw_3GqY-GAB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);