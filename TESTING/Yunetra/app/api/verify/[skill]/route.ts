import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Question from '@/models/Question';
import User from '@/models/User';
export const dynamic = 'force-dynamic';

export async function GET(
    req: Request,
    { params }: { params: { skill: string } }
) {
    try {
        const authSession = await getServerSession(authOptions);
        if (!authSession || !authSession.user || !(authSession.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = (authSession.user as any).id;
        const skillName = decodeURIComponent(params.skill);

        await connectToDatabase();

        // Enforce 24-hour retry timeout
        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        if (user.skillTestAttempts && user.skillTestAttempts.get) {
            const lastAttempt = user.skillTestAttempts.get(skillName);
            if (lastAttempt) {
                const hoursSince = (Date.now() - new Date(lastAttempt).getTime()) / (1000 * 60 * 60);

                if (hoursSince < 24 && (!user.verifiedSkills || !user.verifiedSkills.includes(skillName))) {
                    return NextResponse.json(
                        { message: 'You must wait 24 hours between test attempts.', canRetryAfter: 24 - hoursSince },
                        { status: 403 }
                    );
                }
            }
        }

        // Fetch 5 random questions
        const questions = await Question.aggregate([
            { $match: { skill: skillName } },
            { $sample: { size: 5 } },
            { $project: { correctAnswer: 0 } } // Exclude the answer from frontend
        ]);

        if (questions.length < 5) {
            return NextResponse.json({ message: 'Not enough questions available for this skill' }, { status: 400 });
        }

        return NextResponse.json({ questions }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
