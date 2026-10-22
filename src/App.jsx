import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector to sync with Auth state
import { Toaster } from "react-hot-toast";


// Components
import Navbar from "./components/Navbar";
import FluxFooter from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Auth from "./components/Auth";
import Loader from "./components/Loader";

// Lazy Load Pages
const Home = React.lazy(() => import("./pages/Home"));
const BehindFlux = React.lazy(() => import("./pages/BehindFlux"));
const FluxFeatures = React.lazy(() => import("./pages/FLuxFeatures"));
const FluxAbout = React.lazy(() => import("./pages/About"));
const FluxEvent = React.lazy(() => import("./pages/Events"));
const OurTeam = React.lazy(() => import("./pages/Team"));
const FluxProjects = React.lazy(() => import("./pages/Projects"));
const FluxGallery = React.lazy(() => import("./pages/Gallery"));
const FluxContact = React.lazy(() => import("./pages/Contact"));
const FluxSkills = React.lazy(() => import("./pages/Skiils"));
const FluxLearningHub = React.lazy(() => import("./pages/LearningHub"));
const LyfatFlux = React.lazy(() => import("./pages/Fluxlyf"));
const Ideathon = React.lazy(() => import("./pages/Ideathon_26"));
const LegacySite = React.lazy(() => import("./pages/LegacySite"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Technovision = React.lazy(() => import("./pages/Technovision_26"));
const TechnovisionCompetitions = React.lazy(() => import("./pages/technovision/TechnovisionCompetitions"));
const CompetitionDetails = React.lazy(() => import("./pages/technovision/CompetitionDetails"));
const TechnovisionRegister = React.lazy(() => import("./pages/technovision/TechnovisionRegister"));
const TechnovisionConfirmation = React.lazy(() => import("./pages/technovision/TechnovisionConfirmation"));
const TrackApplication = React.lazy(() => import("./pages/technovision/TrackApplication"));
const TechnovisionAdmin = React.lazy(() => import("./pages/technovision/TechnovisionAdmin"));
const FluxWave2_0 = React.lazy(() => import("./pages/FluxWave2_0"));
const FluxRecruitment = React.lazy(() => import("./pages/Recruitment_26"));
const FluxWavePublicAdmin = React.lazy(() => import("./pages/FluxWavePublicAdmin"));

// const Recruitment_26_Registration = React.lazy(() => import("./pages/Recruitment_26_Registration"));
const RecruitmentAdminPortal = React.lazy(() => import("./pages/RecruitmentAdminPortal"));

const VercelAnalytics = React.lazy(() => import('./VercelAnalytics'));

// Lazy Load Private Pages
const Dashboard = React.lazy(() => import("./Private/Dashboard"));
const AdminDashboard = React.lazy(() => import("./Private/AdminDashboard"));
const GroupChat = React.lazy(() => import("./Private/GroupChat"));

/**
 * Protected Route (For all logged-in users)
 * Now uses Redux state instead of direct localStorage to prevent loops
 */
const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Use a strict check to ensure userInfo is an object with data
  return userInfo && userInfo._id ? children : <Navigate to="/login" replace />;
};

/**
 * Admin Route (ONLY for users with role 'admin')
 * Now uses Redux state for real-time sync during logout
 */
const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo || !userInfo._id) {
    return <Navigate to="/login" replace />;
  }

  return userInfo.role === "admin" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default function App() {
  return (
    <Router>

      <div className="bg-white dark:bg-[#050505] text-zinc-900 dark:text-white min-h-screen flex flex-col transition-colors duration-300">
        <ScrollToTop />
        <Navbar />

        {/* Global toast notifications — call toast.success()/toast.error() anywhere */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f1115',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#0f1115' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0f1115' },
            },
          }}
        />

        <main className="flex-grow">
          <React.Suspense fallback={<Loader />}>
            <Routes>
              {/* ---------- PUBLIC ROUTES ---------- */}
              <Route
                path="/"
                element={
                  <>
                    <Home />
                    <LyfatFlux />
                    <BehindFlux />

                    <FluxFeatures />
                  </>
                }
              />
              <Route path="/about" element={<FluxAbout />} />
              <Route path="/events" element={<FluxEvent />} />
              <Route path="/team" element={<OurTeam />} />
              <Route path="/projects" element={<FluxProjects />} />
              <Route path="/gallery" element={<FluxGallery />} />
              <Route path="/skills" element={<FluxSkills />} />
              <Route path="/contact" element={<FluxContact />} />
              <Route path="/learninghub" element={<FluxLearningHub />} />
              <Route path="/events/flux-hard-wired" element={<Ideathon />} />
              <Route path="/Old-Site" element={<LegacySite />} />
              <Route path="/events/technovision-2026" element={<TechnovisionCompetitions />} />
              <Route path="/events/technovision-2026/competitions" element={<Navigate to="/events/technovision-2026" replace />} />
              <Route path="/events/technovision-2026/archive" element={<Technovision />} />
              <Route path="/events/technovision-2026/register" element={<TechnovisionRegister />} />
              <Route path="/events/technovision-2026/confirmation" element={<TechnovisionConfirmation />} />
              <Route path="/events/technovision-2026/track" element={<TrackApplication />} />
              <Route path="/events/technovision-2026/:slug" element={<CompetitionDetails />} />
              <Route path="/events/fluxwave-2.0" element={<FluxWave2_0 />} />
              
              {/* Temporary, key-gated event admin — remove after FluxWave 2.0 ends */}
              <Route path="/admin/events/fluxwave-2.0" element={<FluxWavePublicAdmin />} />

              {/* Technovision 2026 Admin (key-gated) */}
              <Route path="/admin/events/technovision-2026" element={<TechnovisionAdmin />} />


              <Route path="/events/recruitment-2026" element={<FluxRecruitment />} />
              <Route path="/events/recruitment-2026/register" element={<Navigate to="/events/recruitment-2026" replace />} />
              <Route path="/admin/events/recruitment-2026" element={<RecruitmentAdminPortal />} />

              {/* ---------- AUTH ROUTES ---------- */}
              {/* Note: Auth component itself now handles the "already logged in" redirect */}
              <Route path="/login" element={<Auth isLoginMode={true} />} />
              <Route path="/register" element={<Auth isLoginMode={false} />} />

              {/* ---------- PRIVATE ROUTES ---------- */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <div className="h-screen pt-24 pb-10 px-4 md:px-10 bg-[#f8fafc] dark:bg-[#050505] transition-colors duration-300">
                      <GroupChat />
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all for 404s */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </React.Suspense>
        </main>

        <FluxFooter />
        <React.Suspense fallback={null}>
          <VercelAnalytics />
        </React.Suspense>
      </div>
    </Router>
  );
}