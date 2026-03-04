export interface UserType {
    _id: string;
    name: string;
    college?: string;
    year?: string;
    branch?: string;
    skillsTeach: string[];
    skillsLearn: string[];
    rating: number;
    totalSessions: number;
    badges: string[];
}

export interface MatchResult {
    userId: string;
    name: string;
    college?: string;
    year?: string;
    skillsTeach: string[];
    skillsLearn: string[];
    rating: number;
    totalSessions: number;
    badges: string[];
    compatibilityScore: number;
    matchReasons: string[];
}

export function calculateCompatibility(currentUser: UserType, otherUser: UserType): MatchResult {
    let score = 0;
    const matchReasons: string[] = [];

    // Ensure arrays exist
    const currentTeach = currentUser.skillsTeach || [];
    const currentLearn = currentUser.skillsLearn || [];
    const otherTeach = otherUser.skillsTeach || [];
    const otherLearn = otherUser.skillsLearn || [];

    // A) Bidirectional Skill Overlap (50 points max)
    const forwardMatches = currentTeach.filter(skill => otherLearn.includes(skill));
    const reverseMatches = otherTeach.filter(skill => currentLearn.includes(skill));

    const totalPossibleMatches = Math.max(1, currentTeach.length + currentLearn.length);
    const overlapScore = ((forwardMatches.length + reverseMatches.length) / totalPossibleMatches) * 50;
    score += Math.min(50, overlapScore); // Cap at 50

    if (forwardMatches.length > 0) {
        matchReasons.push(`Wants to learn ${forwardMatches.join(', ')} which you can teach`);
    }
    if (reverseMatches.length > 0) {
        matchReasons.push(`Teaches ${reverseMatches.join(', ')} which you want to learn`);
    }

    // B) Rating Score (25 points max)
    let rating = otherUser.rating || 0;
    let ratingScore = 0;
    
    // Normalize rating: if > 5, assume it's stored as percentage (out of 100) and convert to 1-5 scale
    if (rating > 5) {
        rating = (rating / 100) * 5; // Convert percentage to 1-5 scale
    }
    
    if (rating === 0) {
        ratingScore = 12; // Neutral points for new users
    } else {
        ratingScore = (rating / 5) * 25;
        if (rating >= 4.5) {
            matchReasons.push('Highly rated teacher');
        }
    }
    score += ratingScore;

    // C) Session Experience (15 points max)
    const totalSessions = otherUser.totalSessions || 0;
    score += Math.min(totalSessions, 15);
    if (totalSessions > 10) {
        matchReasons.push('Experienced mentor');
    }

    // D) Same College Bonus (10 points)
    if (currentUser.college && otherUser.college && currentUser.college === otherUser.college) {
        score += 10;
        matchReasons.push('Same college as you');
    }

    // Cap the final score at 100 for proper percentage display
    const finalScore = Math.min(100, Math.round(score));
    
    // Compatibility score calculation complete

    return {
        userId: otherUser._id,
        name: otherUser.name || 'Unknown User',
        college: otherUser.college,
        year: otherUser.year,
        skillsTeach: otherTeach,
        skillsLearn: otherLearn,
        rating: rating,
        totalSessions: totalSessions,
        badges: otherUser.badges || [],
        compatibilityScore: finalScore,
        matchReasons
    };
}
