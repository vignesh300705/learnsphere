import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  studentId: mongoose.Types.ObjectId;
  type: 'review' | 'practice' | 'video' | 'resource';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  relatedCourse?: mongoose.Types.ObjectId;
}

const RecommendationSchema = new Schema<IRecommendation>({
  studentId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type:          { type: String, enum: ['review', 'practice', 'video', 'resource'] },
  title:         { type: String, required: true },
  description:   { type: String, required: true },
  priority:      { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  relatedCourse: { type: Schema.Types.ObjectId, ref: 'Course' },
}, { timestamps: true });

export default mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);