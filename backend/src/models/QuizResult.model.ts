import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizResult extends Document {
  studentId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  score: number;
  totalQuestions: number;
  answers: Record<string, number>;
  attemptDate: Date;
}

const QuizResultSchema = new Schema<IQuizResult>({
  studentId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId:         { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  courseId:       { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  score:          { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers:        { type: Map, of: Number },
  attemptDate:    { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);