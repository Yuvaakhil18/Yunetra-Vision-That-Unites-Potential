import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String },
    year: { type: String, enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'] },
    branch: { type: String },
    skillsTeach: { type: [String], default: [] },
    skillsLearn: { type: [String], default: [] },
    skillCredits: { type: Number, default: 3 },
    rating: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    verifiedSkills: { type: [String], default: [] },
    skillTestAttempts: { type: Map, of: Date, default: {} },
    createdAt: { type: Date, default: Date.now },
    
    // Follow System Fields
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blocked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followingCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    
    // Activity Feed
    activityFeed: [{
        type: {
            type: String,
            enum: [
                'joined_arena',        // applied to a challenge
                'won_arena',           // won a challenge
                'taught_session',      // completed a session as teacher
                'earned_badge',        // earned a new badge
                'shared_resource',     // uploaded a resource
                'joined_team',         // joined an arena team
                'new_connection'       // got a mutual follow
            ]
        },
        description: String,
        relatedUser: { type: Schema.Types.ObjectId, ref: 'User' },
        relatedChallenge: { type: Schema.Types.ObjectId, ref: 'ArenaChallenge' },
        relatedBadge: String,
        createdAt: { type: Date, default: Date.now }
    }]
});

const User = models.User || model('User', UserSchema);

export default User;
