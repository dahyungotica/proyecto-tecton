import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://izdvwfufkpyvmwttvaep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6ZHZ3ZnVma3B5dm13dHR2YWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTM4NjMsImV4cCI6MjA4NDI2OTg2M30.DN8-NRvxuE_D5CFfX3PJqfGOYaF9eZfRmIRXRP6hV-s';

export const supabase = createClient(supabaseUrl, supabaseKey);