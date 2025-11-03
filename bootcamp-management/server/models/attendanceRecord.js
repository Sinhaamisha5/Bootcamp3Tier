import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * AttendanceRecord stores a student's participation in an AttendanceSession.
 */
const attendanceRecordSchema = new Schema(
  {
    session: { type: Schema.Types.ObjectId, ref: 'AttendanceSession', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    markedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceRecordSchema);
export default AttendanceRecord;