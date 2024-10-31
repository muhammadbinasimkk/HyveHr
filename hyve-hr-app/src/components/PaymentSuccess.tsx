import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-center mb-6">Thank you for your payment. Your registration is now complete.</p>
      <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-green-600 text-white rounded">
        Go to Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;
