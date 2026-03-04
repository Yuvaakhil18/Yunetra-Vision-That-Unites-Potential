import { Schema, model, models, Document } from 'mongoose';

export interface ITransaction extends Document {
    fromUserId?: string;
    toUserId?: string;
    amount: number;
    type: 'earned' | 'spent' | 'pending' | 'refunded';
    sessionId?: string;
    description: string;
    status: 'completed' | 'pending' | 'disputed' | 'refunded';
    createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
    fromUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    toUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: ['earned', 'spent', 'pending', 'refunded'],
        required: true,
    },
    sessionId: { type: String },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['completed', 'pending', 'disputed', 'refunded'],
        default: 'completed',
    },
    createdAt: { type: Date, default: Date.now },
});

const Transaction = models.Transaction || model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
