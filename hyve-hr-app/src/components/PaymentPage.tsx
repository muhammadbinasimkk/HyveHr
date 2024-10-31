import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51QD92uIBK5jDC1BOl9ObLFPYgQvUW8z9T6OpoyyDkpSwkqfwn1ijqcph7Zqf0f3AxPPn6AqpBRvad42rNDvdL97d00gOa5mcAl'); // Replace with your actual publishable key

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch client secret from backend to initiate the payment
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
          amount: 1000, // Amount in cents, e.g., $10.00
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Failed to create payment intent:', error);
        setError('Failed to initialize payment. Please try again.');
      }
    };
    fetchPaymentIntent();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
          billing_details: { name: 'User Name' }, // Replace with actual user data
        },
      });

      if (error) {
        setError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        navigate('/payment-success'); // Redirects to PaymentSuccess page on success
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-center mb-4">Complete Your Payment</h2>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <div className="mb-4">
        <CardElement className="p-2 border rounded" options={{ hidePostalCode: true }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-2 px-4 bg-green-500 text-white rounded"
      >
        {loading ? 'Processing...' : 'Pay $10.00'}
      </button>
    </form>
  );
};

const PaymentPage: React.FC = () => (
  <Elements stripe={stripePromise}>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <PaymentForm />
    </div>
  </Elements>
);

export default PaymentPage;
