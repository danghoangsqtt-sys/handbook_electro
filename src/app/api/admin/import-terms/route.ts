import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
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
                    } catch (e) {
                        console.error('Error parsing JSON:', file, e);
                    }
                }
            }
        }

        if (allTerms.length === 0) {
            return NextResponse.json({ success: false, message: 'Không tìm thấy dữ liệu JSON cục bộ.' }, { status: 400 });
        }

        // Map data to match Supabase schema
        const payload = allTerms.map(term => ({
            term: term.term || '',
            fullName: term.fullName || '',
            category: term.category || 'Khác',
            definition: term.definition || '',
            applications: term.applications || [],
            tags: [], // Local JSON didn't have tags
            youtubeUrl: term.youtubeUrl || '',
            icon: term.icon || '',
            is_active: true
        }));

        // Insert to Supabase
        const { error } = await supabase.from('terms').insert(payload);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true, count: payload.length });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
    }
}
