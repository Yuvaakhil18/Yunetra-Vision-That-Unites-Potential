import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// POST /api/follow/block/:userId - Block a user
export async function POST(req: Request, { params }: { params: { userId: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const currentUserId = (session.user as any).id;
        const targetUserId = params.userId;

        if (currentUserId === targetUserId) {
            return NextResponse.json({ message: 'Cannot block yourself' }, { status: 400 });
        }

        await connectToDatabase();

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Add to blocked list
        currentUser.blocked = currentUser.blocked || [];
        if (!currentUser.blocked.includes(targetUserId)) {
            currentUser.blocked.push(targetUserId);
        }

        // Remove from following/followers if following
        if (currentUser.following?.includes(targetUserId)) {
            currentUser.following = currentUser.following.filter((id: any) => id.toString() !== targetUserId);
            currentUser.followingCount = Math.max(0, (currentUser.followingCount || 0) - 1);
            
            targetUser.followers = targetUser.followers?.filter((id: any) => id.toString() !== currentUserId);
            targetUser.followersCount = Math.max(0, (targetUser.followersCount || 0) - 1);
        }

        if (currentUser.followers?.includes(targetUserId)) {
            currentUser.followers = currentUser.followers.filter((id: any) => id.toString() !== targetUserId);
            currentUser.followersCount = Math.max(0, (currentUser.followersCount || 0) - 1);
            
            targetUser.following = targetUser.following?.filter((id: any) => id.toString() !== currentUserId);
            targetUser.followingCount = Math.max(0, (targetUser.followingCount || 0) - 1);
        }

        await currentUser.save();
        await targetUser.save();

        return NextResponse.json({ blocked: true }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/follow/block/:userId - Unblock a user
export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const currentUserId = (session.user as any).id;
        const targetUserId = params.userId;

        await connectToDatabase();

        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Remove from blocked list
        currentUser.blocked = currentUser.blocked?.filter((id: any) => id.toString() !== targetUserId);

        await currentUser.save();

        return NextResponse.json({ blocked: false }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
