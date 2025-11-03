import AttendanceSession from '../models/attendanceSession.js';
import AttendanceRecord from '../models/attendanceRecord.js';
import Batch from '../models/batch.js';
import Student from '../models/student.js';
import crypto from 'crypto';

/**
 * Creates a new attendance session and returns a unique code that can be
 * encoded as a QR code.  Only trainers assigned to the batch should call
 * this endpoint (enforced by route-level authorization).  The session
 * optionally expires after a fixed period (e.g. 15 minutes).
 */
export async function generateSession(req, res) {
  const { bootcampId, batchId } = req.body;
  try {
    // Optionally verify that the trainer in req.user is assigned to this batch
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    // Generate a unique code (10 characters base64url)
    const code = crypto.randomBytes(6).toString('base64url');
    // Expiration: 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const session = new AttendanceSession({ bootcamp: bootcampId, batch: batchId, code, expiresAt });
    await session.save();
    res.status(201).json({ code, expiresAt, sessionId: session._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Marks attendance for a student.  Expects the attendance code in the
 * request body.  The authenticated user must have role 'student'.
 */
export async function markAttendance(req, res) {
  const { code } = req.body;
  try {
    const session = await AttendanceSession.findOne({ code });
    if (!session) {
      return res.status(404).json({ message: 'Invalid attendance code' });
    }
    if (session.expiresAt && session.expiresAt < new Date()) {
      return res.status(410).json({ message: 'Attendance session has expired' });
    }
    // Ensure the user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can mark attendance' });
    }
    // Find Student record linked to the user's email; if not found, create
    let student = await Student.findOne({ email: req.user.email });
    if (!student) {
      // Auto-create student entry referencing session.batch
      student = new Student({ firstName: req.user.firstName, lastName: req.user.lastName, email: req.user.email, batch: session.batch });
      await student.save();
    }
    // Check if already marked
    const existing = await AttendanceRecord.findOne({ session: session._id, student: student._id });
    if (existing) {
      return res.status(409).json({ message: 'Attendance already marked' });
    }
    const record = new AttendanceRecord({ session: session._id, student: student._id });
    await record.save();
    res.status(201).json({ message: 'Attendance marked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}