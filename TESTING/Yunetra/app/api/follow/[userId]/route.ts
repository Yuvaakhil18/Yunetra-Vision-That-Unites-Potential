import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// POST /api/follow/:userId - Follow a user
export async function POST(req: Request, { params }: { params: { userId: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const currentUserId = (session.user as any).id;
        const targetUserId = params.userId;

        // Cannot follow yourself
        if (currentUserId === targetUserId) {
            return NextResponse.json({ message: 'Cannot follow yourself' }, { status: 400 });
        }

        await connectToDatabase();

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Check if blocked
        if (currentUser.blocked?.some((id: any) => id.toString() === targetUserId) || targetUser.blocked?.some((id: any) => id.toString() === currentUserId)) {
            return NextResponse.json({ message: 'Cannot follow blocked user' }, { status: 403 });
        }

        // Check if already following
        if (currentUser.following?.some((id: any) => id.toString() === targetUserId)) {
            return NextResponse.json({ message: 'Already following this user' }, { status: 400 });
        }

        // Add to following and followers
        currentUser.following = currentUser.following || [];
        currentUser.following.push(new mongoose.Types.ObjectId(targetUserId));
        currentUser.followingCount = (currentUser.followingCount || 0) + 1;

        targetUser.followers = targetUser.followers || [];
        targetUser.followers.push(new mongoose.Types.ObjectId(currentUserId));
        targetUser.followersCount = (targetUser.followersCount || 0) + 1;

        // Check if mutual follow (connected)
        const isConnected = targetUser.following?.some((id: any) => id.toString() === currentUserId) || false;

        // Add activity feed entry for new follower
        targetUser.activityFeed = targetUser.activityFeed || [];
        targetUser.activityFeed.push({
            type: 'new_connection',
            description: `${currentUser.name} started following you`,
            relatedUser: new mongoose.Types.ObjectId(currentUserId),
            createdAt: new Date()
        });

        // If mutual follow, add connection activity to both
        if (isConnected) {
            currentUser.activityFeed = currentUser.activityFeed || [];
            currentUser.activityFeed.push({
                type: 'new_connection',
                description: `You and ${targetUser.name} are now Connected`,
                relatedUser: new mongoose.Types.ObjectId(targetUserId),
                createdAt: new Date()
            });

            targetUser.activityFeed.push({
                type: 'new_connection',
                description: `You and ${currentUser.name} are now Connected`,
                relatedUser: new mongoose.Types.ObjectId(currentUserId),
                createdAt: new Date()
            });
        }

        // Keep max 100 entries
        if (currentUser.activityFeed && currentUser.activityFeed.length > 100) {
            currentUser.activityFeed = currentUser.activityFeed.slice(-100);
        }
        if (targetUser.activityFeed && targetUser.activityFeed.length > 100) {
            targetUser.activityFeed = targetUser.activityFeed.slice(-100);
        }

        await currentUser.save({ validateModifiedOnly: true });
        await targetUser.save({ validateModifiedOnly: true });

        return NextResponse.json({ 
            following: true, 
            isConnected 
        }, { status: 200 });

    } catch (error: any) {
        console.error('Follow error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/follow/:userId - Unfollow a user
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
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Check if currently following
        if (!currentUser.following?.some((id: any) => id.toString() === targetUserId)) {
            return NextResponse.json({ message: 'Not following this user' }, { status: 400 });
        }

        // Remove from following and followers
        currentUser.following = currentUser.following.filter((id: any) => id.toString() !== targetUserId);
        currentUser.followingCount = Math.max(0, (currentUser.followingCount || 0) - 1);

        targetUser.followers = targetUser.followers?.filter((id: any) => id.toString() !== currentUserId);
        targetUser.followersCount = Math.max(0, (targetUser.followersCount || 0) - 1);

        await currentUser.save({ validateModifiedOnly: true });
        await targetUser.save({ validateModifiedOnly: true });

        return NextResponse.json({ 
            following: false, 
            isConnected: false 
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
