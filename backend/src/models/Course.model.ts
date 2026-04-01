import mongoose, { Document, Schema } from 'mongoose';

interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  url: string;
  duration: number;
}

interface IMaterial {
  title: string;
  type: 'pdf' | 'doc' | 'link';
  url: string;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructorId: mongoose.Types.ObjectId;
  instructorName: string;
  thumbnail?: string;
  videos: IVideo[];
  materials: IMaterial[];
  enrolledStudents: mongoose.Types.ObjectId[];
  category: string;
  createdAt: Date;
}

const VideoSchema = new Schema({
  title:    { type: String, required: true },
  url:      { type: String, required: true },
  duration: { type: Number, required: true },
});

const MaterialSchema = new Schema({
  title: { type: String, required: true },
  type:  { type: String, enum: ['pdf', 'doc', 'link'] },
  url:   { type: String, required: true },
});

const CourseSchema = new Schema<ICourse>({
  title:          { type: String, required: true },
  description:    { type: String, required: true },
  instructorId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  instructorName: { type: String, required: true },
  thumbnail:      { type: String },
  videos:         [VideoSchema],
  materials:      [MaterialSchema],
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  category:       { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', CourseSchema);