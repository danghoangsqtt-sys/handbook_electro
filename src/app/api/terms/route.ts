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
        results = results.filter(t => {
            const termRaw = t.term || '';
            const fullNameRaw = t.fullName || '';
            const defRaw = t.definition || '';
            const appsRaw = t.applications ? t.applications.join(' ') : '';
            
            const termMatches = removeAccents(termRaw).toLowerCase().includes(query);
            const fullNameMatches = removeAccents(fullNameRaw).toLowerCase().includes(query);
            const defMatches = removeAccents(defRaw).toLowerCase().includes(query);
            const appsMatches = removeAccents(appsRaw).toLowerCase().includes(query);

            return termMatches || fullNameMatches || defMatches || appsMatches;
        });
    }

    return NextResponse.json(results);
}
