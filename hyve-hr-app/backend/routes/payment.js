// payment.js (in your routes folder)
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Make sure to set STRIPE_SECRET_KEY in .env
const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Amount in cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd', // Set your preferred currency
      payment_method_types: ['card'],
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

module.exports = router;
