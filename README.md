Server README
-------------
1. Copy .env.example to .env and fill with your Stripe secret and Supabase keys.
2. npm install
3. npm run dev
Endpoints:
 - POST /api/summarize { text, mode } -> { summary, latency_ms }
 - POST /api/create-checkout-session -> { url }
 - POST /api/analytics/event -> logs event to supabase
 - POST /webhook -> stripe webhook receiver (verify signature in prod)
