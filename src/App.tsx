import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { MarketingShell } from './components/marketing/MarketingShell';
import { RouteMeta } from './components/marketing/RouteMeta';

const Layout = lazy(() => import('./components/Layout').then((module) => ({ default: module.Layout })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const Upload = lazy(() => import('./pages/Upload').then((module) => ({ default: module.Upload })));
const Analytics = lazy(() => import('./pages/Analytics').then((module) => ({ default: module.Analytics })));
const Settings = lazy(() => import('./pages/Settings').then((module) => ({ default: module.Settings })));
const API = lazy(() => import('./pages/API').then((module) => ({ default: module.API })));
const Pricing = lazy(() => import('./pages/Pricing').then((module) => ({ default: module.Pricing })));
const Perks = lazy(() => import('./pages/Perks').then((module) => ({ default: module.Perks })));
const Resources = lazy(() => import('./pages/Resources').then((module) => ({ default: module.Resources })));
const Events = lazy(() => import('./pages/Events').then((module) => ({ default: module.Events })));
const Media = lazy(() => import('./pages/Media').then((module) => ({ default: module.Media })));
const EarlyAccess = lazy(() => import('./pages/EarlyAccess').then((module) => ({ default: module.EarlyAccess })));
const StudentPortal = lazy(() => import('./pages/StudentPortal').then((module) => ({ default: module.StudentPortal })));
const FellowshipDashboard = lazy(() => import('./pages/FellowshipDashboard').then((module) => ({ default: module.FellowshipDashboard })));
const EnterpriseDashboard = lazy(() => import('./pages/EnterpriseDashboard').then((module) => ({ default: module.EnterpriseDashboard })));
const ThreatMapExplorer = lazy(() => import('./pages/ThreatMapExplorer').then((module) => ({ default: module.ThreatMapExplorer })));
const CaseStudies = lazy(() => import('./pages/CaseStudies').then((module) => ({ default: module.CaseStudies })));
const Leaderboard = lazy(() => import('./pages/Leaderboard').then((module) => ({ default: module.Leaderboard })));
const Features = lazy(() => import('./pages/Features').then((module) => ({ default: module.Features })));
const Solutions = lazy(() => import('./pages/Solutions').then((module) => ({ default: module.Solutions })));
const Demo = lazy(() => import('./pages/Demo').then((module) => ({ default: module.Demo })));
const Blog = lazy(() => import('./pages/Blog').then((module) => ({ default: module.Blog })));
const About = lazy(() => import('./pages/About').then((module) => ({ default: module.About })));

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-ink">
    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">Loading</p>
  </div>
);

function App() {
  return (
    <Router>
      <RouteMeta />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<MarketingShell />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/earlyaccess" element={<EarlyAccess />} />
            <Route path="/waitlist" element={<EarlyAccess />} />
            <Route path="/student-portal" element={<StudentPortal />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/features" element={<Features />} />
            <Route path="/features/:featureId" element={<Features />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/:solutionId" element={<Solutions />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="/fellowship/dashboard" element={<FellowshipDashboard />} />
          <Route path="/enterprise-dashboard" element={<EnterpriseDashboard />} />
          <Route path="/threat-map" element={<ThreatMapExplorer />} />
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
