import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
      <p className="text-center mb-6">There was an issue with your payment. Please try again.</p>
      <button onClick={() => navigate('/payment')} className="px-4 py-2 bg-red-600 text-white rounded">
        Try Again
      </button>
    </div>
  );
};

export default PaymentFailure;
