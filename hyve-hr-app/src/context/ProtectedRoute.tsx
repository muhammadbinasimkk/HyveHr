// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth(); // Access the current user from AuthContext

  // If there is no current user, redirect to the login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Otherwise, render the children components (protected route)
  return children;
};

export default ProtectedRoute;
