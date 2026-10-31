import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { About } from './pages/About';
import { LandingPage } from './pages/LandingPage';
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
