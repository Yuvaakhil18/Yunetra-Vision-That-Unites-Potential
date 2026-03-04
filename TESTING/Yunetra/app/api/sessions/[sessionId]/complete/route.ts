import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import SessionModel from '@/models/Session';
import User from '@/models/User';
import { releaseCredits } from '@/lib/credits';

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
        const { rating, review, confirmedBy } = body;

        if (!rating || rating < 1 || rating > 5 || !confirmedBy) {
            return NextResponse.json(
                { message: 'Valid rating (1-5) and confirmedBy role are required' },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const sessionDoc = await SessionModel.findById(sessionId);

        if (!sessionDoc) {
            return NextResponse.json({ message: 'Session not found' }, { status: 404 });
        }

        if (sessionDoc.status !== 'in_progress' && sessionDoc.status !== 'confirmed') {
            return NextResponse.json({ message: 'Session must be started before completing' }, { status: 400 });
        }

        // Role specific logic
        if (confirmedBy === 'teacher' && sessionDoc.teacherId.toString() === userId) {
            sessionDoc.teacherConfirmed = true;
            sessionDoc.teacherRating = rating;
            sessionDoc.teacherReview = review;
        } else if (confirmedBy === 'learner' && sessionDoc.learnerId.toString() === userId) {
            sessionDoc.learnerConfirmed = true;
            sessionDoc.learnerRating = rating;
            sessionDoc.learnerReview = review;
        } else {
            return NextResponse.json({ message: 'You are not authorized for this role' }, { status: 403 });
        }

        // Check if BOTH have confirmed
        if (sessionDoc.teacherConfirmed && sessionDoc.learnerConfirmed) {
            // 1. Release Credits to teacher
            await releaseCredits(sessionId);

            // 2. Update Teacher's profile stats
            const teacher = await User.findById(sessionDoc.teacherId);
            const learner = await User.findById(sessionDoc.learnerId);
            
            if (teacher && sessionDoc.learnerRating) {
                const currentTotal = teacher.totalSessions || 0;
                const currentRating = teacher.rating || 0;

                // Calculate new average rating
                const newTotal = currentTotal + 1;
                const newRating = ((currentRating * currentTotal) + sessionDoc.learnerRating) / newTotal;

                teacher.totalSessions = newTotal;
                teacher.rating = Math.round(newRating * 10) / 10;
                
                // Add activity feed entry
                teacher.activityFeed = teacher.activityFeed || [];
                teacher.activityFeed.push({
                    type: 'taught_session',
                    description: `Taught ${sessionDoc.skill} to ${learner?.name || 'a student'}`,
                    relatedUser: sessionDoc.learnerId,
                    createdAt: new Date()
                });
                
                // Keep max 100 entries
                if (teacher.activityFeed.length > 100) {
                    teacher.activityFeed = teacher.activityFeed.slice(-100);
                }
                
                await teacher.save();
            }

            // 3. Award Badges
            const { checkAndAwardBadges } = await import('@/lib/badges');
            await checkAndAwardBadges(sessionDoc.teacherId.toString());

            sessionDoc.status = 'completed';
        }

        await sessionDoc.save();

        return NextResponse.json(
            { message: sessionDoc.status === 'completed' ? 'Session fully completed' : 'Partial confirmation saved', session: sessionDoc },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('--- COMPLETE ROUTE ERROR ---', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
