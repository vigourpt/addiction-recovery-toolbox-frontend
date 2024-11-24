import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout/Layout';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import SobrietyTracker from './pages/SobrietyTracker/SobrietyTracker';
import SavingsCalculator from './pages/SavingsCalculator/SavingsCalculator';
import HealthProgress from './pages/HealthProgress/HealthProgress';
import Resources from './pages/Resources/Resources';
import { useAuth } from './context/AuthContext';

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sobriety-tracker"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SobrietyTracker />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings-calculator"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SavingsCalculator />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/health-progress"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HealthProgress />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Resources />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
