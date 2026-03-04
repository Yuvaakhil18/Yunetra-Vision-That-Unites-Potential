import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/follow/suggestions - Get follow suggestions
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
        const blocked = currentUser.blocked || [];
        const skillsToLearn = currentUser.skillsLearn || [];

        const suggestions: any[] = [];
        const suggestionIds = new Set();

        // 1. Users who can teach skills you want to learn (highest priority)
        if (skillsToLearn.length > 0) {
            const skillTeachers = await User.find({
                _id: { 
                    $ne: currentUserId,
                    $nin: [...following, ...blocked]
                },
                skillsTeach: { $in: skillsToLearn }
            })
            .select('name email college skillsTeach rating totalSessions')
            .limit(5);

            skillTeachers.forEach((user: any) => {
                const matchingSkills = user.skillsTeach.filter((skill: string) => 
                    skillsToLearn.includes(skill)
                );
                if (matchingSkills.length > 0 && !suggestionIds.has(user._id.toString())) {
                    suggestions.push({
                        ...user.toObject(),
                        reason: `Teaches ${matchingSkills[0]}`
                    });
                    suggestionIds.add(user._id.toString());
                }
            });
        }

        // 2. Users from same college
        if (currentUser.college && suggestions.length < 10) {
            const sameCollegeUsers = await User.find({
                _id: { 
                    $ne: currentUserId,
                    $nin: [...following, ...blocked, ...Array.from(suggestionIds)]
                },
                college: currentUser.college
            })
            .select('name email college skillsTeach rating totalSessions')
            .limit(10 - suggestions.length);

            sameCollegeUsers.forEach((user: any) => {
                if (!suggestionIds.has(user._id.toString())) {
                    suggestions.push({
                        ...user.toObject(),
                        reason: `From ${user.college}`
                    });
                    suggestionIds.add(user._id.toString());
                }
            });
        }

        // 3. Friends of friends (users followed by people you follow)
        if (suggestions.length < 10 && following.length > 0) {
            const followedUsers = await User.find({
                _id: { $in: following }
            }).select('following name');

            const friendsOfFriends: any[] = [];
            followedUsers.forEach((user: any) => {
                if (user.following) {
                    user.following.forEach((friendId: any) => {
                        const friendIdStr = friendId.toString();
                        if (friendIdStr !== currentUserId && 
                            !following.some((id: any) => id.toString() === friendIdStr) &&
                            !blocked.some((id: any) => id.toString() === friendIdStr) &&
                            !suggestionIds.has(friendIdStr)) {
                            friendsOfFriends.push({
                                userId: friendId,
                                followedBy: user.name
                            });
                        }
                    });
                }
            });

            if (friendsOfFriends.length > 0) {
                const friendIds = friendsOfFriends.map(f => f.userId).slice(0, 10 - suggestions.length);
                const friendUsers = await User.find({
                    _id: { $in: friendIds }
                }).select('name email college skillsTeach rating totalSessions');

                friendUsers.forEach((user: any) => {
                    const friendData = friendsOfFriends.find(f => f.userId.toString() === user._id.toString());
                    if (friendData && !suggestionIds.has(user._id.toString())) {
                        suggestions.push({
                            ...user.toObject(),
                            reason: `Followed by ${friendData.followedBy}`
                        });
                        suggestionIds.add(user._id.toString());
                    }
                });
            }
        }

        // 4. Top rated users not already followed
        if (suggestions.length < 10) {
            const topRated = await User.find({
                _id: { 
                    $ne: currentUserId,
                    $nin: [...following, ...blocked, ...Array.from(suggestionIds)]
                },
                rating: { $gte: 4 },
                totalSessions: { $gte: 5 }
            })
            .select('name email college skillsTeach rating totalSessions')
            .sort({ rating: -1, totalSessions: -1 })
            .limit(10 - suggestions.length);

            topRated.forEach((user: any) => {
                if (!suggestionIds.has(user._id.toString())) {
                    suggestions.push({
                        ...user.toObject(),
                        reason: 'Top rated mentor'
                    });
                    suggestionIds.add(user._id.toString());
                }
            });
        }

        return NextResponse.json({
            suggestions: suggestions.slice(0, 10)
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
