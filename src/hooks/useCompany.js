// src/hooks/useCompany.js
import { supabase } from '../supabaseClient';

export const updateCompany = async (newData) => {
  const { data, error } = await supabase
    .from('company')
    .update(newData)
    .eq('id', 1); // Asumiendo ID único para la empresa
  return { data, error };
};