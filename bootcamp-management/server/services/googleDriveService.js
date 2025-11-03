import { google } from 'googleapis';

/**
 * Initializes the Google Drive API client using service account credentials.  The
 * credentials are loaded from environment variables.  The `GOOGLE_DRIVE_PRIVATE_KEY`
 * may contain escaped newline characters (\n) which must be replaced with
 * actual newlines.
 */
function getDriveClient() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error('Google Drive credentials are not configured');
  }
  // Replace escaped newlines with actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n');
  const auth = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/drive']
  );
  return google.drive({ version: 'v3', auth });
}

/**
 * Uploads a file to Google Drive in the specified folder.  Returns the
 * webViewLink so the user can view or download the file.  You must have
 * configured a service account with access to the target folder.
 *
 * @param {string} name The filename to assign in Google Drive
 * @param {string} mimeType The MIME type of the file (e.g. 'application/pdf')
 * @param {Buffer|ReadableStream} data The file contents
 * @param {string} folderId The Drive folder ID to upload into
 */
export async function uploadToDrive(name, mimeType, data, folderId) {
  const drive = getDriveClient();
  const fileMetadata = {
    name,
    parents: [folderId],
  };
  const media = {
    mimeType,
    body: data,
  };
  const res = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, webViewLink',
  });
  return res.data.webViewLink;
}