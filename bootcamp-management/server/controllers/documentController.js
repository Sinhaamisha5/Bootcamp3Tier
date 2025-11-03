import Bootcamp from '../models/bootcamp.js';
import Document from '../models/document.js';
import { uploadToDrive } from '../services/googleDriveService.js';

/**
 * Handles uploading a document to Google Drive.  Requires a multipart/form-data
 * request with a file field named `file`.  The bootcampId must be provided
 * in the URL.  The Google Drive folder is taken from the bootcamp's
 * `driveFolderId`.  Returns the created Document record with file URL.
 */
export async function uploadDocument(req, res) {
  const { bootcampId } = req.params;
  // Multer stores the uploaded file buffer on req.file
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'File is required' });
  }
  try {
    const bootcamp = await Bootcamp.findById(bootcampId);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }
    // Upload to Google Drive
    const folderId = bootcamp.driveFolderId;
    const link = await uploadToDrive(file.originalname, file.mimetype, file.buffer, folderId);
    // Save Document record
    const doc = new Document({
      bootcamp: bootcampId,
      trainer: req.user._id,
      fileName: file.originalname,
      fileUrl: link,
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}