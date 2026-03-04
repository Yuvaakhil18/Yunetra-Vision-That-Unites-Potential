import { Schema, model, models, Document } from 'mongoose';

export interface ISession extends Document {
    teacherId: string;
    learnerId: string;
    skill: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';
    scheduledAt: Date;
    duration: number;
    meetLink?: string;
    teacherOutline: string[];
    learnerLevel?: string;
    learnerGoal?: string;
    teacherConfirmed: boolean;
    learnerConfirmed: boolean;
    teacherRating?: number;
    learnerRating?: number;
    teacherReview?: string;
    learnerReview?: string;
    disputeReason?: string;
    creditTransactionId?: string;
    startTime?: Date;
    createdAt: Date;
}

const SessionSchema = new Schema<ISession>({
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'disputed', 'cancelled'],
        default: 'pending',
    },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    meetLink: { type: String },
    teacherOutline: { type: [String], default: [] },
    learnerLevel: { type: String },
    learnerGoal: { type: String },
    teacherConfirmed: { type: Boolean, default: false },
    learnerConfirmed: { type: Boolean, default: false },
    teacherRating: { type: Number, min: 1, max: 5 },
    learnerRating: { type: Number, min: 1, max: 5 },
    teacherReview: { type: String },
    learnerReview: { type: String },
    disputeReason: { type: String },
    creditTransactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    startTime: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

const Session = models.Session || model<ISession>('Session', SessionSchema);

export default Session;
