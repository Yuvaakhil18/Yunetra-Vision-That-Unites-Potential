import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spendCredits } from '@/lib/credits';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { amount, sessionId, description } = await req.json();

        if (!amount || amount <= 0 || !description) {
            return NextResponse.json(
                { message: 'Valid amount and description are required' },
                { status: 400 }
            );
        }

        const transaction = await spendCredits(userId, amount, sessionId || `req_${Date.now()}`, description);

        return NextResponse.json(
            { message: 'Credits spent successfully', transaction },
            { status: 200 }
        );
    } catch (error: any) {
        if (error.message === 'Insufficient credits') {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
