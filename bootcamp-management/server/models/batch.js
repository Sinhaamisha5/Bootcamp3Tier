import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Batch schema belongs to a bootcamp and holds information about the
 * coordinator, trainer and enrolled students.  A batch also stores start
 * and end times for classes (HH:MM strings) and optionally days of week.
 */
const batchSchema = new Schema(
  {
    bootcamp: { type: Schema.Types.ObjectId, ref: 'Bootcamp', required: true },
    name: { type: String, required: true },
    coordinator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: String },
    endTime: { type: String },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Batch = mongoose.model('Batch', batchSchema);
export default Batch;