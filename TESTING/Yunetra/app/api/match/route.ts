import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { calculateCompatibility } from '@/lib/matchingAlgorithm';

export async function GET(req: Request) {
    try {
        // Requires an active session
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;

        await connectToDatabase();

        // Fetch logged-in user
        const currentUser = await User.findById(userId).lean();

        if (!currentUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Ensure skills arrays exist
        if (!currentUser.skillsTeach) currentUser.skillsTeach = [];
        if (!currentUser.skillsLearn) currentUser.skillsLearn = [];

        // Fetch all OTHER users
        const otherUsers = await User.find({ _id: { $ne: currentUser._id } }).lean();
        
        console.log(`Found ${otherUsers.length} other users for matching`);
        console.log(`Current user skills: teach=${currentUser.skillsTeach}, learn=${currentUser.skillsLearn}`);

        // Run matching algorithm
        const matches = otherUsers
            .map(otherUser => {
                // Ensure all required fields exist
                if (!otherUser.skillsTeach) otherUser.skillsTeach = [];
                if (!otherUser.skillsLearn) otherUser.skillsLearn = [];
                if (!otherUser.badges) otherUser.badges = [];
                
                return calculateCompatibility(
                    {
                        _id: currentUser._id.toString(),
                        name: currentUser.name,
                        college: currentUser.college || '',
                        year: currentUser.year || '',
                        branch: currentUser.branch || '',
                        skillsTeach: currentUser.skillsTeach,
                        skillsLearn: currentUser.skillsLearn,
                        rating: currentUser.rating || 0,
                        totalSessions: currentUser.totalSessions || 0,
                        badges: currentUser.badges || []
                    },
                    {
                        _id: otherUser._id.toString(),
                        name: otherUser.name,
                        college: otherUser.college || '',
                        year: otherUser.year || '',
                        branch: otherUser.branch || '',
                        skillsTeach: otherUser.skillsTeach,
                        skillsLearn: otherUser.skillsLearn,
                        rating: otherUser.rating || 0,
                        totalSessions: otherUser.totalSessions || 0,
                        badges: otherUser.badges || []
                    }
                );
            })
            .filter(match => match.compatibilityScore >= 20)
            .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
            .slice(0, 10); // Return top 10

        console.log(`Found ${matches.length} matches with score >= 20`);
        matches.forEach(m => console.log(`  → ${m.name}: ${m.compatibilityScore}% [${m.matchReasons.join('; ')}]`));

        return NextResponse.json({ matches }, { status: 200 });
    } catch (error: any) {
        console.error('Match API Error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
