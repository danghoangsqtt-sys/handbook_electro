import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

// Helper function to get the current user pin from cookies
async function getUserPin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_user_id')?.value;
    if (!token) return null;
    return token.replace('mock_user_id_', '');
}

export async function GET() {
    const userPin = await getUserPin();
    if (!userPin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_pin', userPin)
            .order('is_pinned', { ascending: false })
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const userPin = await getUserPin();
    if (!userPin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const title = body.title || 'Cuộc trò chuyện mới';

        const { data, error } = await supabase
            .from('chat_sessions')
            .insert([{ user_pin: userPin, title }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const userPin = await getUserPin();
    if (!userPin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, title, is_pinned } = await request.json();
        if (!id) return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (title !== undefined) updates.title = title;
        if (is_pinned !== undefined) updates.is_pinned = is_pinned;

        const { data, error } = await supabase
            .from('chat_sessions')
            .update(updates)
            .eq('id', id)
            .eq('user_pin', userPin)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const userPin = await getUserPin();
    if (!userPin) {
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
            .eq('user_pin', userPin);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
