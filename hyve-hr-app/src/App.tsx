import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import ConfirmEmail from './components/ConfirmEmail';
import ForgotPassword from './components/ForgotPassword';
import ChangePassword from './components/ChangePassword';
import ProtectedRoute from './context/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import LanguageSelector from './components/LanguageSelector'; // Language selector component
import UserProfile from './components/UserProfile'; // Importing UserProfile component
import CompanyProfile from './components/CompanyProfile'; // Importing CompanyProfile component

const App: React.FC = () => {
  const { t } = useTranslation(); // Translation hook

  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          {/* Language Selector */}
          <LanguageSelector />

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ChangePassword />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* UserProfile Route */}
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* CompanyProfile Route */}
            <Route
              path="/company-profile"
              element={
                <ProtectedRoute>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
