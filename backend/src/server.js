import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 40, default: '' },
  projectType: { type: String, required: true, trim: true, maxlength: 80 },
  location: { type: String, trim: true, maxlength: 160, default: '' },
  budget: { type: String, trim: true, maxlength: 80, default: '' },
  timeline: { type: String, trim: true, maxlength: 20, default: '' },
  details: { type: String, required: true, trim: true, minlength: 20, maxlength: 5000 },
}, { timestamps: true, versionKey: false });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.post('/api/enquiries', async (req, res) => {
  const { name, email, phone, 'project-type': projectType, location, budget, timeline, details } = req.body ?? {};
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const cleanDetails = typeof details === 'string' ? details.trim() : '';

  if (cleanName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || !projectType || cleanDetails.length < 20) {
    return res.status(400).json({ error: 'Please provide a valid name, email, project type, and project description.' });
  }

  try {
    const enquiry = await Enquiry.create({ name: cleanName, email: cleanEmail, phone, projectType, location, budget, timeline, details: cleanDetails });
    return res.status(201).json({ message: 'Enquiry received.', enquiry: { id: enquiry.id, createdAt: enquiry.createdAt } });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: 'Some enquiry fields are invalid.' });
    }
    console.error('Failed to save enquiry:', error.message);
    return res.status(500).json({ error: 'Unable to save your enquiry right now.' });
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'Request body must be valid JSON.' });
  }
  console.error('Request error:', error.message);
  return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be set in the environment or backend/.env.');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`Backend listening on port ${port}`));
}

start().catch((error) => {
  console.error('Failed to start backend:', error.message);
  process.exit(1);
});
