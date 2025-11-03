import Bootcamp from '../models/bootcamp.js';
import { validationResult } from 'express-validator';

/**
 * Creates a new bootcamp/course.  Admins can specify a Google Drive folder ID
 * or leave it undefined to fall back to the default folder configured in
 * `DEFAULT_DRIVE_FOLDER_ID`.
 */
export async function createBootcamp(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, description, startDate, endDate, driveFolderId } = req.body;
  try {
    const bootcamp = new Bootcamp({
      name,
      description,
      startDate,
      endDate,
      driveFolderId: driveFolderId || process.env.DEFAULT_DRIVE_FOLDER_ID,
      createdBy: req.user._id,
    });
    await bootcamp.save();
    res.status(201).json(bootcamp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Returns all bootcamps with their batches populated.
 */
export async function listBootcamps(req, res) {
  try {
    const bootcamps = await Bootcamp.find().populate('batches');
    res.json(bootcamps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Retrieves a single bootcamp by ID with its batches populated.
 */
export async function getBootcamp(req, res) {
  const { id } = req.params;
  try {
    const bootcamp = await Bootcamp.findById(id).populate({ path: 'batches', populate: { path: 'trainer coordinator students' } });
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }
    res.json(bootcamp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}