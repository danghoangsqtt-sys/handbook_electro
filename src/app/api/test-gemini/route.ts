import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, error: 'API Key is missing' });
        }
        
        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: 'say hello',
        });
        
        return NextResponse.json({ success: true, text: result.text });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message, stack: err.stack, name: err.name });
    }
}
