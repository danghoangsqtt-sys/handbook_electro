import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getAllTerms() {
    let allTerms: any[] = [];
    const categoriesDir = path.join(process.cwd(), 'public/data/categories');
    
    if (fs.existsSync(categoriesDir)) {
        const files = fs.readdirSync(categoriesDir);
        for (const file of files) {
            if (file.endsWith('.json')) {
                const data = fs.readFileSync(path.join(categoriesDir, file), 'utf8');
                try {
                    allTerms = allTerms.concat(JSON.parse(data));
                } catch(e) {}
            }
        }
    }
    return allTerms;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').toLowerCase();
    const category = searchParams.get('category') || 'all';

    let results = getAllTerms();

    if (category && category !== 'all') {
        results = results.filter(t => t.category === category);
    }

    if (query) {
        results = results.filter(t => 
            t.term.toLowerCase().includes(query) || 
            (t.fullName && t.fullName.toLowerCase().includes(query)) ||
            (t.definition && t.definition.toLowerCase().includes(query))
        );
    }

    return NextResponse.json(results);
}
