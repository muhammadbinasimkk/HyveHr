// src/components/ConfirmEmail.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ConfirmEmail: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>(); // Get the token from the URL

  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:5000/api/auth/confirm-email/${token}`)
        .then((response) => {
          setMessage('Email confirmed successfully! Redirecting to login...');
          setTimeout(() => {
            navigate('/login'); // Redirect to login page after confirmation
          }, 3000);
        })
        .catch((err) => {
          setError('Invalid or expired token. Please try again.');
        });
    }
  }, [token, navigate]);

  return (
    <div className="flex font-tahoma items-center justify-center min-h-screen bg-gray-200 p-2">
      <div className="gap-4 rounded-xl relative flex flex-col items-center justify-center w-full max-w-lg p-4 bg-white shadow-lg shadow-gray-400 px-8" style={{ height: '300px' }}>
        {error ? (
          <p className="text-red-500 mb-4">{error}</p>
        ) : (
          <p className="text-green-500 mb-4">{message || 'Confirming your email, please wait...'}</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
