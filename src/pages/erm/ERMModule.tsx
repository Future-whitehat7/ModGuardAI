import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ERMProvider } from './ERMContext';
import { ERMLayout } from './ERMLayout';
import { DashboardHome } from './DashboardHome';
import { Watchlist } from './Watchlist';
import { ScanAlerts } from './ScanAlerts';
import { AnalyticsPage } from './AnalyticsPage';
import { LogsCompliance } from './LogsCompliance';
import { VoiceAlerts } from './VoiceAlerts';

export const ERMModule: React.FC = () => {
  return (
    <ERMProvider>
      <ERMLayout>
        <Routes>
          <Route path="/erm" element={<DashboardHome />} />
          <Route path="/erm/watchlist" element={<Watchlist />} />
          <Route path="/erm/scan" element={<ScanAlerts />} />
          <Route path="/erm/analytics" element={<AnalyticsPage />} />
          <Route path="/erm/logs" element={<LogsCompliance />} />
          <Route path="/erm/voice" element={<VoiceAlerts />} />
          <Route path="*" element={<Navigate to="/erm" replace />} />
        </Routes>
      </ERMLayout>
    </ERMProvider>
  );
};
