import { checkAndAwardBadges } from '@/lib/badges';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { userId } = await req.json();
    await checkAndAwardBadges(userId);
    return NextResponse.json({ success: true });
}
