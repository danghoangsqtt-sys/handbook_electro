import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key to bypass RLS if anon key fails
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Thiếu biến môi trường NEXT_PUBLIC_SUPABASE_URL hoặc Key.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Bắt đầu nạp dữ liệu thuật ngữ...");
  
  let allTerms = [];
  const categoriesDir = path.resolve(__dirname, '../../public/data/categories');
  
  if (fs.existsSync(categoriesDir)) {
      const files = fs.readdirSync(categoriesDir);
      for (const file of files) {
          if (file.endsWith('.json')) {
              const data = fs.readFileSync(path.join(categoriesDir, file), 'utf8');
              try {
                  allTerms = allTerms.concat(JSON.parse(data));
                  console.log(`Đã đọc tệp: ${file}`);
              } catch (e) {
                  console.error('Error parsing JSON:', file, e);
              }
          }
      }
  } else {
      console.error('Thư mục không tồn tại:', categoriesDir);
      process.exit(1);
  }

  if (allTerms.length === 0) {
      console.log('Không tìm thấy dữ liệu JSON cục bộ.');
      process.exit(0);
  }

  // Map data to match Supabase schema (PostgreSQL lowercases all unquoted column names)
  const payload = allTerms.map(term => ({
      term: term.term || '',
      fullname: term.fullName || '',       // PostgreSQL stores as lowercase
      category: term.category || 'Khác',
      definition: term.definition || '',
      applications: term.applications || [],
      tags: [],
      youtubeurl: term.youtubeUrl || '',   // PostgreSQL stores as lowercase
      icon: term.icon || '',
      is_active: true
  }));

  const { data, error } = await supabase.from('terms').insert(payload).select();

  if (error) {
      console.error("Lỗi khi nạp dữ liệu:", error);
  } else {
      console.log(`Đã nạp thành công ${data.length} thuật ngữ!`);
  }
}

seed();
