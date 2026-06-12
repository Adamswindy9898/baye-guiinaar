import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://wpluusbwvtnybkpjfykb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHV1c2J3dnRueWJrcGpmeWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODUxMzUsImV4cCI6MjA5Njc2MTEzNX0.QlFtiZvzRAMuvz96biXWHmcU9iKBprFCjBtMoPyAr84'
);
