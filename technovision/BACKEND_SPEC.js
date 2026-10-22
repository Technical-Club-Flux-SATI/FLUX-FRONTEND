/**
 * ═══════════════════════════════════════════════════════════════════════
 *  TECHNOVISION 2026 — BACKEND SPECIFICATION
 *  Drop this into your Express.js backend alongside existing routes
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  This file contains:
 *    1. Mongoose model schemas
 *    2. Express route handlers
 *    3. Application ID generation
 *    4. Setup instructions
 *
 *  Your existing backend already has:
 *    - Express + Mongoose + JWT auth
 *    - Pattern: FluxWave / Recruitment routes (key-gated admin)
 *    - API prefix: /api
 *
 *  FILES TO CREATE IN YOUR BACKEND:
 *    models/TechnovisionRegistration.js
 *    routes/technovisionRoutes.js
 *    (add to server.js: app.use('/api/technovision', technovisionRoutes))
 *
 *  ENV VARIABLE NEEDED:
 *    TECHNOVISION_ADMIN_KEY=<your-secret-passkey>
 * ═══════════════════════════════════════════════════════════════════════
 */


// ═══════════════════════════════════════════════════════════════════════
// 1. MODEL — models/TechnovisionRegistration.js
// ═══════════════════════════════════════════════════════════════════════

/*
const mongoose = require('mongoose');

const STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'WAITLISTED', 'REJECTED', 'WITHDRAWN'];
const COMPETITIONS = ['model-presentation', 'robo-obstacle-challenge', 'robo-rumble'];
const COMP_CODES = {
  'model-presentation': 'MP',
  'robo-obstacle-challenge': 'ROC',
  'robo-rumble': 'RR',
};

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true, default: '' },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, enum: STATUSES, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
}, { _id: false });

const technovisionSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  fullName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Invalid Indian mobile number'],
  },
  college: { type: String, required: true, trim: true },
  branch: { type: String, required: true, trim: true },
  academicYear: { type: String, required: true },
  competitionId: {
    type: String,
    required: true,
    enum: COMPETITIONS,
  },
  competitionName: { type: String, default: '' },
  participationType: {
    type: String,
    required: true,
    enum: ['individual', 'team'],
    default: 'individual',
  },
  teamName: { type: String, trim: true, default: '' },
  teamMembers: [teamMemberSchema],
  projectName: { type: String, required: true, trim: true },
  projectDescription: { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: STATUSES,
    default: 'SUBMITTED',
  },
  statusHistory: [statusHistorySchema],
}, {
  timestamps: true, // adds createdAt, updatedAt
});

// Prevent duplicate registrations (same email + competition)
technovisionSchema.index({ email: 1, competitionId: 1 }, { unique: true });

module.exports = mongoose.model('TechnovisionRegistration', technovisionSchema);
module.exports.COMP_CODES = COMP_CODES;
module.exports.STATUSES = STATUSES;
*/


// ═══════════════════════════════════════════════════════════════════════
// 2. APPLICATION ID GENERATOR
// ═══════════════════════════════════════════════════════════════════════

/*
const crypto = require('crypto');

// Generates: TV26-MP-A7K92  (year-compCode-random5)
function generateApplicationId(competitionSlug) {
  const COMP_CODES = {
    'model-presentation': 'MP',
    'robo-obstacle-challenge': 'ROC',
    'robo-rumble': 'RR',
  };

  const year = '26'; // Update for each edition
  const code = COMP_CODES[competitionSlug] || 'XX';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I/O/0/1 to avoid confusion
  let random = '';
  const bytes = crypto.randomBytes(5);
  for (let i = 0; i < 5; i++) {
    random += chars[bytes[i] % chars.length];
  }
  return `TV${year}-${code}-${random}`;
}
*/


// ═══════════════════════════════════════════════════════════════════════
// 3. ROUTES — routes/technovisionRoutes.js
// ═══════════════════════════════════════════════════════════════════════

/*
const express = require('express');
const router = express.Router();
const TechnovisionRegistration = require('../models/TechnovisionRegistration');
const { COMP_CODES } = TechnovisionRegistration;

// Competition name resolver
const COMP_NAMES = {
  'model-presentation': 'Model Presentation',
  'robo-obstacle-challenge': 'Bot Racing',
  'robo-rumble': 'Robo Rumble',
};

// ── Admin key middleware ────────────────────────────────────────────
const requireAdminKey = (req, res, next) => {
  const key = req.headers['x-technovision-key'];
  if (!key || key !== process.env.TECHNOVISION_ADMIN_KEY) {
    return res.status(403).json({ message: 'Invalid or missing admin key' });
  }
  next();
};


// ═════ PUBLIC ROUTES ═════

// POST /api/technovision/register — Submit registration
router.post('/register', async (req, res) => {
  try {
    const {
      fullName, email, mobile, college, branch, academicYear,
      competitionId, participationType, teamName, teamMembers,
      projectName, projectDescription,
    } = req.body;

    // Basic validation
    const errors = [];
    if (!fullName || fullName.trim().length < 2) errors.push('Full name is required');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required');
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile.replace(/\s/g, ''))) errors.push('Valid 10-digit mobile number is required');
    if (!college) errors.push('College name is required');
    if (!branch) errors.push('Branch is required');
    if (!academicYear) errors.push('Academic year is required');
    if (!competitionId || !COMP_NAMES[competitionId]) errors.push('Valid competition is required');
    if (!projectName) errors.push('Project name is required');

    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors });
    }

    // Check for duplicate
    const existing = await TechnovisionRegistration.findOne({
      email: email.trim().toLowerCase(),
      competitionId,
    });
    if (existing) {
      return res.status(409).json({
        message: `You have already registered for ${COMP_NAMES[competitionId]} with this email.`,
        applicationId: existing.applicationId,
      });
    }

    // Generate unique Application ID
    let applicationId;
    let attempts = 0;
    do {
      applicationId = generateApplicationId(competitionId);
      const exists = await TechnovisionRegistration.findOne({ applicationId });
      if (!exists) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      return res.status(500).json({ message: 'Failed to generate unique Application ID. Please try again.' });
    }

    const registration = new TechnovisionRegistration({
      applicationId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      college: college.trim(),
      branch: branch.trim(),
      academicYear,
      competitionId,
      competitionName: COMP_NAMES[competitionId],
      participationType: participationType || 'individual',
      teamName: teamName?.trim() || '',
      teamMembers: Array.isArray(teamMembers) ? teamMembers.filter(m => m.name?.trim()) : [],
      projectName: projectName.trim(),
      projectDescription: projectDescription?.trim() || '',
      status: 'SUBMITTED',
      statusHistory: [{ status: 'SUBMITTED', timestamp: new Date() }],
    });

    await registration.save();

    res.status(201).json({
      message: 'Registration successful',
      applicationId: registration.applicationId,
      competitionName: registration.competitionName,
    });

  } catch (err) {
    console.error('Technovision registration error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate registration detected.' });
    }
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});


// GET /api/technovision/track/:appId — Track application by ID
router.get('/track/:appId', async (req, res) => {
  try {
    const reg = await TechnovisionRegistration.findOne({
      applicationId: req.params.appId.toUpperCase(),
    }).select('-__v -email -mobile -college -branch -academicYear -teamMembers');
    // ^ exclude sensitive fields from public tracking

    if (!reg) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      applicationId: reg.applicationId,
      competitionName: reg.competitionName || reg.competitionId,
      applicantName: reg.fullName,
      teamName: reg.teamName,
      projectName: reg.projectName,
      status: reg.status,
      submittedAt: reg.createdAt,
      updatedAt: reg.updatedAt,
      statusHistory: reg.statusHistory,
    });

  } catch (err) {
    console.error('Track error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/technovision/competitions — List competitions (optional)
router.get('/competitions', (req, res) => {
  res.json(Object.entries(COMP_NAMES).map(([id, name]) => ({ id, name })));
});


// ═════ ADMIN ROUTES (all require x-technovision-key header) ═════

// POST /api/technovision/admin/verify-key
router.post('/admin/verify-key', requireAdminKey, (req, res) => {
  res.json({ message: 'Key verified', valid: true });
});

// GET /api/technovision/admin/registrations
router.get('/admin/registrations', requireAdminKey, async (req, res) => {
  try {
    const registrations = await TechnovisionRegistration.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json({ registrations });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/technovision/admin/stats
router.get('/admin/stats', requireAdminKey, async (req, res) => {
  try {
    const total = await TechnovisionRegistration.countDocuments();
    const pending = await TechnovisionRegistration.countDocuments({ status: 'SUBMITTED' });
    const underReview = await TechnovisionRegistration.countDocuments({ status: 'UNDER_REVIEW' });
    const approved = await TechnovisionRegistration.countDocuments({ status: 'APPROVED' });
    const rejected = await TechnovisionRegistration.countDocuments({ status: 'REJECTED' });
    const waitlisted = await TechnovisionRegistration.countDocuments({ status: 'WAITLISTED' });

    const byCompetition = await TechnovisionRegistration.aggregate([
      { $group: { _id: '$competitionId', count: { $sum: 1 } } },
    ]);

    res.json({
      total, pending, underReview, approved, rejected, waitlisted,
      byCompetition: byCompetition.reduce((acc, c) => {
        acc[c._id] = c.count;
        return acc;
      }, {}),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/technovision/admin/:id/status
router.patch('/admin/:id/status', requireAdminKey, async (req, res) => {
  try {
    const { status, note } = req.body;
    const VALID = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'WAITLISTED', 'REJECTED', 'WITHDRAWN'];
    if (!VALID.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const reg = await TechnovisionRegistration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    reg.status = status;
    reg.statusHistory.push({ status, timestamp: new Date(), note: note || '' });
    await reg.save();

    res.json({ message: `Status updated to ${status}`, registration: reg });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/technovision/admin/:id
router.delete('/admin/:id', requireAdminKey, async (req, res) => {
  try {
    const reg = await TechnovisionRegistration.findByIdAndDelete(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    res.json({ message: 'Registration deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/technovision/admin/export — CSV export
router.get('/admin/export', requireAdminKey, async (req, res) => {
  try {
    const regs = await TechnovisionRegistration.find().sort({ createdAt: -1 }).lean();

    const headers = [
      'Application ID', 'Full Name', 'Email', 'Mobile', 'College', 'Branch',
      'Year', 'Competition', 'Type', 'Team Name', 'Team Members',
      'Project Name', 'Description', 'Status', 'Submitted At',
    ];

    const rows = regs.map(r => [
      r.applicationId, r.fullName, r.email, r.mobile, r.college, r.branch,
      r.academicYear, r.competitionName || r.competitionId, r.participationType,
      r.teamName || '', (r.teamMembers || []).map(m => m.name).join('; '),
      r.projectName, (r.projectDescription || '').replace(/"/g, '""'),
      r.status, r.createdAt ? new Date(r.createdAt).toISOString() : '',
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=technovision_registrations.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Export failed' });
  }
});

module.exports = router;
*/


// ═══════════════════════════════════════════════════════════════════════
// 4. SERVER.JS INTEGRATION
// ═══════════════════════════════════════════════════════════════════════

/*
  In your server.js (or app.js), add:

  const technovisionRoutes = require('./routes/technovisionRoutes');
  app.use('/api/technovision', technovisionRoutes);

  And in your .env:

  TECHNOVISION_ADMIN_KEY=your-secret-admin-passkey-here
*/
