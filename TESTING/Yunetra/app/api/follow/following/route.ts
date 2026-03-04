import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/follow/following - Get users current user follows
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const currentUserId = (session.user as any).id;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        await connectToDatabase();

        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const following = await User.find({
            _id: { $in: currentUser.following || [] }
        })
        .select('name email college year branch skillsTeach rating totalSessions badges')
        .skip(skip)
        .limit(limit);

        // Add isFollowingBack field
        const followingWithStatus = following.map((user: any) => ({
            ...user.toObject(),
            isFollowingBack: user.following?.some((id: any) => id.toString() === currentUserId) || false
        }));

        return NextResponse.json({
            following: followingWithStatus,
            total: currentUser.following?.length || 0,
            page,
            limit
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
