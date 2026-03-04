import mongoose, { Schema, Document } from 'mongoose';

export interface IArenaChallenge extends Document {
    title: string;
    description: string;
    organization: string;
    orgLogo?: string;
    category: 'tech_development' | 'ui_ux_design' | 'graphic_design' | 'video_editing' | 
              'vfx_motion' | 'content_writing' | 'digital_marketing' | 'music_production' | 
              'photography' | 'business_strategy' | 'data_analytics' | 'social_impact';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    skillsRequired: string[];
    prizeType: 'cash' | 'internship' | 'both';
    prizeAmount?: number;
    internshipDetails?: string;
    deadline: Date;
    allowSolo: boolean;
    minTeamSize?: number;
    maxTeamSize?: number;
    status: 'active' | 'completed' | 'cancelled';
    submissions: mongoose.Types.ObjectId[];
    totalSubmissions: number;
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ArenaChallengeSchema = new Schema<IArenaChallenge>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        organization: {
            type: String,
            required: true,
        },
        orgLogo: {
            type: String,
        },
        category: {
            type: String,
            required: true,
            enum: [
                'tech_development',
                'ui_ux_design',
                'graphic_design',
                'video_editing',
                'vfx_motion',
                'content_writing',
                'digital_marketing',
                'music_production',
                'photography',
                'business_strategy',
                'data_analytics',
                'social_impact'
            ],
        },
        difficulty: {
            type: String,
            required: true,
            enum: ['beginner', 'intermediate', 'advanced'],
        },
        skillsRequired: {
            type: [String],
            required: true,
        },
        prizeType: {
            type: String,
            required: true,
            enum: ['cash', 'internship', 'both'],
        },
        prizeAmount: {
            type: Number,
        },
        internshipDetails: {
            type: String,
        },
        deadline: {
            type: Date,
            required: true,
        },
        allowSolo: {
            type: Boolean,
            default: true,
        },
        minTeamSize: {
            type: Number,
            default: 1,
        },
        maxTeamSize: {
            type: Number,
            default: 1,
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active',
        },
        submissions: [{
            type: Schema.Types.ObjectId,
            ref: 'ArenaSubmission',
        }],
        totalSubmissions: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
ArenaChallengeSchema.index({ category: 1, status: 1 });
ArenaChallengeSchema.index({ deadline: 1, status: 1 });
ArenaChallengeSchema.index({ difficulty: 1, status: 1 });

export default mongoose.models.ArenaChallenge || mongoose.model<IArenaChallenge>('ArenaChallenge', ArenaChallengeSchema);
