import connectToDatabase from './mongodb';
import User from '@/models/User';
import SessionModel from '@/models/Session';

export async function checkAndAwardBadges(userId: string) {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) return [];

    // Fetch all completed sessions where this user was the teacher
    const completedSessions = await SessionModel.find({
        teacherId: userId,
        status: 'completed'
    });

    const totalCompleted = completedSessions.length;
    const skillCounts: Record<string, number> = {};

    for (const session of completedSessions) {
        skillCounts[session.skill] = (skillCounts[session.skill] || 0) + 1;
    }

    const currentBadges = new Set(user.badges || []);
    const newBadges: string[] = [];

    const awardBadge = (badgeName: string) => {
        if (!currentBadges.has(badgeName)) {
            currentBadges.add(badgeName);
            newBadges.push(badgeName);
        }
    };

    // Generic Milestones
    if (totalCompleted >= 1) awardBadge('First Step');
    if (totalCompleted >= 5) awardBadge('Rising Teacher');
    if (totalCompleted >= 10) awardBadge('Community Pillar');

    // Skill specific Milestones
    for (const [skill, count] of Object.entries(skillCounts)) {
        if (count >= 3) awardBadge(`${skill} Mentor — Level 1`);
        if (count >= 7) awardBadge(`${skill} Mentor — Level 2`);
        if (count >= 15) awardBadge(`${skill} Mentor — Level 3`);
    }

    if (newBadges.length > 0) {
        user.badges = Array.from(currentBadges);
        
        // Add activity feed entries for new badges
        user.activityFeed = user.activityFeed || [];
        for (const badge of newBadges) {
            user.activityFeed.push({
                type: 'earned_badge',
                description: `Earned ${badge} badge`,
                relatedBadge: badge,
                createdAt: new Date()
            });
        }
        
        // Keep max 100 entries
        if (user.activityFeed.length > 100) {
            user.activityFeed = user.activityFeed.slice(-100);
        }
        
        await user.save();
    }

    return newBadges;
}
