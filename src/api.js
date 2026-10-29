import axios from 'axios';

/**
 * SECRET CONFIGURATION
 * VITE_API_URL is set in your Vercel Dashboard or local .env file.
 * This keeps your backend location hidden from the source code.
 */
const getBaseUrl = () => {
  let url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const BASE_URL = getBaseUrl();
const API = axios.create({
  baseURL: BASE_URL,
});

// Automatically attaches JWT token to every request
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const token = JSON.parse(userInfo).token;
      req.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Auth Token Parsing Error", error);
    }
  }
  return req;
});

// --- AUTH ENDPOINTS ---
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const logout = () => API.post('/auth/logout');

// --- PROJECT ENDPOINTS ---
export const fetchProjects = (params) => API.get('/projects', { params });
export const uploadProject = (projectData) => API.post('/projects', projectData);
export const approveProject = (id) => API.put(`/projects/${id}/approve`);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// --- USER ENDPOINTS ---
export const fetchActiveUsers = () => API.get('/users/active');
export const fetchAllUsers = () => API.get('/users');

// --- CHAT ENDPOINTS ---
export const fetchChatHistory = () => API.get('/chat');

// --- RECRUITMENT 2026 ENDPOINTS ---
export const registerRecruitment = (formData) => API.post('/recruitment/register', formData);
export const checkRecruitmentStatus = (email) => API.get(`/recruitment/status?email=${encodeURIComponent(email)}`);

const recruitmentKeyHeader = () => ({
  headers: { 'x-recruitment-key': sessionStorage.getItem('recruitmentAdminKey') || '' },
});

export const verifyRecruitmentKey = (key) =>
  API.post('/recruitment/verify-key', { key }, { headers: { 'x-recruitment-key': key } });
export const fetchRecruitment_26_Registrations = () => API.get('/recruitment/registrations', recruitmentKeyHeader());
export const updateRecruitmentStatus = (id, status) =>
  API.patch(`/recruitment/status/${id}`, { status }, recruitmentKeyHeader());
export const deleteRecruitment_26_Registration = (id) =>
  API.delete(`/recruitment/registrations/${id}`, recruitmentKeyHeader());

// --- FLUXWAVE 2.0 ENDPOINTS ---
export const registerFluxWave = (formData) => API.post('/fluxwave/register', formData);
export const fetchFluxWaveDomains = () => API.get('/fluxwave/domains');
export const fetchFluxWaveCount = () => API.get('/fluxwave/count');
export const submitFluxWaveIdea = (formData) => API.put('/fluxwave/submit-idea', formData);
export const submitFluxWaveFinal = (formData) => API.put('/fluxwave/submit-final', formData);

// --- FLUXWAVE 2.0 ADMIN ENDPOINTS (require an admin-role token) ---
export const fetchFluxWaveRegistrations = () => API.get('/fluxwave/registrations');
export const updateFluxWaveStatus = (id, status) =>
  API.patch(`/fluxwave/${id}/status`, { status });
export const checkInFluxWaveTeam = (id) => API.patch(`/fluxwave/${id}/checkin`);

// --- FLUXWAVE 2.0 TEMPORARY EVENT-ADMIN ENDPOINTS (key-gated, no login required) ---
// Delete this block + the backend routes once FluxWave 2.0 wraps up.
const eventKeyHeader = () => ({
  headers: { 'x-fluxwave-key': sessionStorage.getItem('fluxwaveAdminKey') || '' },
});

export const fetchFluxWavePublicAdmin = () =>
  API.get('/fluxwave/public-admin/registrations', eventKeyHeader());

export const updateFluxWavePublicStatus = (id, status) =>
  API.patch(`/fluxwave/public-admin/${id}/status`, { status }, eventKeyHeader());

export const checkInFluxWavePublicTeam = (id) =>
  API.patch(`/fluxwave/public-admin/${id}/checkin`, {}, eventKeyHeader());

// --- TECHNOVISION 2026 ENDPOINTS ---
export const registerTechnovision = (formData) => API.post('/technovision/register', formData);
export const trackTechnovisionApp = (appId) => API.get(`/technovision/track/${encodeURIComponent(appId)}`);
export const fetchTechnovisionCompetitions = () => API.get('/technovision/competitions');

// Technovision admin (key-gated, like existing event-admin pattern)
const technovisionKeyHeader = () => ({
  headers: { 'x-technovision-key': sessionStorage.getItem('technovisionAdminKey') || '' },
});

export const verifyTechnovisionKey = (key) =>
  API.post('/technovision/admin/verify-key', { key }, { headers: { 'x-technovision-key': key } });
export const fetchTechnovisionRegistrations = () =>
  API.get('/technovision/admin/registrations', technovisionKeyHeader());
export const updateTechnovisionStatus = (id, status, note) =>
  API.patch(`/technovision/admin/${id}/status`, { status, note }, technovisionKeyHeader());
export const deleteTechnovisionRegistration = (id) =>
  API.delete(`/technovision/admin/${id}`, technovisionKeyHeader());
export const fetchTechnovisionStats = () =>
  API.get('/technovision/admin/stats', technovisionKeyHeader());
export const exportTechnovisionCSV = () =>
  API.get('/technovision/admin/export', { ...technovisionKeyHeader(), responseType: 'blob' });

// --- FAQ ENDPOINTS ---
export const fetchFAQs = () => API.get('/faq');
export const createFAQ = (faqData) => API.post('/faq', faqData);
export const addFAQAnswer = (id, answerData) => API.post(`/faq/${id}/answer`, answerData);
export const upvoteFAQ = (id) => API.put(`/faq/${id}/upvote`);
export const resolveFAQ = (id) => API.put(`/faq/${id}/resolve`);

// --- TECHNOVISION NOV 2026 ENDPOINTS ---
// Retries on network failure / 5xx (cold start, brief DB hiccup). Safe: the backend returns
// the existing pass when the same team submits again, so a retry never creates a duplicate.
export const registerTechnovisionNov = async (formData) => {
  const maxAttempts = 3;
  for (let attempt = 1; ; attempt++) {
    try {
      return await API.post('/technovision-nov/register', formData, { timeout: 25000 });
    } catch (err) {
      const status = err.response?.status;
      const retryable = !err.response || status >= 500;
      if (!retryable || attempt >= maxAttempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
    }
  }
};
export const verifyTechnovisionAdminKey = (key) =>
  API.post('/technovision-nov/verify-key', {}, { headers: { 'x-technovision-key': key } });
export const fetchTechnovisionNovRegistrations = (key) =>
  API.get('/technovision-nov/registrations', { headers: { 'x-technovision-key': key } });
export const deleteTechnovisionNovRegistration = (id, key) =>
  API.delete(`/technovision-nov/registrations/${id}`, { headers: { 'x-technovision-key': key } });

// --- SYSTEM HELPERS ---
export const logoutUser = () => {
  localStorage.removeItem('userInfo');
  window.location.href = '/login';
};

export default API;