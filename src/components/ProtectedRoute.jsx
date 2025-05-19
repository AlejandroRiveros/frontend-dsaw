import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ErrorMessage from './ErrorMessage.jsx';

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);
    console.log("Required Role:", requiredRole);
    const isTokenExpired = decoded.exp * 1000 < Date.now();
    if (isTokenExpired) {
      localStorage.removeItem('token');
      return <Navigate to="/" replace />;
    }

    if (requiredRole && decoded.role !== requiredRole) {
      return <ErrorMessage message="No tienes permiso para acceder a esta página." />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;