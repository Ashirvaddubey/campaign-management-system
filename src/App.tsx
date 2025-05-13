import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import NewCampaignPage from './pages/NewCampaignPage';
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import AnalyticsPage from './pages/AnalyticsPage';
import AudiencePage from './pages/AudiencePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { testSupabaseConnection } from './lib/supabase';
import { testOpenAIConnection } from './lib/openai';
import { Toaster } from 'react-hot-toast';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Store the current location for redirect after login
    localStorage.setItem('returnTo', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  useEffect(() => {
    // Test connections when app loads
    const testConnections = async () => {
      await Promise.all([
        testSupabaseConnection(),
        testOpenAIConnection()
      ]);
    };
    
    testConnections();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/campaigns/new" element={<NewCampaignPage />} />
          <Route path="/audience" element={<AudiencePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, login, logout } = useAuth();

  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/" element={<Layout user={user} onLogin={login} onLogout={logout} />}>
        <Route index element={<HomePage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="campaigns/:id" element={<CampaignDetailPage />} />
        <Route
          path="campaigns/new"
          element={
            <ProtectedRoute>
              <NewCampaignPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="audience"
          element={
            <ProtectedRoute>
              <AudiencePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;