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
    const category = searchParams.get('category') || 'all';
    const limit = parseInt(searchParams.get('limit') || '5');

    let results = getAllTerms();

    if (category && category !== 'all') {
        results = results.filter(t => t.category === category);
    }

    const shuffled = results.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(limit, results.length));

    const quizQuestions = selected.map(term => {
        const others = results.filter(t => t.id !== term.id).sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [term.term, ...others.map(t => t.term)].sort(() => 0.5 - Math.random());
        const correctAnswerIndex = options.indexOf(term.term);

        return {
            question: `Thuật ngữ nào mang ý nghĩa: "${term.definition}"?`,
            options: options,
            correctAnswerIndex,
            explanation: `Đúng! ${term.term} (${term.fullName || ''}) là thuật ngữ chính xác cho định nghĩa này. Ứng dụng tiêu biểu: ${term.applications ? term.applications.join(', ') : 'Chưa cập nhật'}.`
        };
    });

    return NextResponse.json(quizQuestions);
}
