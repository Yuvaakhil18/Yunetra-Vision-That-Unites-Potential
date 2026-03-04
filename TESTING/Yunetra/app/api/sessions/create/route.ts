import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import SessionModel from '@/models/Session';
import { spendCredits } from '@/lib/credits';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const learnerId = (session.user as any).id;
        const body = await req.json();
        const { teacherId, skill, scheduledAt, duration, learnerLevel, learnerGoal } = body;

        if (!teacherId || !skill || !scheduledAt) {
            return NextResponse.json(
                { message: 'Teacher ID, skill, and scheduled time are required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Deduct 1 credit from learner (temporarily held in pending state by spendCredits/earnCredits logic)
        // Note: To match the prompt strictly, we "spend" 1 credit immediately upon booking
        const creditAmount = Math.ceil((duration || 60) / 60); // 1 credit per hour (default 1)

        // We use our lib utility to reserve/spend the credit
        const transaction = await spendCredits(
            learnerId,
            creditAmount,
            `booking_${Date.now()}`,
            `Booked ${skill} session with teacher ${teacherId}`
        );

        const newSession = new SessionModel({
            teacherId,
            learnerId,
            skill,
            scheduledAt: new Date(scheduledAt),
            duration: duration || 60,
            learnerLevel,
            learnerGoal,
            status: 'pending',
            creditTransactionId: transaction._id
        });

        await newSession.save();

        // Attach sessionId to the transaction retroactively
        transaction.sessionId = newSession._id.toString();
        transaction.type = 'pending'; // Convert to pending until completion
        transaction.status = 'pending'; // **CRITICAL FIX: Need to update the status to pending. The spendCredits function initializes as 'completed'
        transaction.toUserId = teacherId; // Set the recipient
        await transaction.save();

        return NextResponse.json(
            { message: 'Session booked successfully', session: newSession },
            { status: 201 }
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
