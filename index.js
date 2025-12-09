// Minimal Express server with Stripe (Supabase logging disabled)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const STRIPE_SECRET = process.env.STRIPE_SECRET || 'sk_test_xxx';
const STRIPE_PRICE_PREMIUM = process.env.STRIPE_PRICE_PREMIUM || 'price_xxx';
const stripe = Stripe(STRIPE_SECRET);

// -------------------- Summarize Endpoint --------------------
app.post('/api/summarize', async (req, res) => {
  const { text, mode } = req.body || {};
  if (!text) return res.status(400).json({ error: 'No text provided' });

  const start = Date.now();

  try {
    // Placeholder AI summary
    const summary =
      text.slice(0, 400) +
      (text.length > 400 ? '\n\n[truncated summary — implement real model call]' : '');
    const latency_ms = Date.now() - start;

    // Supabase logging disabled
    // If you want to enable later, replace below comment with proper async/await syntax

    return res.json({ summary, latency_ms });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------------- Stripe Checkout --------------------
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: STRIPE_PRICE_PREMIUM, quantity: 1 }],
      success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Stripe Webhook --------------------
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  console.log('Webhook received');
  res.status(200).send('ok');
});

// -------------------- Analytics Event (optional, no Supabase) --------------------
app.post('/api/analytics/event', async (req, res) => {
  const ev = req.body || {};
  console.log('Analytics Event:', ev); // log for local testing
  res.json({ ok: true });
});

// -------------------- Root --------------------
app.get('/', (req, res) =>
  res.send('WebSummarize server up. Supabase logging disabled for local testing.')
);

// -------------------- Start Server --------------------
app.listen(PORT, () => console.log('Server listening on', PORT));
