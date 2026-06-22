import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);



const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function generateTerms(category, count = 50) {
  const prompt = `
Bạn là chuyên gia cấp cao về ${category}.
Hãy tạo ra danh sách ${count} thuật ngữ kỹ thuật phổ biến và chuyên sâu thuộc chuyên ngành "${category}". KHÔNG TRÙNG LẶP NHAU.
Định dạng trả về phải là một Array JSON hợp lệ, với mỗi object chứa các key sau:
- "id": Một chuỗi ngẫu nhiên độc nhất (vd: uuid).
- "term": Tên thuật ngữ (ví dụ: "PLC", "I2C", "Anten Yagi") hoặc từ viết tắt.
- "fullName": Tên đầy đủ bằng tiếng Anh hoặc tiếng Việt (nếu có), nếu không có hãy để chuỗi rỗng.
- "category": Phân loại, LUÔN LÀ: "${category}".
- "definition": Giải nghĩa ngắn gọn, dễ hiểu và chuẩn xác chuyên môn.
- "applications": Mảng gồm 2-3 chuỗi mô tả các ứng dụng thực tế trong công nghiệp/đời sống.
- "youtubeUrl": Một URL video Youtube hướng dẫn (giả lập hoặc có thật, ví dụ "https://www.youtube.com/watch?v=...").
Trả về DUY NHẤT một mảng JSON (không bọc trong markdown code block, KHÔNG có bất kỳ text nào khác ngoài JSON array).
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Xử lý json an toàn
    const startIdx = text.indexOf('[');
    const endIdx = text.lastIndexOf(']') + 1;
    if(startIdx !== -1 && endIdx !== -1) {
        text = text.substring(startIdx, endIdx);
    }

    const terms = JSON.parse(text);
    return terms;
  } catch (e) {
    console.error(`Error seeding terms for ${category}:`, e);
    return [];
  }
}

async function seed() {
  console.log("Đang cấu hình tiến trình Batch Processing sinh dữ liệu...");
  const outputPath = path.join(__dirname, '../../public/data/categories/generated_terms.json');
  
  let existingTerms = [];
  if (fs.existsSync(outputPath)) {
    const fileData = fs.readFileSync(outputPath, 'utf8');
    try {
      existingTerms = JSON.parse(fileData);
    } catch {}
  }

  // Set để lọc trùng id hoặc term
  const existingTermNames = new Set(existingTerms.map(t => t.term.toLowerCase()));

  const TARGET_CATEGORIES = ["Vi xử lý", "IoT", "Vô tuyến & Viễn thông"];
  const TERMS_PER_BATCH = 20; // 20 terms / request for stability
  const BATCHES_PER_CATEGORY = 2; // Thử nghiệm 2 lô (40 từ/mục), để 25 lô nếu muốn 500 từ/mục

  for (const category of TARGET_CATEGORIES) {
      console.log(`\n>>> Bắt đầu xử lý danh mục: ${category}`);
      for (let i = 0; i < BATCHES_PER_CATEGORY; i++) {
          console.log(`  -> Đang chạy Batch ${i + 1}/${BATCHES_PER_CATEGORY} cho "${category}"...`);
          const newTerms = await generateTerms(category, TERMS_PER_BATCH);
          
          let addedCount = 0;
          for (const term of newTerms) {
              if (!existingTermNames.has(term.term.toLowerCase())) {
                  existingTerms.push(term);
                  existingTermNames.add(term.term.toLowerCase());
                  addedCount++;
              }
          }
          console.log(`     + Đã thêm ${addedCount} thuật ngữ hợp lệ.`);
          
          // Ghi file liên tục để tránh mất data nếu script bị dừng
          fs.writeFileSync(outputPath, JSON.stringify(existingTerms, null, 2), 'utf8');
          
          if (i < BATCHES_PER_CATEGORY - 1 || category !== TARGET_CATEGORIES[TARGET_CATEGORIES.length - 1]) {
              console.log("  -> Tạm nghỉ 5 giây để tránh Rate Limit...");
              await delay(5000);
          }
      }
  }

  console.log(`\n🎉 Hoàn thành! Tổng dữ liệu hiện có: ${existingTerms.length} thuật ngữ. Được lưu tại: ${outputPath}`);
}

seed();
