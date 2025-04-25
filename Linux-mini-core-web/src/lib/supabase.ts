import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithEmail(username: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${username}@minicore.web`, // Internal email format
    password,
  });
  
  return { data, error };
}

export async function signUpWithEmail(username: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: `${username}@minicore.web`, // Internal email format
    password,
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  return { data, error };
}

export async function isAdmin(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();
    
  return data?.is_admin || false;
}

export async function saveFileSystem(userId: string, fileSystemData: string) {
  const { error } = await supabase
    .from('file_systems')
    .upsert({ user_id: userId, data: fileSystemData, updated_at: new Date().toISOString() });
  
  return { error };
}

export async function loadFileSystem(userId: string) {
  const { data, error } = await supabase
    .from('file_systems')
    .select('data')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
}