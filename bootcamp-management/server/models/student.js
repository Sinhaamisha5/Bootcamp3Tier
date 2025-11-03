import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Student schema stores individual students enrolled in a batch.  Email must
 * be unique within the system.
 */
const studentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;