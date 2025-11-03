import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Bootcamp schema represents a course offered by the company.  Each bootcamp
 * can have multiple batches.  The Google Drive folder ID is stored to allow
 * trainers to upload materials into a dedicated folder.  startDate and
 * endDate determine the status (upcoming, running, completed).
 */
const bootcampSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    driveFolderId: { type: String, required: true },
    batches: [{ type: Schema.Types.ObjectId, ref: 'Batch' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Bootcamp = mongoose.model('Bootcamp', bootcampSchema);
export default Bootcamp;