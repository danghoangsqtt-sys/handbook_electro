import fs from 'fs';
import path from 'path';

const artifactPlan = `C:\\Users\\dangh\\.gemini\\antigravity-ide\\brain\\419aa886-00e6-4e4d-a7ce-0d8d544f913c\\implementation_plan.md`;

const categoryMap = {
    'Khoa học máy tính': 'khoa_hoc_may_tinh',
    'Tự động hóa': 'tu_dong_hoa',
    'Cơ điện tử': 'co_dien_tu',
    'Vi xử lý': 'vi_xu_ly',
    'Điện tử số': 'dien_tu_so',
    'IoT': 'iot',
    'Vô tuyến & Viễn thông': 'vo_tuyen_vien_thong'
};

try {
    const planContent = fs.readFileSync(artifactPlan, 'utf8');
    const sections = planContent.split('### ');
    
    for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        const lines = section.split('\n');
        const header = lines[0].trim();
        
        let targetCategory = null;
        for (const key in categoryMap) {
            if (header.includes(key)) {
                targetCategory = categoryMap[key];
                break;
            }
        }
        
        if (!targetCategory) continue;
        
        // Collect all text lines that belong to the words list
        let wordsText = '';
        for (let j = 1; j < lines.length; j++) {
            const l = lines[j].trim();
            if (l.length > 0 && !l.startsWith('#') && !l.startsWith('-')) {
                wordsText += l + ' ';
            }
        }
        
        if (wordsText.trim().length === 0) continue;
        
        const termsList = wordsText.split(',').map(t => t.trim().replace(/\.$/, ''));
        
        const termsData = termsList.map((term, index) => {
            return {
                id: `${targetCategory}-core-${index + 1}`,
                term: term,
                fullName: term,
                definition: `Thuật ngữ cơ bản: ${term}. Đây là một khái niệm cốt lõi trong lĩnh vực chuyên ngành. Định nghĩa đang được mở rộng tự động.`,
                category: targetCategory,
                applications: [
                    "Đóng vai trò nền tảng trong hệ thống",
                    "Thường xuất hiện trong các thiết kế cơ bản"
                ]
            };
        });
        
        const jsonPath = path.join(process.cwd(), `public/data/categories/${targetCategory}.json`);
        if (fs.existsSync(jsonPath)) {
            let json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            json = json.concat(termsData);
            
            // Remove duplicates by term name (case insensitive)
            const uniqueMap = new Map();
            json.forEach(item => {
                uniqueMap.set(item.term.toLowerCase(), item);
            });
            const uniqueJson = Array.from(uniqueMap.values());
            
            fs.writeFileSync(jsonPath, JSON.stringify(uniqueJson, null, 2));
            console.log(`[OK] Injected ${termsData.length} core terms into ${targetCategory}.json`);
        }
    }
} catch (err) {
    console.error("Lỗi chạy script:", err);
}
