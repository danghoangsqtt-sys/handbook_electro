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

const CATEGORIES = ["Tự động hóa", "Cơ điện tử", "Khoa học máy tính", "Vi xử lý", "Điện tử số", "IoT"];

async function generateTerms(count = 5) {
  const prompt = `
Bạn là chuyên gia về Cơ điện tử, Khoa học máy tính và Tự động hóa.
Hãy tạo ra danh sách ${count} thuật ngữ kỹ thuật phổ biến.
Định dạng trả về phải là một Array JSON hợp lệ, với mỗi object chứa các key sau:
- "id": Một chuỗi ngẫu nhiên độc nhất (vd: uuid).
- "term": Tên thuật ngữ (ví dụ: "PLC", "I2C") hoặc từ viết tắt.
- "fullName": Tên đầy đủ (nếu có, ví dụ: "Programmable Logic Controller"), nếu không có hãy để chuỗi rỗng.
- "category": Phân loại, chỉ chọn 1 trong các mục: ${CATEGORIES.join(', ')}.
- "definition": Giải nghĩa ngắn gọn, dễ hiểu và chuẩn xác.
- "applications": Mảng gồm 2-3 chuỗi mô tả các ứng dụng thực tế.
- "youtubeUrl": Một URL video Youtube hướng dẫn (giả lập hoặc có thật, ví dụ "https://www.youtube.com/watch?v=...").
Trả về DUY NHẤT một mảng JSON, không bao gồm code block markdown hay bất kỳ text nào khác.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const terms = JSON.parse(text);
    return terms;
  } catch (error) {
    console.error("Lỗi khi sinh dữ liệu từ Gemini:", error);
    return [];
  }
}

async function seed() {
  console.log("Đang gọi Gemini để sinh dữ liệu...");
  const newTerms = await generateTerms(10); // Generate 10 terms for initial testing
  
  if (newTerms.length === 0) {
    console.log("Không có dữ liệu để lưu.");
    return;
  }

  console.log(`Đã sinh ${newTerms.length} thuật ngữ. Bắt đầu lưu vào file JSON...`);
  
  const outputPath = path.join(__dirname, '../../public/data/categories/generated_terms.json');
  
  let existingTerms = [];
  if (fs.existsSync(outputPath)) {
    const fileData = fs.readFileSync(outputPath, 'utf8');
    try {
      existingTerms = JSON.parse(fileData);
    } catch(e) {}
  }

  const combinedTerms = [...existingTerms, ...newTerms];
  
  fs.writeFileSync(outputPath, JSON.stringify(combinedTerms, null, 2), 'utf8');
  console.log(`Lưu dữ liệu thành công vào ${outputPath}`);
}

seed();

