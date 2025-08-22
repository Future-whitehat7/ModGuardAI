import React from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Layout = lazy(() => import('./components/Layout').then(m => ({ default: m.Layout })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Upload = lazy(() => import('./pages/Upload').then(m => ({ default: m.Upload })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const API = lazy(() => import('./pages/API').then(m => ({ default: m.API })));
const Pricing = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const Perks = lazy(() => import('./pages/Perks').then(m => ({ default: m.Perks })));
const Resources = lazy(() => import('./pages/Resources').then(m => ({ default: m.Resources })));
const Events = lazy(() => import('./pages/Events').then(m => ({ default: m.Events })));
const Media = lazy(() => import('./pages/Media').then(m => ({ default: m.Media })));
const EarlyAccess = lazy(() => import('./pages/EarlyAccess').then(m => ({ default: m.EarlyAccess })));
const StudentPortal = lazy(() => import('./pages/StudentPortal').then(m => ({ default: m.StudentPortal })));
const FellowshipDashboard = lazy(() => import('./pages/FellowshipDashboard').then(m => ({ default: m.FellowshipDashboard })));
const EnterpriseDashboard = lazy(() => import('./pages/EnterpriseDashboard').then(m => ({ default: m.EnterpriseDashboard })));
const ThreatMapExplorer = lazy(() => import('./pages/ThreatMapExplorer').then(m => ({ default: m.ThreatMapExplorer })));
const CaseStudies = lazy(() => import('./pages/CaseStudies').then(m => ({ default: m.CaseStudies })));
const Leaderboard = lazy(() => import('./pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const Features = lazy(() => import('./pages/Features').then(m => ({ default: m.Features })));
const Solutions = lazy(() => import('./pages/Solutions').then(m => ({ default: m.Solutions })));
const Demo = lazy(() => import('./pages/Demo').then(m => ({ default: m.Demo })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));

const LoadingSpinner = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);
function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/earlyaccess" element={<EarlyAccess />} />
          <Route path="/waitlist" element={<EarlyAccess />} />
          <Route path="/student-portal" element={<StudentPortal />} />
          <Route path="/fellowship/dashboard" element={<FellowshipDashboard />} />
          <Route path="/enterprise-dashboard" element={<EnterpriseDashboard />} />
          <Route path="/threat-map" element={<ThreatMapExplorer />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/features" element={<Features />} />
          <Route path="/features/:featureId" element={<Features />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:solutionId" element={<Solutions />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/upload" element={<Layout><Upload /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/api" element={<Layout><API /></Layout>} />
          <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
          <Route path="/perks" element={<Layout><Perks /></Layout>} />
          <Route path="/resources" element={<Layout><Resources /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/media" element={<Layout><Media /></Layout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;