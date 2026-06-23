import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const categoriesDir = path.join(__dirname, '../../public/data/categories');

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Helper for filenames
const categoryToFilename = {
  "Tự động hóa": "tu_dong_hoa.json",
  "Cơ điện tử": "co_dien_tu.json",
  "Khoa học máy tính": "khoa_hoc_may_tinh.json",
  "Vi xử lý": "vi_xu_ly.json",
  "Điện tử số": "dien_tu_so.json",
  "IoT": "iot.json",
  "Vô tuyến & Viễn thông": "vo_tuyen_vien_thong.json"
};

async function generateTerms(category, count = 50, excludeList = []) {
  const excludeInstruction = excludeList.length > 0 
    ? `\nĐẶC BIỆT LƯU Ý: KHÔNG ĐƯỢC TẠO LẠI các thuật ngữ sau (đã có trong hệ thống): ${excludeList.join(', ')}.` 
    : '';

  const prompt = `
Bạn là chuyên gia cấp cao về ${category}.
Hãy tạo ra danh sách ${count} thuật ngữ kỹ thuật phổ biến và chuyên sâu thuộc chuyên ngành "${category}". KHÔNG TRÙNG LẶP NHAU.${excludeInstruction}
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
  
  if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true });
  }

  // Đọc toàn bộ từ khóa hiện có trên TẤT CẢ các file JSON
  let globalExistingTermNames = new Set();
  const files = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(categoriesDir, file), 'utf8'));
      for (const item of data) {
        if (item.term) {
          globalExistingTermNames.add(item.term.toLowerCase().trim());
        }
      }
    } catch {}
  }

  console.log(`Đã load ${globalExistingTermNames.size} từ khóa hiện tại để làm bộ lọc chống trùng lặp.`);

  // Cấu hình danh mục cần sinh thêm
  const TARGET_CATEGORIES = ["Vô tuyến & Viễn thông"];
  const TERMS_PER_BATCH = 20; 
  const BATCHES_PER_CATEGORY = 5; // 100 từ mỗi danh mục

  for (const category of TARGET_CATEGORIES) {
      console.log(`\n>>> Bắt đầu xử lý danh mục: ${category}`);
      const filename = categoryToFilename[category];
      const filePath = path.join(categoriesDir, filename);

      let categoryTerms = [];
      if (fs.existsSync(filePath)) {
        try {
          categoryTerms = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch {}
      }

      for (let i = 0; i < BATCHES_PER_CATEGORY; i++) {
          console.log(`  -> Đang chạy Batch ${i + 1}/${BATCHES_PER_CATEGORY} cho "${category}"...`);
          // Array.from Set để truyền vào Prompt (tránh AI bị nhầm/nặng context quá có thể truyền tối đa 500 từ gần nhất nếu cần)
          // Để an toàn, chúng ta truyền một mảng các từ khóa
          const excludeList = Array.from(globalExistingTermNames);
          const newTerms = await generateTerms(category, TERMS_PER_BATCH, excludeList);
          
          let addedCount = 0;
          for (const term of newTerms) {
              const normalized = term.term.trim().toLowerCase();
              if (!globalExistingTermNames.has(normalized)) {
                  categoryTerms.push(term);
                  globalExistingTermNames.add(normalized);
                  addedCount++;
              }
          }
          console.log(`     + Đã thêm ${addedCount} thuật ngữ hợp lệ.`);
          
          // Ghi file liên tục
          fs.writeFileSync(filePath, JSON.stringify(categoryTerms, null, 2), 'utf8');
          
          if (i < BATCHES_PER_CATEGORY - 1 || category !== TARGET_CATEGORIES[TARGET_CATEGORIES.length - 1]) {
              console.log("  -> Tạm nghỉ 5 giây để tránh Rate Limit...");
              await delay(5000);
          }
      }
  }

  console.log(`\n🎉 Hoàn thành!`);
}

seed();
