import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
    title: string;
    description?: string;
    url: string;
    type: "course" | "article" | "notes" | "internship" | "roadmap" | "tool";
    skill: string;
    uploadedBy: mongoose.Types.ObjectId;
    saves: mongoose.Types.ObjectId[];
    saveCount: number;
    upvotes: mongoose.Types.ObjectId[];
    upvoteCount: number;
    verified: boolean;
    createdAt: Date;
}

const ResourceSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, maxlength: 200 },
    url: { type: String, required: true },
    type: {
        type: String,
        enum: ["course", "article", "notes", "internship", "roadmap", "tool"],
        required: true,
    },
    skill: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    saves: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    saveCount: { type: Number, default: 0 },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    upvoteCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
