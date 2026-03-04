import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import SessionModel from '@/models/Session';

export async function GET(req: Request) {
    try {
        const authSession = await getServerSession(authOptions);
        if (!authSession || !authSession.user || !(authSession.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = (authSession.user as any).id;

        await connectToDatabase();

        // Find all sessions where the user is either the teacher or the learner
        const sessions = await SessionModel.find({
            $or: [{ teacherId: userId }, { learnerId: userId }]
        })
            .sort({ scheduledAt: -1 })
            .populate('teacherId', 'name email college rating')
            .populate('learnerId', 'name email college rating')
            .lean();

        return NextResponse.json({ sessions }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
