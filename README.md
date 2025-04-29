# 🚀 SolDash

**SolDash** is a powerful, real-time Solana blockchain monitoring dashboard built with developers and crypto enthusiasts in mind. It gives you actionable insights into token movements, whale tracking, and liquidity shifts.

---

## 🌐 Live Site

👉 [Visit SolDash](https://soldash.vercel.app)

---

## 📦 Stack

- **Frontend**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: Tailwind CSS
- **UI Library**: ShadCN/UI
- **Charting**: `react-apexcharts`
- **APIs**: [Solscan Pro API](https://pro-api.solscan.io/)
- **Hosting**: Vercel
- **State Management**: React Context API
- **Data Fetching**: Axios
- **Types**: TypeScript

---

## ✨ Features

### 🧠 Token Insights
- View trending tokens on Solana
- Click any token to drill into:
  - Top holders
  - Account metadata
  - Token supply and movement

### 📈 Solana Chain Metrics
- Live chart for SOL price
- Display of real-time Solana chain info like:
  - TPS
  - Block height
  - Validator count

### 🐳 Whale Wallet Discovery
- Analyze wallets with the largest holdings
- See wallet tags (e.g., Binance, Jump, etc.)
- Fetch account metadata

### 🔎 Token Explorer
- `/tokens/tokenslist`: Paginated list of trending tokens
- `/topholders/:token`: View token's top holders and related account info

---

## 🧭 Navigation Guide

- `/` — Home page with trending tokens + SOL price chart
- `/tokens/tokenslist` — Browse all trending tokens with search & pagination
- `/topholders/[token]` — Detailed whale view for a specific token

---

## ⚙️ Local Development

```bash
# 1. Clone the repo
git clone https://github.com/charle426/soldash.git

# 2. Move into the project
cd soldash

# 3. Install dependencies
npm install

# 4. Add environment variables
touch .env.local
