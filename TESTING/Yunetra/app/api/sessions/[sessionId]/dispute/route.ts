import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import SessionModel from '@/models/Session';
import { refundCredits } from '@/lib/credits';

export async function PUT(
    req: Request,
    { params }: { params: { sessionId: string } }
) {
    try {
        const authSession = await getServerSession(authOptions);
        if (!authSession || !authSession.user || !(authSession.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = (authSession.user as any).id;
        const { sessionId } = params;
        const body = await req.json();
        const { reason } = body;

        if (!reason || reason.length < 20) {
            return NextResponse.json(
                { message: 'Dispute reason must be at least 20 characters' },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const sessionDoc = await SessionModel.findById(sessionId);

        if (!sessionDoc) {
            return NextResponse.json({ message: 'Session not found' }, { status: 404 });
        }

        // Only learners can dispute a session
        if (sessionDoc.learnerId.toString() !== userId) {
            return NextResponse.json({ message: 'Only learners can dispute a session' }, { status: 403 });
        }

        if (sessionDoc.status === 'completed' || sessionDoc.status === 'cancelled') {
            return NextResponse.json({ message: 'Cannot dispute a completed or cancelled session' }, { status: 400 });
        }

        // Refund credits back to learner
        await refundCredits(sessionId);

        sessionDoc.status = 'disputed';
        sessionDoc.disputeReason = reason;

        await sessionDoc.save();

        return NextResponse.json({ message: 'Session disputed and credits refunded', session: sessionDoc }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
