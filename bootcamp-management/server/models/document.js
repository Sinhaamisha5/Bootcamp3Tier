import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Document schema stores metadata about files uploaded by trainers.  The
 * actual file is stored in Google Drive; the `fileUrl` field contains the
 * shareable link.  Additional metadata such as MIME type or description can
 * be added later.
 */
const documentSchema = new Schema(
  {
    bootcamp: { type: Schema.Types.ObjectId, ref: 'Bootcamp', required: true },
    trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;