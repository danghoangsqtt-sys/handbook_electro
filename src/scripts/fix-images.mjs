import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  console.log("Fetching components...");
  const { data, error } = await supabase.from('components').select('id, image_url');
  
  if (error) {
    console.error("Error fetching:", error);
    return;
  }

  for (const comp of data) {
    if (comp.image_url && comp.image_url.includes('via.placeholder.com')) {
      const newUrl = comp.image_url.replace('via.placeholder.com', 'placehold.co');
      console.log(`Updating ${comp.id} to ${newUrl}`);
      const { error: updateError } = await supabase.from('components').update({ image_url: newUrl }).eq('id', comp.id);
      if (updateError) {
        console.error(`Failed to update ${comp.id}:`, updateError);
      }
    }
  }
  console.log("Done.");
}

fix();
