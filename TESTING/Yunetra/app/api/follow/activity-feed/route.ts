import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
export const dynamic = 'force-dynamic';

// GET /api/follow/activity-feed - Get activity feed from followed users
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const currentUserId = (session.user as any).id;

        await connectToDatabase();

        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const following = currentUser.following || [];

        // Get all users the current user follows, excluding blocked users
        const followedUsers = await User.find({
            _id: {
                $in: following,
                $nin: currentUser.blocked || []
            }
        })
            .select('activityFeed name');

        // Merge all activity feeds
        const allActivities: any[] = [];
        followedUsers.forEach((user: any) => {
            if (user.activityFeed && user.activityFeed.length > 0) {
                user.activityFeed.forEach((activity: any) => {
                    allActivities.push({
                        ...activity.toObject(),
                        userId: user._id,
                        userName: user.name
                    });
                });
            }
        });

        // Sort by date (newest first) and limit to 50
        const sortedActivities = allActivities
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 50);

        // Populate related user info
        const userIds = sortedActivities
            .filter(a => a.relatedUser)
            .map(a => a.relatedUser);

        const relatedUsers = await User.find({
            _id: { $in: userIds }
        }).select('name');

        const relatedUsersMap = new Map();
        relatedUsers.forEach((user: any) => {
            relatedUsersMap.set(user._id.toString(), user.name);
        });

        // Add related user names
        const enrichedActivities = sortedActivities.map(activity => ({
            ...activity,
            relatedUserName: activity.relatedUser
                ? relatedUsersMap.get(activity.relatedUser.toString())
                : null
        }));

        return NextResponse.json({
            activities: enrichedActivities,
            total: enrichedActivities.length
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
