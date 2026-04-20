# ChainLens — Interactive Blockchain & Web3 Education

ChainLens is a premium, interactive Web3 education platform designed to make complex blockchain concepts intuitive. Built with cutting-edge web technologies, it provides a visual-first approach to learning about decentralized networks, Layer 2 scaling, and the mechanics of blockchain security.

![Preview Placeholder](https://via.placeholder.com/1200x600/0A0B0F/28A0F0?text=ChainLens+—+Visualize+the+Blockchain)

## 🚀 Key Features

### 1. Interactive Visualizer (Landing Page)
Experience the flow of a blockchain through a **D3.js-powered animation system**. See floating blocks represent live data points, emphasizing the immutable yet dynamic nature of Distributed Ledger Technology (DLT).

### 2. Deep-Dive Concepts
Comprehensive comparisons that break down the "Why" and "How":
- **Web2 vs. Web3**: Moving from centralized silos to decentralized ownership.
- **BTC vs. ETH**: Comparing digital gold to the world's programmable computer.
- **Public Keys vs. Private Keys**: Mastering the fundamentals of digital identity.
- **Databases vs. Blockchains**: Understanding when to use immutable ledgers.

### 3. Live Market Intelligence
A real-time price tracking dashboard powered by **CoinGecko API**:
- **Watchlist Search**: Add and track any cryptocurrency from thousands of available assets.
- **Live Sparklines**: Visualize recent price trends with dynamic SVG trajectories.
- **Market Dynamics**: Track 24-hour changes and price movements with millisecond precision.

### 4. Hands-on Mining Simulator
A high-fidelity **Proof-of-Work (PoW) simulator**:
- **Real Mining Logic**: Mine blocks with a difficulty target of 4 leading zeros (`0000`).
- **Chain Integrity**: Experience how changing data in one block invalidates the entire subsequent chain.
- **Animated Nonce Search**: Watch the computational effort required to secure a block in real-time.

## 🛠 Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router & Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Glassmorphism
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth layout transitions
- **Visualization**: [D3.js](https://d3js.org/) for the core blockchain visual engine
- **API**: [CoinGecko API](https://www.coingecko.com/en/api) for decentralized market data
- **Typography**: Space Grotesk (Headers) & JetBrains Mono (Code/Technical Data)

## 🏁 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone git@github-personal:A0R0P0I7T/Blockchain-Website.git
   cd Blockchain-Website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```bash
├── src/
│   ├── app/                # Next.js App Router (Pages & Routing)
│   ├── components/
│   │   ├── layout/         # Navbar, Footer, and Shell components
│   │   ├── ui/             # Reusable Glassmorphism & Glow components
│   │   └── viz/            # D3.js Blockchain visualizer
│   └── globals.css         # Tailwind v4 & Global design tokens
├── public/                 # Static assets
└── next.config.ts          # Project configuration
```

## 📄 License
This project is for educational purposes. Feel free to use the concepts and components for your own Web3 projects.

---
Built with ❤️ for the Web3 Community.
