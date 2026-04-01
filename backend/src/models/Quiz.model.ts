import mongoose, { Document, Schema } from 'mongoose';

interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface IQuiz extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  questions: IQuestion[];
  createdAt: Date;
}

const QuestionSchema = new Schema({
  question:      { type: String, required: true },
  options:       [{ type: String }],
  correctAnswer: { type: Number, required: true },
});

const QuizSchema = new Schema<IQuiz>({
  courseId:  { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title:     { type: String, required: true },
  questions: [QuestionSchema],
}, { timestamps: true });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);