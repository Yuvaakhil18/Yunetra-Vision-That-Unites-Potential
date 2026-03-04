import { Schema, model, models, Document } from 'mongoose';

export interface IQuestion extends Document {
    skill: string;
    question: string;
    options: string[];
    correctAnswer: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

const QuestionSchema = new Schema<IQuestion>({
    skill: { type: String, required: true, index: true },
    question: { type: String, required: true },
    options: {
        type: [String],
        required: true,
        validate: [
            (v: string[]) => v.length === 4,
            'A question must have exactly 4 options'
        ]
    },
    correctAnswer: { type: Number, required: true, min: 0, max: 3 },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    }
});

const Question = models.Question || model<IQuestion>('Question', QuestionSchema);

export default Question;
