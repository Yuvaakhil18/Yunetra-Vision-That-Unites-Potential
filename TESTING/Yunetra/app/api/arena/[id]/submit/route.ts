import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ArenaChallenge from '@/models/ArenaChallenge';
import ArenaSubmission from '@/models/ArenaSubmission';
import User from '@/models/User';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const body = await request.json();
        const { submissionData, teamMembers, teamName } = body;

        // Fetch challenge
        const challenge = await ArenaChallenge.findById(params.id);
        if (!challenge) {
            return NextResponse.json(
                { success: false, error: 'Challenge not found' },
                { status: 404 }
            );
        }

        // Check if challenge is still active
        if (challenge.status !== 'active') {
            return NextResponse.json(
                { success: false, error: 'Challenge is not active' },
                { status: 400 }
            );
        }

        // Check deadline
        if (new Date(challenge.deadline) < new Date()) {
            return NextResponse.json(
                { success: false, error: 'Challenge deadline has passed' },
                { status: 400 }
            );
        }

        // Check if user already submitted
        const existingSubmission = await ArenaSubmission.findOne({
            challenge: params.id,
            submittedBy: userId
        });

        if (existingSubmission) {
            return NextResponse.json(
                { success: false, error: 'You have already submitted to this challenge' },
                { status: 400 }
            );
        }

        // Validate team requirements
        if (!challenge.allowSolo && (!teamMembers || teamMembers.length < (challenge.minTeamSize || 2) - 1)) {
            return NextResponse.json(
                { success: false, error: `This challenge requires a team of at least ${challenge.minTeamSize} members` },
                { status: 400 }
            );
        }

        if (teamMembers && teamMembers.length > (challenge.maxTeamSize || 1) - 1) {
            return NextResponse.json(
                { success: false, error: `Team size cannot exceed ${challenge.maxTeamSize} members` },
                { status: 400 }
            );
        }

        // Create submission
        const submission = await ArenaSubmission.create({
            challenge: params.id,
            submittedBy: userId,
            teamMembers: teamMembers || [],
            teamName: teamName || undefined,
            submissionData,
            status: 'submitted'
        });

        // Update challenge
        challenge.submissions.push(submission._id as any);
        challenge.totalSubmissions += 1;
        await challenge.save();

        // Add activity to user's feed
        await User.findByIdAndUpdate(userId, {
            $push: {
                activityFeed: {
                    $each: [{
                        type: 'joined_arena',
                        timestamp: new Date(),
                        metadata: {
                            challengeTitle: challenge.title,
                            category: challenge.category
                        },
                        relatedChallenge: challenge._id
                    }],
                    $slice: -100
                }
            }
        });

        return NextResponse.json({
            success: true,
            submission,
            message: 'Submission successful! Good luck! 🚀'
        });

    } catch (error: any) {
        console.error('Arena submission error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// Get user's submission status for this challenge
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        
        const submission = await ArenaSubmission.findOne({
            challenge: params.id,
            submittedBy: userId
        }).populate('teamMembers', 'name email college');

        return NextResponse.json({
            success: true,
            hasSubmitted: !!submission,
            submission: submission || null
        });

    } catch (error: any) {
        console.error('Submission check error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
