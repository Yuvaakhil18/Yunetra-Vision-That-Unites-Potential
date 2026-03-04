import mongoose, { Schema, Document } from 'mongoose';

export interface IArenaSubmission extends Document {
    challenge: mongoose.Types.ObjectId;
    submittedBy: mongoose.Types.ObjectId;
    teamMembers?: mongoose.Types.ObjectId[];
    teamName?: string;
    
    // Dynamic submission fields (category-dependent)
    submissionData: {
        // Tech Development
        githubLink?: string;
        liveLink?: string;
        videoDemo?: string;
        pdfReport?: string;
        
        // UI/UX Design
        figmaLink?: string;
        videoWalkthrough?: string;
        pdfCaseStudy?: string;
        prototypeLink?: string;
        
        // Graphic Design, Photography
        driveLink?: string;
        behanceLink?: string;
        pdfPresentation?: string;
        videoPresentation?: string;
        
        // Video Editing, VFX
        videoLink?: string;
        scriptLink?: string;
        breakdownVideo?: string;
        
        // Content Writing
        documentLink?: string;
        additionalLinks?: string;
        pdfVersion?: string;
        
        // Digital Marketing
        presentationLink?: string;
        campaignLinks?: string;
        analyticsScreenshots?: string;
        
        // Music Production
        audioLink?: string;
        projectFiles?: string;
        
        // Business Strategy
        videoPitch?: string;
        spreadsheetLink?: string;
        additionalDocs?: string;
        
        // Data Analytics
        dashboardLink?: string;
        reportLink?: string;
        
        // Universal optional field
        description?: string;
        editingProcess?: string;
        videoSlideshow?: string;
    };
    
    status: 'submitted' | 'under_review' | 'finalist' | 'winner' | 'rejected';
    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ArenaSubmissionSchema = new Schema<IArenaSubmission>(
    {
        challenge: {
            type: Schema.Types.ObjectId,
            ref: 'ArenaChallenge',
            required: true,
        },
        submittedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        teamMembers: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        teamName: {
            type: String,
            trim: true,
        },
        submissionData: {
            type: Schema.Types.Mixed,
            required: true,
        },
        status: {
            type: String,
            enum: ['submitted', 'under_review', 'finalist', 'winner', 'rejected'],
            default: 'submitted',
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
ArenaSubmissionSchema.index({ challenge: 1, submittedBy: 1 }, { unique: true });
ArenaSubmissionSchema.index({ challenge: 1, status: 1 });
ArenaSubmissionSchema.index({ submittedBy: 1 });

export default mongoose.models.ArenaSubmission || mongoose.model<IArenaSubmission>('ArenaSubmission', ArenaSubmissionSchema);
