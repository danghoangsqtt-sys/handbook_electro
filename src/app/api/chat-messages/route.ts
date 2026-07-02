import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');
        if (!sessionId) return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });

        // Verify session belongs to user
        const { data: sessionData, error: sessionError } = await supabase
            .from('chat_sessions')
            .select('id')
            .eq('id', sessionId)
            .eq('user_id', user.id)
            .single();

        if (sessionError || !sessionData) {
            return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
        }

        // Fetch messages
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        
        // Convert to ai-sdk format
        const formattedMessages = data.map((msg: Record<string, unknown>) => {
            let fullContent = msg.content as string || '';
            const images = msg.images as string[];
            if (images && Array.isArray(images) && images.length > 0) {
                const imagesMarkdown = images.map(url => `\n![Attachment](${url})`).join('');
                fullContent += '\n' + imagesMarkdown;
            }
            return {
                id: msg.id,
                role: msg.role,
                content: fullContent
            };
        });

        return NextResponse.json(formattedMessages);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
