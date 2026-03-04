import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import SessionModel from '@/models/Session';

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

        await connectToDatabase();

        const sessionDoc = await SessionModel.findById(sessionId);

        if (!sessionDoc) {
            return NextResponse.json({ message: 'Session not found' }, { status: 404 });
        }

        if (sessionDoc.teacherId.toString() !== userId && sessionDoc.learnerId.toString() !== userId) {
            return NextResponse.json({ message: 'You are not part of this session' }, { status: 403 });
        }

        if (sessionDoc.status !== 'confirmed') {
            return NextResponse.json({ message: 'Session must be confirmed before starting' }, { status: 400 });
        }

        sessionDoc.status = 'in_progress';
        sessionDoc.startTime = new Date();

        await sessionDoc.save();

        return NextResponse.json({ message: 'Session started', session: sessionDoc }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
