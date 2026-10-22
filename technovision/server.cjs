const http = require('http');
const fs = require('fs');
const path = require('path');
const dbModule = require('./db.cjs');
const { Registration, connectDB, getConnectionStatus, isMongoConfigured, generateApplicationId, COMP_NAMES, maskMongoUri } = dbModule;

// Automatically load .env and .env.local from project root
const loadEnv = () => {
  const envFiles = [
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../.env.local'),
  ];
  for (const envPath of envFiles) {
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
          process.env[key] = val;
        }
      }
    }
  }
};
loadEnv();

const PORT = process.env.PORT || 5000;
const ADMIN_KEY = process.env.TECHNOVISION_ADMIN_KEY || 'flux2026';
const DB_FILE = path.join(__dirname, 'registrations.json');

// Local file fallback ONLY if explicitly enabled for development offline mode
const ALLOW_LOCAL_FALLBACK = process.env.ALLOW_LOCAL_FALLBACK === 'true';

const readLocalDB = () => {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) || [];
  } catch (err) {
    return [];
  }
};

const writeLocalDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {}
};

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-technovision-key, x-recruitment-key, x-fluxwave-key',
  });
  res.end(JSON.stringify(data));
};

const sendError = (res, statusCode, message, errors = []) => {
  sendJson(res, statusCode, { message, errors });
};

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
};

// Attempt initial MongoDB connection if configured
if (isMongoConfigured()) {
  connectDB().catch(err => {
    console.warn(`[MongoDB Atlas] Initial connection pending: ${err.message}`);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-technovision-key, x-recruitment-key, x-fluxwave-key',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  try {
    const mongoConfigured = isMongoConfigured();

    // 0. DATABASE CONNECTION STATUS: GET /api/technovision/db-status
    if ((pathname === '/api/technovision/db-status' || pathname === '/api/technovision/mongo-status') && req.method === 'GET') {
      const status = await getConnectionStatus();
      return sendJson(res, status.connected ? 200 : 503, {
        provider: 'MongoDB Atlas',
        ...status,
      });
    }

    // 0B. COMPETITIONS: GET /api/technovision/competitions
    if (pathname === '/api/technovision/competitions' && req.method === 'GET') {
      return sendJson(res, 200, {
        event: {
          name: 'Technovision 2026',
          tagline: 'Innovate. Build. Compete.',
          dates: '2 – 3 November 2026',
          venue: 'SATI College, Vidisha',
        },
        competitions: [
          { id: 'model-presentation', title: 'Model Presentation', category: 'Hardware Innovation', teamSize: '1 – 4 Members' },
          { id: 'robo-obstacle-challenge', title: 'Bot Racing', category: 'Autonomous & RC Robotics', teamSize: 'Solo or Dual' },
          { id: 'robo-rumble', title: 'Robo Rumble', category: 'Combat Robotics', teamSize: '1 – 4 Members' },
        ],
      });
    }

    // 1. REGISTER: POST /api/technovision/register
    if (pathname === '/api/technovision/register' && req.method === 'POST') {
      const body = await parseBody(req);
      const {
        fullName, enrollmentNo, email, mobile, college, branch, academicYear,
        competitionId, participationType, teamName, teamMembers,
        projectName, projectDescription,
      } = body;

      // Strict Validation
      if (!fullName || !fullName.trim()) return sendError(res, 400, 'Full name is required');
      if (!enrollmentNo || !enrollmentNo.trim()) return sendError(res, 400, 'Enrollment number is required');
      if (!email || !email.trim()) return sendError(res, 400, 'Valid email is required');
      if (!mobile || !mobile.trim()) return sendError(res, 400, 'Mobile number is required');
      if (!competitionId) return sendError(res, 400, 'Competition selection is required');
      if (!projectName || !projectName.trim()) return sendError(res, 400, 'Project / Robot / Model name is required');

      const normEmail = email.trim().toLowerCase();

      // 1A. Save to MongoDB Atlas if configured
      if (mongoConfigured) {
        try {
          await connectDB();

          // Check for existing duplicate submission for this competition
          const existing = await Registration.findOne({
            email: normEmail,
            competitionId,
          });

          if (existing) {
            return sendError(
              res,
              409,
              `You have already registered for ${existing.competitionName || competitionId} with email: ${email}`,
              [existing.applicationId]
            );
          }

          // Generate unique Application ID
          let applicationId = generateApplicationId(competitionId);
          while (await Registration.exists({ applicationId })) {
            applicationId = generateApplicationId(competitionId);
          }

          const compName = COMP_NAMES[competitionId] || competitionId;

          const newDoc = await Registration.create({
            applicationId,
            fullName: fullName.trim(),
            enrollmentNo: enrollmentNo.trim().toUpperCase(),
            email: normEmail,
            mobile: mobile.trim(),
            college: college ? college.trim() : '',
            branch: branch ? branch.trim() : '',
            academicYear: academicYear || '1st Year',
            competitionId,
            competitionName: compName,
            participationType: participationType || 'individual',
            teamName: teamName ? teamName.trim() : '',
            teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
            projectName: projectName.trim(),
            projectDescription: projectDescription ? projectDescription.trim() : '',
            status: 'Submitted',
            statusHistory: [{
              status: 'Submitted',
              timestamp: new Date(),
              note: 'Application received and submitted successfully',
            }],
          });

          console.log(`[MongoDB Atlas] ✅ Registered: ${newDoc.applicationId} (${fullName}) for ${compName}`);

          return sendJson(res, 201, {
            message: 'Registration successfully saved to MongoDB Atlas',
            applicationId: newDoc.applicationId,
            competitionName: newDoc.competitionName,
          });
        } catch (dbErr) {
          console.error('[MongoDB Error]', dbErr);

          // Handle duplicate key error (E11000)
          if (dbErr.code === 11000) {
            return sendError(res, 409, `A registration already exists with this email for the selected competition.`);
          }

          return sendError(res, 500, `Database error: ${dbErr.message || 'Failed to save registration in MongoDB Atlas'}`);
        }
      }

      // 1B. Fallback if MongoDB credentials are not configured yet
      if (!ALLOW_LOCAL_FALLBACK) {
        return sendError(
          res,
          503,
          'Database not configured: MONGODB_URI is missing or contains placeholders in .env. Please configure your MongoDB Atlas connection string in .env.'
        );
      }

      // Local Fallback (only if ALLOW_LOCAL_FALLBACK=true for offline testing)
      const db = readLocalDB();
      const existing = db.find(r => r.email.toLowerCase() === normEmail && r.competitionId === competitionId);
      if (existing) {
        return sendError(res, 409, `You have already registered for this competition with email: ${email}`, [existing.applicationId]);
      }

      let applicationId = generateApplicationId(competitionId);
      while (db.some(r => r.applicationId === applicationId)) {
        applicationId = generateApplicationId(competitionId);
      }

      const now = new Date().toISOString();
      const newRecord = {
        _id: 'reg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        applicationId,
        fullName: fullName.trim(),
        enrollmentNo: enrollmentNo.trim().toUpperCase(),
        email: normEmail,
        mobile: mobile.trim(),
        college: college ? college.trim() : '',
        branch: branch ? branch.trim() : '',
        academicYear: academicYear || '1st Year',
        competitionId,
        competitionName: COMP_NAMES[competitionId] || competitionId,
        participationType: participationType || 'individual',
        teamName: teamName ? teamName.trim() : '',
        teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
        projectName: projectName.trim(),
        projectDescription: projectDescription ? projectDescription.trim() : '',
        status: 'Submitted',
        statusHistory: [{ status: 'Submitted', timestamp: now, note: 'Application received' }],
        createdAt: now,
        updatedAt: now,
      };

      db.push(newRecord);
      writeLocalDB(db);

      return sendJson(res, 201, {
        message: 'Registration successful (Local Fallback Mode)',
        applicationId: newRecord.applicationId,
        competitionName: newRecord.competitionName,
      });
    }

    // 2. TRACK: GET /api/technovision/track/:appId
    if (pathname.startsWith('/api/technovision/track/') && req.method === 'GET') {
      const appId = decodeURIComponent(pathname.replace('/api/technovision/track/', '')).trim().toUpperCase();

      if (mongoConfigured) {
        try {
          await connectDB();
          const reg = await Registration.findOne({ applicationId: appId }).lean();
          if (!reg) return sendError(res, 404, 'Application not found with ID: ' + appId);

          return sendJson(res, 200, {
            applicationId: reg.applicationId,
            competitionName: reg.competitionName || reg.competitionId,
            applicantName: reg.fullName,
            enrollmentNo: reg.enrollmentNo || '',
            teamName: reg.teamName,
            projectName: reg.projectName,
            status: reg.status,
            submittedAt: reg.createdAt,
            updatedAt: reg.updatedAt,
            statusHistory: (reg.statusHistory || []).map(h => ({
              status: h.status,
              timestamp: h.timestamp,
              note: h.note || '',
            })),
          });
        } catch (dbErr) {
          console.error('[MongoDB Track Error]', dbErr);
          return sendError(res, 500, `Database error: ${dbErr.message}`);
        }
      }

      // Local fallback
      const db = readLocalDB();
      const reg = db.find(r => r.applicationId.toUpperCase() === appId);
      if (!reg) return sendError(res, 404, 'Application not found');
      return sendJson(res, 200, {
        applicationId: reg.applicationId,
        competitionName: reg.competitionName,
        applicantName: reg.fullName,
        enrollmentNo: reg.enrollmentNo || '',
        teamName: reg.teamName,
        projectName: reg.projectName,
        status: reg.status,
        submittedAt: reg.createdAt,
        updatedAt: reg.updatedAt,
        statusHistory: reg.statusHistory || [],
      });
    }

    // 3. ADMIN VERIFY KEY: POST /api/technovision/admin/verify-key
    if (pathname === '/api/technovision/admin/verify-key' && req.method === 'POST') {
      const body = await parseBody(req);
      const keyHeader = req.headers['x-technovision-key'];
      const key = body.key || keyHeader;

      if (key && key === ADMIN_KEY) {
        return sendJson(res, 200, { message: 'Key verified', valid: true });
      }
      return sendError(res, 401, 'Invalid admin passkey');
    }

    // 4. ADMIN GET ALL REGISTRATIONS: GET /api/technovision/admin/registrations
    if (pathname === '/api/technovision/admin/registrations' && req.method === 'GET') {
      const keyHeader = req.headers['x-technovision-key'];
      if (keyHeader !== ADMIN_KEY) return sendError(res, 403, 'Unauthorized');

      if (mongoConfigured) {
        try {
          await connectDB();
          const list = await Registration.find().sort({ createdAt: -1 }).lean();
          const normalized = list.map(r => ({
            _id: r._id.toString(),
            applicationId: r.applicationId,
            fullName: r.fullName,
            enrollmentNo: r.enrollmentNo || '',
            email: r.email,
            mobile: r.mobile,
            college: r.college,
            branch: r.branch,
            academicYear: r.academicYear,
            competitionId: r.competitionId,
            competitionName: r.competitionName,
            participationType: r.participationType,
            teamName: r.teamName,
            teamMembers: r.teamMembers || [],
            projectName: r.projectName,
            projectDescription: r.projectDescription,
            status: r.status,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          }));
          return sendJson(res, 200, { registrations: normalized });
        } catch (dbErr) {
          return sendError(res, 500, `Database error: ${dbErr.message}`);
        }
      }

      const db = readLocalDB();
      return sendJson(res, 200, { registrations: db });
    }

    // 5. ADMIN GET STATS: GET /api/technovision/admin/stats
    if (pathname === '/api/technovision/admin/stats' && req.method === 'GET') {
      const keyHeader = req.headers['x-technovision-key'];
      if (keyHeader !== ADMIN_KEY) return sendError(res, 403, 'Unauthorized');

      let list = [];
      if (mongoConfigured) {
        try {
          await connectDB();
          list = await Registration.find({}, 'status competitionId').lean();
        } catch (e) {
          list = [];
        }
      } else {
        list = readLocalDB();
      }

      const total = list.length;
      const pending = list.filter(r => (r.status || '').toLowerCase() === 'submitted').length;
      const underReview = list.filter(r => (r.status || '').toLowerCase() === 'under review').length;
      const approved = list.filter(r => (r.status || '').toLowerCase() === 'approved').length;
      const waitlisted = list.filter(r => (r.status || '').toLowerCase() === 'waitlisted').length;
      const rejected = list.filter(r => (r.status || '').toLowerCase() === 'rejected').length;

      const byCompetition = {};
      list.forEach(r => {
        const cId = r.competitionId;
        if (cId) byCompetition[cId] = (byCompetition[cId] || 0) + 1;
      });

      return sendJson(res, 200, {
        total, pending, underReview, approved, waitlisted, rejected, byCompetition,
      });
    }

    // 6. ADMIN UPDATE STATUS: PATCH /api/technovision/admin/:id/status
    if (pathname.startsWith('/api/technovision/admin/') && pathname.endsWith('/status') && req.method === 'PATCH') {
      const keyHeader = req.headers['x-technovision-key'];
      if (keyHeader !== ADMIN_KEY) return sendError(res, 403, 'Unauthorized');

      const id = pathname.replace('/api/technovision/admin/', '').replace('/status', '');
      const body = await parseBody(req);
      const { status, note } = body;

      if (!status) return sendError(res, 400, 'Status is required');

      if (mongoConfigured) {
        try {
          await connectDB();
          const query = id.startsWith('TV26-') ? { applicationId: id.toUpperCase() } : { _id: id };
          const update = {
            $set: { status, updatedAt: new Date() },
            $push: { statusHistory: { status, timestamp: new Date(), note: note || '' } },
          };

          const updated = await Registration.findOneAndUpdate(query, update, { new: true }).lean();
          if (!updated) return sendError(res, 404, 'Registration not found');

          return sendJson(res, 200, {
            message: 'Status updated in MongoDB Atlas',
            registration: {
              ...updated,
              _id: updated._id.toString(),
            },
          });
        } catch (dbErr) {
          return sendError(res, 500, `Database error: ${dbErr.message}`);
        }
      }

      const db = readLocalDB();
      const reg = db.find(r => r._id === id || r.applicationId === id);
      if (!reg) return sendError(res, 404, 'Registration not found');

      const now = new Date().toISOString();
      reg.status = status;
      reg.updatedAt = now;
      if (!reg.statusHistory) reg.statusHistory = [];
      reg.statusHistory.push({ status, timestamp: now, note: note || '' });

      writeLocalDB(db);
      return sendJson(res, 200, { message: 'Status updated', registration: reg });
    }

    // 7. ADMIN DELETE: DELETE /api/technovision/admin/:id
    if (pathname.startsWith('/api/technovision/admin/') && req.method === 'DELETE') {
      const keyHeader = req.headers['x-technovision-key'];
      if (keyHeader !== ADMIN_KEY) return sendError(res, 403, 'Unauthorized');

      const id = pathname.replace('/api/technovision/admin/', '');

      if (mongoConfigured) {
        try {
          await connectDB();
          const query = id.startsWith('TV26-') ? { applicationId: id.toUpperCase() } : { _id: id };
          const result = await Registration.findOneAndDelete(query);
          if (!result) return sendError(res, 404, 'Registration not found');

          return sendJson(res, 200, { message: 'Registration deleted from MongoDB Atlas' });
        } catch (dbErr) {
          return sendError(res, 500, `Database error: ${dbErr.message}`);
        }
      }

      let db = readLocalDB();
      const before = db.length;
      db = db.filter(r => r._id !== id && r.applicationId !== id);
      if (db.length === before) return sendError(res, 404, 'Registration not found');
      writeLocalDB(db);
      return sendJson(res, 200, { message: 'Registration deleted' });
    }

    // 8. ADMIN CSV EXPORT: GET /api/technovision/admin/export
    if (pathname === '/api/technovision/admin/export' && req.method === 'GET') {
      const keyHeader = req.headers['x-technovision-key'];
      if (keyHeader !== ADMIN_KEY) return sendError(res, 403, 'Unauthorized');

      let list = [];
      if (mongoConfigured) {
        await connectDB();
        list = await Registration.find().sort({ createdAt: -1 }).lean();
      } else {
        list = readLocalDB();
      }

      const headers = ['Application ID', 'Enrollment No', 'Full Name', 'Email', 'Mobile', 'College', 'Branch', 'Academic Year', 'Competition', 'Type', 'Team Name', 'Project Name', 'Status', 'Submitted At'];
      const rows = list.map(r => [
        r.applicationId,
        `"${r.enrollmentNo || ''}"`,
        `"${r.fullName || ''}"`,
        `"${r.email || ''}"`,
        `"${r.mobile || ''}"`,
        `"${r.college || ''}"`,
        `"${r.branch || ''}"`,
        `"${r.academicYear || ''}"`,
        `"${r.competitionName || r.competitionId || ''}"`,
        `"${r.participationType || ''}"`,
        `"${r.teamName || ''}"`,
        `"${r.projectName || ''}"`,
        `"${r.status || ''}"`,
        `"${r.createdAt || ''}"`,
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="technovision_registrations.csv"',
        'Access-Control-Allow-Origin': '*',
      });
      return res.end(csv);
    }

    // 404 for unknown endpoints
    sendError(res, 404, `Endpoint ${req.method} ${pathname} not found`);

  } catch (err) {
    console.error('Server error:', err);
    sendError(res, 500, 'Internal Server Error: ' + err.message);
  }
});

server.listen(PORT, () => {
  const configured = isMongoConfigured();
  console.log(`\n🚀 Technovision Backend Server running at http://localhost:${PORT}/api`);
  console.log(`🔑 Admin Passkey: ${ADMIN_KEY}`);
  if (configured) {
    console.log(`🗄️ Database: MongoDB Atlas configured (${maskMongoUri(process.env.MONGODB_URI)})`);
  } else {
    console.log(`⚠️ Database: MongoDB Atlas is NOT configured yet.`);
    console.log(`   Add MONGODB_URI to .env`);
    console.log(`   Example: MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/flux_db?retryWrites=true&w=majority`);
    console.log(`   (Fallback mode: ${ALLOW_LOCAL_FALLBACK ? 'ACTIVE' : 'OFF - registrations will require MongoDB Atlas'})`);
  }
  console.log('');
});
