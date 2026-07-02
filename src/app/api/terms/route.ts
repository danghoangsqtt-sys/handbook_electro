import { NextResponse } from 'next/server';


import { supabase } from '@/lib/supabase';

// Memory cache for all terms
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedTerms: any[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function removeAccents(str: string): string {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

async function getAllTerms() {
    if (cachedTerms && (Date.now() - lastFetchTime < CACHE_TTL)) {
        return cachedTerms;
    }

    const { data, error } = await supabase.from('terms').select('*').eq('is_active', true);
    
    if (error) {
        console.error('Error fetching terms from Supabase:', error);
        return cachedTerms || [];
    }

    cachedTerms = data || [];
    lastFetchTime = Date.now();
    return cachedTerms;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('q') || '';
    const query = removeAccents(rawQuery).toLowerCase();
    const category = searchParams.get('category') || 'all';

    let results = await getAllTerms();

    if (category && category !== 'all' && category !== 'Tất cả') {
        results = results.filter(t => t.category === category);
    }

    const randomLimit = parseInt(searchParams.get('random') || '0', 10);
    if (randomLimit > 0) {
        const shuffled = [...results].sort(() => 0.5 - Math.random());
        return NextResponse.json(shuffled.slice(0, randomLimit));
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
