import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;
        await connectToDatabase();

        const user = await User.findById(userId).select('badges verifiedSkills');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            badges: user.badges || [],
            verifiedSkills: user.verifiedSkills || []
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
