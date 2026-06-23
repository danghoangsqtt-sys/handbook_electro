import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Memory cache for all terms
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedTerms: any[] | null = null;

function removeAccents(str: string): string {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

function getAllTerms() {
    if (cachedTerms) return cachedTerms;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allTerms: any[] = [];
    const categoriesDir = path.join(process.cwd(), 'public/data/categories');
    
    if (fs.existsSync(categoriesDir)) {
        const files = fs.readdirSync(categoriesDir);
        for (const file of files) {
            if (file.endsWith('.json')) {
                const data = fs.readFileSync(path.join(categoriesDir, file), 'utf8');
                try {
                    allTerms = allTerms.concat(JSON.parse(data));
                } catch {}
            }
        }
    }
    cachedTerms = allTerms;
    return allTerms;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('q') || '';
    const query = removeAccents(rawQuery).toLowerCase();
    const category = searchParams.get('category') || 'all';

    let results = getAllTerms();

    if (category && category !== 'all') {
        results = results.filter(t => t.category === category);
    }

    if (query) {
        const scoredResults = results.map(t => {
            let score = 0;
            const termRaw = t.term || '';
            const fullNameRaw = t.fullName || '';
            const defRaw = t.definition || '';
            const appsRaw = t.applications ? t.applications.join(' ') : '';
            
            const termClean = removeAccents(termRaw).toLowerCase();
            const fullNameClean = removeAccents(fullNameRaw).toLowerCase();
            const defClean = removeAccents(defRaw).toLowerCase();
            const appsClean = removeAccents(appsRaw).toLowerCase();

            if (termClean === query) {
                score += 100;
            } else if (termClean.startsWith(query) || termClean.split(' ').some(word => word.startsWith(query))) {
                score += 60;
            } else if (termClean.includes(query)) {
                score += 50;
            }

            if (fullNameClean === query) {
                score += 80;
            } else if (fullNameClean.includes(query)) {
                score += 40;
            }

            // Đối với truy vấn quá ngắn (1-2 ký tự), chỉ tìm trong tên thuật ngữ (term, fullName)
            // để tránh bị nhiễu do trùng lặp ký tự đơn lẻ trong phần định nghĩa dài.
            if (query.length >= 3) {
                if (defClean.includes(query)) score += 20;
                if (appsClean.includes(query)) score += 10;
            }

            return { item: t, score };
        });

        results = scoredResults
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(result => result.item);
    }

    return NextResponse.json(results);
}
