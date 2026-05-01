import mongoose, { Document, Schema } from 'mongoose';

export interface IWeeklyCheckIn extends Document {
  userId: mongoose.Types.ObjectId;
  weekStartDate: Date;
  weekEndDate: Date;
  learnings: string[];
  tasks: string[];
  wins: string[];
  struggles: string[];
  learningScore: number;
  productivityScore: number;
  disciplineScore: number;
  overallScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const WeeklyCheckInSchema = new Schema<IWeeklyCheckIn>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    weekStartDate: {
      type: Date,
      required: true,
      index: true,
    },
    weekEndDate: {
      type: Date,
      required: true,
    },
    learnings: [{
      type: String,
      trim: true,
    }],
    tasks: [{
      type: String,
      trim: true,
    }],
    wins: [{
      type: String,
      trim: true,
    }],
    struggles: [{
      type: String,
      trim: true,
    }],
    learningScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    productivityScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    disciplineScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique weekly check-ins per user
WeeklyCheckInSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

// Calculate overall score before saving
WeeklyCheckInSchema.pre('save', function() {
  this.overallScore = Number(
    ((this.learningScore + this.productivityScore + this.disciplineScore) / 3).toFixed(1)
  );
});

export default mongoose.model<IWeeklyCheckIn>('WeeklyCheckIn', WeeklyCheckInSchema);
