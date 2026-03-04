import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ArenaChallenge from '@/models/ArenaChallenge';
import ArenaSubmission from '@/models/ArenaSubmission';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        
        const challenge = await ArenaChallenge.findById(params.id)
            .populate('submissions')
            .lean();

        if (!challenge) {
            return NextResponse.json(
                { success: false, error: 'Challenge not found' },
                { status: 404 }
            );
        }

        // Calculate meta data
        const daysRemaining = Math.ceil((new Date(challenge.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const isExpired = new Date(challenge.deadline) < new Date();

        return NextResponse.json({
            success: true,
            challenge: {
                ...challenge,
                daysRemaining,
                isExpired
            }
        });

    } catch (error: any) {
        console.error('Challenge fetch error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
