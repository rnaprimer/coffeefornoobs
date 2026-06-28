import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixProfiles() {
  const { data: users, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error("Error fetching users:", authError);
    return;
  }

  console.log(`Found ${users.users.length} users.`);

  for (const user of users.users) {
    const { error: insertError } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      role: 'admin'
    });
    
    if (insertError) {
      console.error(`Error inserting profile for ${user.email}:`, insertError);
    } else {
      console.log(`Successfully created/updated admin profile for ${user.email}`);
    }
  }
}

fixProfiles();
