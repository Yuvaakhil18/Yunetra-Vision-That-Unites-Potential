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
        const body = await req.json();
        const { teacherOutline, meetLink } = body;

        if (!teacherOutline || !Array.isArray(teacherOutline) || teacherOutline.length < 3) {
            return NextResponse.json(
                { message: 'Teacher outline must contain at least 3 points' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const sessionDoc = await SessionModel.findById(sessionId);

        if (!sessionDoc) {
            return NextResponse.json({ message: 'Session not found' }, { status: 404 });
        }

        // Only the assigned teacher can confirm
        if (sessionDoc.teacherId.toString() !== userId) {
            return NextResponse.json({ message: 'Only the teacher can confirm this session' }, { status: 403 });
        }

        sessionDoc.teacherOutline = teacherOutline;
        sessionDoc.meetLink = meetLink;
        sessionDoc.status = 'confirmed';

        await sessionDoc.save();

        return NextResponse.json({ message: 'Session confirmed successfully', session: sessionDoc }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
