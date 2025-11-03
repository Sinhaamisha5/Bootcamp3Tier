import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * AttendanceSession represents a single attendance event (e.g. a class on a
 * particular date).  A QR code is generated using the `code` field.  The
 * session can be linked to a bootcamp and batch.  The optional `expiresAt`
 * field allows sessions to expire after a period.
 */
const attendanceSessionSchema = new Schema(
  {
    bootcamp: { type: Schema.Types.ObjectId, ref: 'Bootcamp', required: true },
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    code: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

const AttendanceSession = mongoose.model('AttendanceSession', attendanceSessionSchema);
export default AttendanceSession;