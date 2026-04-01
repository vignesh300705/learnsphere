import mongoose, { Document, Schema } from 'mongoose';

export interface ILearningActivity extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  videoProgress: Map<string, number>;
  quizScores: number[];
  timeSpent: number;
  lastActive: Date;
  completionPercentage: number;
}

const LearningActivitySchema = new Schema<ILearningActivity>({
  studentId:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId:            { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  videoProgress:       { type: Map, of: Number, default: {} },
  quizScores:          [{ type: Number }],
  timeSpent:           { type: Number, default: 0 },
  lastActive:          { type: Date, default: Date.now },
  completionPercentage:{ type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<ILearningActivity>('LearningActivity', LearningActivitySchema);