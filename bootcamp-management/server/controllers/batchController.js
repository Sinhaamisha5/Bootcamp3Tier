import Bootcamp from '../models/bootcamp.js';
import Batch from '../models/batch.js';
import Student from '../models/student.js';
import { validationResult } from 'express-validator';

/**
 * Creates a new batch within a bootcamp.  The bootcamp ID must be provided
 * and the coordinator and trainer must be valid user IDs.  The new batch is
 * added to the bootcamp's `batches` array.
 */
export async function createBatch(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { bootcampId, name, coordinatorId, trainerId, startTime, endTime } = req.body;
  try {
    const bootcamp = await Bootcamp.findById(bootcampId);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }
    const batch = new Batch({
      bootcamp: bootcampId,
      name,
      coordinator: coordinatorId,
      trainer: trainerId,
      startTime,
      endTime,
    });
    await batch.save();
    bootcamp.batches.push(batch._id);
    await bootcamp.save();
    res.status(201).json(batch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Uploads students to a batch.  Accepts an array of student objects with
 * firstName, lastName and email.  New students are created and added to the
 * batch's students array.  Existing students (based on email) are ignored.
 */
export async function addStudents(req, res) {
  const { batchId } = req.params;
  const { students } = req.body;
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: 'Students array is required' });
  }
  try {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    const created = [];
    for (const s of students) {
      const { firstName, lastName, email } = s;
      if (!firstName || !lastName || !email) continue;
      let student = await Student.findOne({ email });
      if (!student) {
        student = new Student({ firstName, lastName, email, batch: batch._id });
        await student.save();
      }
      // Add to batch if not already present
      if (!batch.students.includes(student._id)) {
        batch.students.push(student._id);
      }
      created.push(student);
    }
    await batch.save();
    res.json({ message: 'Students added', students: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Retrieves batch details along with students, coordinator and trainer information.
 */
export async function getBatch(req, res) {
  const { id } = req.params;
  try {
    const batch = await Batch.findById(id)
      .populate('coordinator', 'firstName lastName email')
      .populate('trainer', 'firstName lastName email')
      .populate('students');
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.json(batch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}