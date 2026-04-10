/**
 * Cliente Supabase
 * Por enquanto não usado (localStorage)
 * Será ativado quando começar a integração com Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// ⚠️ Antes de usar, certifique-se de configurar .env:
// REACT_APP_SUPABASE_URL=https://your-project.supabase.co
// REACT_APP_SUPABASE_ANON_KEY=your-anon-key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Verificar se Supabase está configurado
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
