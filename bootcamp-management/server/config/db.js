import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database specified by DB_URI in the environment.  If the
 * environment variable is missing the returned promise rejects.
 */
export default async function connectDB() {
  const uri = process.env.DB_URI;
  if (!uri) {
    throw new Error('DB_URI is not defined in environment variables');
  }
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB at ${uri}`);
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}