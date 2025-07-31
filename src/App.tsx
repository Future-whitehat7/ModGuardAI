import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Media from './pages/Media';
import { LandingPage } from './pages/LandingPage';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { API } from './pages/API';
import { Pricing } from './pages/Pricing';
import { Perks } from './pages/Perks';
import { ContentCreation } from './pages/ContentCreation';
import { Resources } from './pages/Resources';
import { Events } from './pages/Events';
import { StudentPortal } from './pages/StudentPortal';
import { FellowshipDashboard } from './pages/FellowshipDashboard';
import { EnterpriseDashboard } from './pages/EnterpriseDashboard';
import { ThreatMapExplorer } from './pages/ThreatMapExplorer';
import { CaseStudies } from './pages/CaseStudies';
import { Leaderboard } from './pages/Leaderboard';
import { Features } from './pages/Features';
import { Solutions } from './pages/Solutions';
import { TransparencyDashboard } from './pages/TransparencyDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
        <Route path="/transparency" element={<TransparencyDashboard />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/upload" element={<Layout><Upload /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/api" element={<Layout><API /></Layout>} />
        <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="/perks" element={<Layout><Perks /></Layout>} />
        <Route path="/content-creation" element={<Layout><ContentCreation /></Layout>} />
        <Route path="/resources" element={<Layout><Resources /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/media" element={<Layout><Media /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;