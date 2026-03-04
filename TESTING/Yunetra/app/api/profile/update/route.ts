import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(req: Request) {
    try {
        // Requires an active session
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();
        const { name, bio, college, year, branch, skillsTeach, skillsLearn } = body;

        await connectToDatabase();

        // Find the user and update only allowed fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name,
                    bio,
                    college,
                    year,
                    branch,
                    skillsTeach,
                    skillsLearn,
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Profile updated successfully', user: updatedUser },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
