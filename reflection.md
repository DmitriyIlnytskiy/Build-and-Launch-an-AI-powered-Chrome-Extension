# Reflection — WebSummarize

**Most impactful technical choice**
Moving the AI call to a backend server was the best decision: it keeps API keys secret, enables centralized caching and rate-limiting, and allows reliable logging of usage and latency.

**Payments integration**
I used Stripe Checkout in test mode. The extension opens a server endpoint that creates a Checkout Session. On `checkout.session.completed` webhook the server would mark the user as premium in the DB (this project includes the webhook endpoint stub and instructions to verify signatures). Screenshots of a successful test checkout should be captured from Stripe test mode.

**Analytics & Observability**
Events (summarize calls) are logged to Supabase `events` table. Key metrics collected: total summaries, average latency, and success/error rate. These metrics help determine bottlenecks (e.g., high latency correlated with long inputs) and drove the decision to implement server-side chunking.

**What I’d improve with more time**
- Implement real OpenAI (or other) calls with chunking and citation-aware summaries.
- Add server-side caching (Redis) for repeated summaries.
- Improve UX: inline desktop notifications and keyboard shortcuts.
