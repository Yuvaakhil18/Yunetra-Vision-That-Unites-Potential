import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
export const dynamic = 'force-dynamic';

// GET /api/follow/status/:userId - Check follow status with a user
export async function GET(req: Request, { params }: { params: { userId: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const currentUserId = (session.user as any).id;
        const targetUserId = params.userId;

        await connectToDatabase();

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isFollowing = currentUser.following?.some((id: any) => id.toString() === targetUserId) || false;
        const isFollowedBy = currentUser.followers?.some((id: any) => id.toString() === targetUserId) || false;
        const isConnected = isFollowing && isFollowedBy;
        const isBlocked = currentUser.blocked?.some((id: any) => id.toString() === targetUserId) || false;

        return NextResponse.json({
            isFollowing,
            isFollowedBy,
            isConnected,
            isBlocked
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
