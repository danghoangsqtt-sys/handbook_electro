import fs from 'fs';
import path from 'path';

const categoriesDir = path.join(process.cwd(), 'public/data/categories');
const files = fs.readdirSync(categoriesDir);

let totalRemoved = 0;

for (const file of files) {
    if (file.endsWith('.json')) {
        const filePath = path.join(categoriesDir, file);
        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        const initialLength = data.length;
        
        data = data.filter(item => {
            const t = item.term || '';
            // Junk terms contain "50 từ" or start with "1. Khoa học máy tính", etc.
            if (t.includes('50 từ') || /^\d+\.\s/.test(t)) {
                return false;
            }
            return true;
        });
        
        if (data.length !== initialLength) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            const removed = initialLength - data.length;
            totalRemoved += removed;
            console.log(`[CLEANUP] Removed ${removed} junk items from ${file}`);
        }
    }
}

console.log(`Cleanup complete. Total junk removed: ${totalRemoved}`);
