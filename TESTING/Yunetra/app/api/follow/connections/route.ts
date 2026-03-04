import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/follow/connections - Get mutual follows (connected users)
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

        // Find users who are in both following and followers arrays (mutual follow)
        const following = currentUser.following || [];
        const followers = currentUser.followers || [];
        
        const connectionIds = following.filter((id: any) => 
            followers.some((fid: any) => fid.toString() === id.toString())
        );

        const connections = await User.find({
            _id: { $in: connectionIds }
        })
        .select('name email college year branch skillsTeach rating totalSessions badges followersCount followingCount')
        .sort({ createdAt: -1 });

        return NextResponse.json({
            connections: connections.map((user: any) => ({
                ...user.toObject(),
                isConnected: true
            })),
            total: connections.length
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
