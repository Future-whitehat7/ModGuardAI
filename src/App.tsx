import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { About } from './pages/About';
import { ImpersonationCheck } from './pages/ImpersonationCheck';
import { ImpersonationThanks } from './pages/ImpersonationThanks';
import { InsightArticle } from './pages/InsightArticle';
import { Insights } from './pages/Insights';
import { LandingPage } from './pages/LandingPage';
import { ScamCheckTool } from './pages/ScamCheckTool';
import { Sponsor } from './pages/Sponsor';
import { MarketingShell } from './components/marketing/MarketingShell';
import { RouteMeta } from './components/marketing/RouteMeta';

function App() {
  return (
    <Router>
      <RouteMeta />
      <Routes>
        <Route element={<MarketingShell />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/scamcheck" element={<ScamCheckTool />} />
          <Route path="/impersonation-check" element={<ImpersonationCheck />} />
          <Route path="/impersonation-check/thanks" element={<ImpersonationThanks />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<InsightArticle />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
