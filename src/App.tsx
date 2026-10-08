import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { BusinessPage } from './pages/BusinessPage';
import { AssistantPage } from './pages/AssistantPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { PartnershipsPage } from './pages/PartnershipsPage';
import { BridgesPage } from './pages/BridgesPage';
import { CompliancePage } from './pages/CompliancePage';
import { SchemesPage } from './pages/SchemesPage';
import { TendersPage } from './pages/TendersPage';
import { CertificationsPage } from './pages/CertificationsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { DeadlinesPage } from './pages/DeadlinesPage';
import { ActionsPage } from './pages/ActionsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Auth & Onboarding Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Main Application Shell with AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/partnerships" element={<PartnershipsPage />} />
          <Route path="/bridges" element={<BridgesPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/tenders" element={<TendersPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/deadlines" element={<DeadlinesPage />} />
          <Route path="/actions" element={<ActionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
