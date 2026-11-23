import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';

// Create the web server and choose its port from the environment or a local default.
const app = express();
const port = Number(process.env.PORT) || 3000;

// Allow the website to call this server and read JSON request bodies.
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

// Describe the information an enquiry must contain and how its fields are cleaned.
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

// Create the database model used to save and validate enquiries.
const Enquiry = mongoose.model('Enquiry', enquirySchema);

// Hash a password with its stored salt so a login can be checked safely.
function checkAdminPassword(password, storedHash) {
  const [algorithm, salt, expectedHex] = storedHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !expectedHex || !/^[0-9a-f]+$/i.test(expectedHex)) return false;

  const expected = Buffer.from(expectedHex, 'hex');
  const actual = scryptSync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Create a signed token that expires one hour after it is issued.
function createAdminToken(username) {
  const secret = process.env.JWT_SECRET;
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: username, iat: issuedAt, exp: issuedAt + 60 * 60 })).toString('base64url');
  const content = `${header}.${payload}`;
  const signature = createHmac('sha256', secret).update(content).digest('base64url');
  return `${content}.${signature}`;
}

// Check the token's signature and expiry before allowing access to admin data.
function requireAdminToken(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(503).json({ error: 'Admin authentication is not configured.' });

  const authorization = req.headers.authorization ?? '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';

  try {
    const [headerPart, payloadPart, signaturePart] = token.split('.');
    if (!headerPart || !payloadPart || !signaturePart) throw new Error('Invalid token');

    const header = JSON.parse(Buffer.from(headerPart, 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
    const expectedSignature = createHmac('sha256', secret).update(`${headerPart}.${payloadPart}`).digest();
    const actualSignature = Buffer.from(signaturePart, 'base64url');
    if (header.alg !== 'HS256' || actualSignature.length !== expectedSignature.length || !timingSafeEqual(actualSignature, expectedSignature)) {
      throw new Error('Invalid token');
    }
    if (typeof payload.sub !== 'string' || typeof payload.exp !== 'number' || payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new Error('Expired or invalid token');
    }

    req.adminUsername = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ error: 'A valid admin login is required.' });
  }
}

// Report whether the server is running and connected to its database.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Check the single admin account from .env and return a one-hour login token.
app.post('/api/admin/login', (req, res) => {
  const username = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!username || !passwordHash || !process.env.JWT_SECRET) {
    return res.status(503).json({ error: 'Admin authentication is not configured.' });
  }

  const submittedUsername = typeof req.body?.username === 'string' ? req.body.username : '';
  const submittedPassword = typeof req.body?.password === 'string' ? req.body.password : '';
  if (submittedUsername !== username || !checkAdminPassword(submittedPassword, passwordHash)) {
    return res.status(401).json({ error: 'Username or password is incorrect.' });
  }

  return res.json({ token: createAdminToken(username), expiresIn: 3600 });
});

// Return saved enquiries after the admin's bearer token has been checked.
app.get('/api/admin/enquiries', requireAdminToken, async (_req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
    return res.json({ enquiries });
  } catch (error) {
    console.error('Failed to load enquiries:', error.message);
    return res.status(500).json({ error: 'Unable to load enquiries right now.' });
  }
});

// Return one saved enquiry by its database ID after checking the admin token.
app.get('/api/admin/enquiries/:id', requireAdminToken, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Enquiry ID is invalid.' });
  }

  try {
    const enquiry = await Enquiry.findById(req.params.id).lean();
    if (!enquiry) return res.status(404).json({ error: 'Enquiry was not found.' });
    return res.json({ enquiry });
  } catch (error) {
    console.error('Failed to load enquiry:', error.message);
    return res.status(500).json({ error: 'Unable to load this enquiry right now.' });
  }
});

// Check a new enquiry, save it, and return a useful result to the website.
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

// Turn malformed JSON and other request errors into clear responses.
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'Request body must be valid JSON.' });
  }
  console.error('Request error:', error.message);
  return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// Connect to the database before starting to accept web requests.
async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be set in the environment or backend/.env.');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`Backend listening on port ${port}`));
}

// Show a startup error and stop if the server cannot start successfully.
start().catch((error) => {
  console.error('Failed to start backend:', error.message);
  process.exit(1);
});
