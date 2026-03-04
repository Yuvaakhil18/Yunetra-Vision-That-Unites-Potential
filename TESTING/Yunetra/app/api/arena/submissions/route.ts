import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ArenaSubmission from '@/models/ArenaSubmission';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();
        
        const userId = (session.user as any).id;
        
        const submissions = await ArenaSubmission.find({ submittedBy: userId })
            .populate('challenge', 'title organization category deadline prizeType prizeAmount internshipDetails')
            .populate('teamMembers', 'name email college')
            .sort({ submittedAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            submissions,
            count: submissions.length
        });

    } catch (error: any) {
        console.error('Submissions fetch error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
