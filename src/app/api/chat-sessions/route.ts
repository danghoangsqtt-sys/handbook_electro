import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const postSchema = z.object({
    title: z.string().max(100).optional()
});

const patchSchema = z.object({
    id: z.string().uuid(),
    title: z.string().max(100).optional(),
    is_pinned: z.boolean().optional()
});

async function getAuthUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return { supabase, user };
}

export async function GET() {
    const { supabase, user } = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('is_pinned', { ascending: false })
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { supabase, user } = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const parsed = postSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        const title = parsed.data.title || 'Cuộc trò chuyện mới';

        const { data, error } = await supabase
            .from('chat_sessions')
            .insert([{ user_id: user.id, title }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const { supabase, user } = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const parsed = patchSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        const { id, title, is_pinned } = parsed.data;

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (title !== undefined) updates.title = title;
        if (is_pinned !== undefined) updates.is_pinned = is_pinned;

        const { data, error } = await supabase
            .from('chat_sessions')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { supabase, user } = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });

        const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
