import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Question from '@/models/Question';
import User from '@/models/User';

export async function POST(
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
        const { answers } = await req.json(); // Array of format: [{ questionId: '...', selectedOption: 2 }]

        if (!answers || !Array.isArray(answers) || answers.length !== 5) {
            return NextResponse.json({ message: 'Must submit exactly 5 answers' }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        let score = 0;

        for (const ans of answers) {
            const questionDoc = await Question.findById(ans.questionId);
            if (questionDoc && questionDoc.skill === skillName && questionDoc.correctAnswer === ans.selectedOption) {
                score++;
            }
        }

        const passed = score >= 3;

        // Ensure arrays exist before pushing
        if (!user.verifiedSkills) {
            await User.updateOne({ _id: userId }, { $set: { verifiedSkills: [] } });
        }
        if (!user.skillsTeach) {
            await User.updateOne({ _id: userId }, { $set: { skillsTeach: [] } });
        }

        if (passed) {
            await User.updateOne(
                { _id: userId },
                {
                    $addToSet: {
                        verifiedSkills: skillName,
                        skillsTeach: skillName
                    },
                    $set: { [`skillTestAttempts.${skillName}`]: new Date() }
                }
            );
            return NextResponse.json({ passed: true, score, message: 'Skill verified successfully!' }, { status: 200 });
        } else {
            await User.updateOne(
                { _id: userId },
                { $set: { [`skillTestAttempts.${skillName}`]: new Date() } }
            );
            return NextResponse.json({ passed: false, score, message: 'Score too low.', canRetryAfter: 24 }, { status: 200 });
        }

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
