import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const { pin } = await request.json();

    if (pin && pin.length >= 4) {
        const cookieStore = await cookies();
        cookieStore.set('auth_user_id', 'mock_user_id_' + pin, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/'
        });
        
        return NextResponse.json({ success: true, userId: 'mock_user_id_' + pin });
    }

    return NextResponse.json({ error: 'Mã PIN không hợp lệ' }, { status: 400 });
}

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_user_id');

    if (token) {
        return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_user_id');
    return NextResponse.json({ success: true });
}
