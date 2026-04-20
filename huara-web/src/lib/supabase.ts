import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cnuvfblsilouuahitpij.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_NO3srLICVoXJjzk3kKJFQA_h5YSA8ii';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
