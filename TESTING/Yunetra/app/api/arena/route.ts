import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ArenaChallenge from '@/models/ArenaChallenge';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');
        const status = searchParams.get('status') || 'active';
        const search = searchParams.get('search');

        // Build filter query
        const filter: any = { status };
        
        if (category && category !== 'all') {
            filter.category = category;
        }
        
        if (difficulty) {
            filter.difficulty = difficulty;
        }
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { organization: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Fetch challenges
        const challenges = await ArenaChallenge.find(filter)
            .sort({ deadline: 1, createdAt: -1 })
            .select('-submissions')
            .lean();

        // Calculate days remaining for each challenge
        const challengesWithMeta = challenges.map(challenge => ({
            ...challenge,
            daysRemaining: Math.ceil((new Date(challenge.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
            isExpired: new Date(challenge.deadline) < new Date()
        }));

        return NextResponse.json({
            success: true,
            challenges: challengesWithMeta,
            count: challengesWithMeta.length
        });

    } catch (error: any) {
        console.error('Arena challenges fetch error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
