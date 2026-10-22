/**
 * Technovision 2026 — MongoDB Atlas Database Connection & Model Module
 * 
 * MongoDB Atlas integration via Mongoose.
 * Implements robust connection handling, connection reuse, schemas,
 * compound unique constraints, and safe credential handling.
 */

const mongoose = require('mongoose');

// Cache connection promise for reuse across requests
let isConnecting = false;

/**
 * Masks sensitive credentials in connection strings for safe logging
 */
const maskMongoUri = (uri) => {
  if (!uri) return 'NOT_CONFIGURED';
  try {
    return uri.replace(/(mongodb(\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/, '$1******$4');
  } catch (e) {
    return 'CONFIGURED (Masked)';
  }
};

/**
 * Get MongoDB Atlas URI from environment
 */
const getMongoUri = () => {
  return (process.env.MONGODB_URI || '').trim();
};

/**
 * Check if MongoDB Atlas URI is configured
 */
const isMongoConfigured = () => {
  const uri = getMongoUri();
  return Boolean(uri && !uri.includes('<username>') && !uri.includes('<password>'));
};

/**
 * Connect to MongoDB Atlas with connection pooling and error handling
 */
const connectDB = async () => {
  const uri = getMongoUri();

  if (!uri) {
    throw new Error('MONGODB_URI_MISSING: MONGODB_URI environment variable is not defined.');
  }

  if (uri.includes('<username>') || uri.includes('<password>')) {
    throw new Error('MONGODB_URI_PLACEHOLDER: Please replace <username> and <password> in MONGODB_URI with your actual Atlas credentials.');
  }

  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If already connecting, await current connection
  if (isConnecting) {
    while (mongoose.connection.readyState === 2) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return mongoose.connection;
  }

  try {
    isConnecting = true;
    console.log(`[MongoDB Atlas] Connecting to cluster: ${maskMongoUri(uri)}`);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 7000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      autoIndex: true, // Build compound unique indexes
    });

    console.log('[MongoDB Atlas] ✅ Connected successfully.');
    return mongoose.connection;
  } catch (err) {
    console.error(`[MongoDB Atlas] ❌ Connection failed: ${err.message}`);
    throw err;
  } finally {
    isConnecting = false;
  }
};

/**
 * Check connection health
 */
const getConnectionStatus = async () => {
  const uri = getMongoUri();
  const configured = isMongoConfigured();

  if (!configured) {
    return {
      connected: false,
      configured: false,
      state: 'NOT_CONFIGURED',
      message: 'MONGODB_URI is not configured in .env or still contains placeholders.',
    };
  }

  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const currentState = states[mongoose.connection.readyState] || 'unknown';

  if (mongoose.connection.readyState === 1) {
    return {
      connected: true,
      configured: true,
      state: currentState,
      cluster: maskMongoUri(uri),
      database: mongoose.connection.name,
      message: 'MongoDB Atlas is connected and healthy.',
    };
  }

  try {
    await connectDB();
    return {
      connected: true,
      configured: true,
      state: 'connected',
      cluster: maskMongoUri(uri),
      database: mongoose.connection.name,
      message: 'MongoDB Atlas connection established.',
    };
  } catch (err) {
    return {
      connected: false,
      configured: true,
      state: 'error',
      error: err.message,
      cluster: maskMongoUri(uri),
      message: `Failed to connect to MongoDB Atlas: ${err.message}`,
    };
  }
};

// ── Application ID Codes ───────────────────────────────────────────────
const COMP_CODES = {
  'model-presentation': 'MP',
  'robo-obstacle-challenge': 'ROC',
  'robo-rumble': 'RR',
};

const COMP_NAMES = {
  'model-presentation': 'Model Presentation',
  'robo-obstacle-challenge': 'Bot Racing',
  'robo-rumble': 'Robo Rumble',
};

/**
 * Generate unique Application ID: TV26-<CODE>-<5_RANDOM_ALPHANUM>
 */
const generateApplicationId = (competitionId) => {
  const code = COMP_CODES[competitionId] || 'GEN';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded easily confused 0, O, 1, I
  let random = '';
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TV26-${code}-${random}`;
};

// ── Team Member Subschema ─────────────────────────────────────────────
const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  enrollmentNo: { type: String, trim: true, uppercase: true, default: '' },
  role: { type: String, trim: true, default: 'Member' },
}, { _id: false });

// ── Status History Subschema ──────────────────────────────────────────
const StatusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
}, { _id: false });

// ── Registration Schema ───────────────────────────────────────────────
const RegistrationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    index: true,
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  enrollmentNo: {
    type: String,
    trim: true,
    uppercase: true,
    default: '',
    index: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    index: true,
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
  },
  college: {
    type: String,
    trim: true,
    default: '',
  },
  branch: {
    type: String,
    trim: true,
    default: '',
  },
  academicYear: {
    type: String,
    default: '1st Year',
  },
  competitionId: {
    type: String,
    required: [true, 'Competition ID is required'],
    enum: ['model-presentation', 'robo-obstacle-challenge', 'robo-rumble'],
    index: true,
  },
  competitionName: {
    type: String,
    default: '',
  },
  participationType: {
    type: String,
    enum: ['individual', 'team'],
    default: 'individual',
  },
  teamName: {
    type: String,
    trim: true,
    default: '',
  },
  teamMembers: [TeamMemberSchema],
  projectName: {
    type: String,
    required: [true, 'Project/Robot name is required'],
    trim: true,
  },
  projectDescription: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Approved', 'Waitlisted', 'Rejected'],
    default: 'Submitted',
    index: true,
  },
  statusHistory: [StatusHistorySchema],
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
  collection: 'technovision_registrations',
});

// Compound unique index: Prevent duplicate registration per user per competition
RegistrationSchema.index({ email: 1, competitionId: 1 }, { unique: true });

// Pre-save hook: set competitionName and initial statusHistory
RegistrationSchema.pre('save', function (next) {
  if (!this.competitionName) {
    this.competitionName = COMP_NAMES[this.competitionId] || this.competitionId;
  }
  if (!this.statusHistory || this.statusHistory.length === 0) {
    this.statusHistory = [{
      status: this.status || 'Submitted',
      timestamp: new Date(),
      note: 'Application received and submitted successfully',
    }];
  }
  if (typeof next === 'function') {
    next();
  }
});

// Prevent model re-compilation in development
const Registration = mongoose.models.TechnovisionRegistration || mongoose.model('TechnovisionRegistration', RegistrationSchema);

module.exports = {
  connectDB,
  getConnectionStatus,
  isMongoConfigured,
  getMongoUri,
  maskMongoUri,
  generateApplicationId,
  COMP_CODES,
  COMP_NAMES,
  Registration,
};
