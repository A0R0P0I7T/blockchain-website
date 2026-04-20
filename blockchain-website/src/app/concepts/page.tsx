"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Section, SectionTitle, GlassCard } from "@/components/ui";

interface ComparisonItem {
  id: string;
  title: string;
  left: {
    label: string;
    icon: string;
    points: { icon: string; title: string; text: string }[];
  };
  right: {
    label: string;
    icon: string;
    points: { icon: string; title: string; text: string }[];
  };
  color: { left: string; right: string };
  summary: string;
}

const COMPARISONS: ComparisonItem[] = [
  {
    id: "web2-web3",
    title: "Web2 vs Web3",
    summary:
      "Web2 is the internet we know — platforms like Google, Facebook, and Amazon control your data and charge for access. Web3 flips this model using blockchain technology, giving users direct ownership of their data and digital assets.",
    left: {
      label: "Web2",
      icon: "🌐",
      points: [
        {
          icon: "🏢",
          title: "Centralized Servers",
          text: "All data lives on servers owned by corporations like AWS or Google Cloud. If they go down, your data is inaccessible.",
        },
        {
          icon: "🔑",
          title: "Platform Owns Your Data",
          text: "Companies collect, monetize, and control your personal data. You agree via terms of service you never read.",
        },
        {
          icon: "💳",
          title: "Bank-Mediated Payments",
          text: "Every transaction requires a trusted third party (Visa, PayPal, banks) that charges fees and can freeze accounts.",
        },
        {
          icon: "📋",
          title: "Trust Intermediaries",
          text: "You trust platforms to be honest — but data breaches, censorship, and deplatforming happen regularly.",
        },
        {
          icon: "🔒",
          title: "Walled Gardens",
          text: "Your followers, content, and reputation are locked inside each platform. Leave Facebook and you lose everything.",
        },
      ],
    },
    right: {
      label: "Web3",
      icon: "⬡",
      points: [
        {
          icon: "🌍",
          title: "Decentralized Network",
          text: "Data is distributed across thousands of nodes worldwide. No single point of failure or control.",
        },
        {
          icon: "🔐",
          title: "You Own Your Data",
          text: "Cryptographic keys give you true ownership. Your wallet, your identity, your rules — no platform can revoke access.",
        },
        {
          icon: "💎",
          title: "Peer-to-Peer Payments",
          text: "Send value directly to anyone, anywhere, 24/7. No banks, no borders, no permission needed.",
        },
        {
          icon: "📜",
          title: "Trust the Code",
          text: "Smart contracts execute automatically. Rules are transparent, auditable, and can't be changed unilaterally.",
        },
        {
          icon: "🔓",
          title: "Portable Identity",
          text: "Your wallet works across all dApps. One identity, one reputation, fully portable across the ecosystem.",
        },
      ],
    },
    color: {
      left: "from-warning to-danger",
      right: "from-primary to-accent",
    },
  },
  {
    id: "eth-btc",
    title: "Ethereum vs Bitcoin",
    summary:
      "Bitcoin was the first cryptocurrency — digital gold designed to store value. Ethereum took the core blockchain idea and added programmability, enabling developers to build entire applications on top of it.",
    left: {
      label: "Bitcoin",
      icon: "₿",
      points: [
        {
          icon: "🪙",
          title: "Digital Gold",
          text: "Bitcoin is designed as a store of value with a hard cap of 21 million coins. It's deflationary by design — like digital gold.",
        },
        {
          icon: "⛏️",
          title: "Proof of Work",
          text: "Miners compete to solve cryptographic puzzles using massive computing power. Secure but energy-intensive (~150 TWh/year).",
        },
        {
          icon: "📝",
          title: "Simple Scripting",
          text: "Bitcoin Script is intentionally limited — it handles basic transactions like 'send X to Y' but can't run complex logic.",
        },
        {
          icon: "🐢",
          title: "~7 Transactions/sec",
          text: "Bitcoin prioritizes security and decentralization over speed. Each block takes ~10 minutes to mine.",
        },
        {
          icon: "🏦",
          title: "Sound Money",
          text: "No central bank can print more Bitcoin. The supply schedule is mathematically fixed and publicly verifiable.",
        },
      ],
    },
    right: {
      label: "Ethereum",
      icon: "◆",
      points: [
        {
          icon: "💻",
          title: "Programmable Money",
          text: "Ethereum is a world computer. Developers deploy smart contracts — self-executing programs that handle DeFi, NFTs, DAOs, and more.",
        },
        {
          icon: "🥩",
          title: "Proof of Stake",
          text: "Validators stake 32 ETH as collateral. ~99.95% less energy than PoW. Bad actors lose their stake (slashing).",
        },
        {
          icon: "📜",
          title: "Turing-Complete Contracts",
          text: "Solidity smart contracts can encode any logic — lending protocols, exchanges, games, governance systems, and beyond.",
        },
        {
          icon: "🚀",
          title: "~15 TPS (L2s: 4000+)",
          text: "Base layer handles ~15 TPS, but Layer 2 rollups like Arbitrum batch transactions for 100-4000+ TPS.",
        },
        {
          icon: "🌐",
          title: "DApp Ecosystem",
          text: "Thousands of decentralized applications: Uniswap (trading), Aave (lending), OpenSea (NFTs), ENS (domains).",
        },
      ],
    },
    color: {
      left: "from-warning to-[#F7931A]",
      right: "from-[#627EEA] to-accent",
    },
  },
  {
    id: "keys",
    title: "Public vs Private Key",
    summary:
      "Cryptographic key pairs are the foundation of blockchain security. Your public key is like an email address — share it freely. Your private key is like the password — never reveal it. Together they enable secure, verifiable transactions.",
    left: {
      label: "Public Key",
      icon: "🔓",
      points: [
        {
          icon: "📬",
          title: "Your Wallet Address",
          text: "Derived from your public key, this is the address others use to send you crypto. Like a bank account number, but public.",
        },
        {
          icon: "👁️",
          title: "Safe to Share",
          text: "Anyone can see it. In fact, it's designed to be shared — it's how people find you on the blockchain.",
        },
        {
          icon: "📥",
          title: "Used to Receive Funds",
          text: "When someone sends you ETH or tokens, they send it to your public address. The blockchain records this permanently.",
        },
        {
          icon: "🔍",
          title: "Derived from Private Key",
          text: "Generated mathematically from your private key using elliptic curve cryptography. The reverse is computationally impossible.",
        },
        {
          icon: "🔗",
          title: "Verifies Signatures",
          text: "Others use your public key to verify that a transaction was genuinely signed by you — proving authenticity without revealing secrets.",
        },
      ],
    },
    right: {
      label: "Private Key",
      icon: "🔑",
      points: [
        {
          icon: "🔏",
          title: "Your Secret Password",
          text: "A 256-bit number that proves ownership of your wallet. It's the master key to all your digital assets.",
        },
        {
          icon: "🚫",
          title: "Never Share — Ever",
          text: "Anyone with your private key controls your funds. There's no 'forgot password' — no customer support can help.",
        },
        {
          icon: "✍️",
          title: "Signs Transactions",
          text: "When you send crypto, your private key creates a digital signature. This proves you authorized the transfer.",
        },
        {
          icon: "💀",
          title: "Lose It = Lose Everything",
          text: "An estimated $140 billion in Bitcoin is permanently lost because owners lost their private keys. There is no recovery.",
        },
        {
          icon: "🛡️",
          title: "Hardware Wallet Storage",
          text: "Best practice: store on a hardware wallet (Ledger, Trezor) that never exposes the key to the internet.",
        },
      ],
    },
    color: {
      left: "from-success to-primary",
      right: "from-danger to-accent",
    },
  },
  {
    id: "db-blockchain",
    title: "Blockchain vs Traditional DB",
    summary:
      "Traditional databases (MySQL, PostgreSQL, MongoDB) are fast and flexible but require trust in a central administrator. Blockchains trade some speed for trustlessness — no single entity can alter records, making them ideal for financial and governance systems.",
    left: {
      label: "Traditional DB",
      icon: "🗄️",
      points: [
        {
          icon: "👤",
          title: "Single Admin",
          text: "One organization controls all CRUD operations. They can read, write, update, and delete any record at will.",
        },
        {
          icon: "✏️",
          title: "Mutable Records",
          text: "Data can be altered or deleted anytime — great for corrections, but dangerous for audit trails and trust.",
        },
        {
          icon: "🏠",
          title: "Centralized Storage",
          text: "Data lives in one data center (or replicated cloud). If the provider goes down or is hacked, data is at risk.",
        },
        {
          icon: "🔒",
          title: "Access-Controlled",
          text: "The database owner decides who can read or write. Fine-grained permissions but ultimately controlled by one party.",
        },
        {
          icon: "⚡",
          title: "High Performance",
          text: "Thousands to millions of TPS. Optimized for speed with indexing, caching, and query optimization.",
        },
      ],
    },
    right: {
      label: "Blockchain",
      icon: "⛓️",
      points: [
        {
          icon: "👥",
          title: "Consensus Governance",
          text: "Changes require agreement from the majority of network participants. No single entity can unilaterally alter data.",
        },
        {
          icon: "🛡️",
          title: "Immutable Records",
          text: "Once written, data cannot be changed. Each block references the previous one — altering history breaks the chain.",
        },
        {
          icon: "🌐",
          title: "Distributed Globally",
          text: "Full copies exist on thousands of nodes worldwide. The network survives even if most nodes go offline.",
        },
        {
          icon: "🌍",
          title: "Open & Transparent",
          text: "Anyone can read the entire transaction history. Every transfer, every contract call — fully auditable.",
        },
        {
          icon: "🔗",
          title: "Append-Only Ledger",
          text: "New blocks are added but old ones never removed. This creates a complete, verifiable history from genesis.",
        },
      ],
    },
    color: {
      left: "from-text-muted to-text-secondary",
      right: "from-primary to-success",
    },
  },
];

export default function ConceptsPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle
          eyebrow="Core Concepts"
          title="Blockchain Fundamentals"
          description="Understand the building blocks of Web3 through visual comparisons. No jargon — just clarity."
        />

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {COMPARISONS.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-300 ${
                activeIndex === i
                  ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_15px_rgba(40,160,240,0.2)]"
                  : "text-text-secondary hover:text-text-primary bg-bg-secondary border border-border hover:border-border-hover"
              }`}
            >
              {item.title}
            </motion.button>
          ))}
        </div>

        {/* Comparison Display */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ComparisonCard comparison={COMPARISONS[activeIndex]} />
        </motion.div>

        {/* All Cards Grid */}
        <div className="mt-24">
          <SectionTitle
            eyebrow="All Comparisons"
            title="Side by Side"
            description="Every concept at a glance."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {COMPARISONS.map((comparison, i) => (
              <motion.div
                key={comparison.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <ComparisonCard comparison={comparison} compact />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

function ComparisonCard({
  comparison,
  compact = false,
}: {
  comparison: ComparisonItem;
  compact?: boolean;
}) {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(
    null
  );

  return (
    <GlassCard hover={false} className={compact ? "p-5" : "p-6 md:p-8"}>
      {/* Title */}
      <h3
        className={`font-bold text-center mb-3 ${
          compact ? "text-lg" : "text-2xl md:text-3xl"
        }`}
      >
        {comparison.title}
      </h3>

      {/* Summary */}
      {!compact && (
        <p className="text-sm text-text-secondary text-center max-w-2xl mx-auto mb-8 leading-relaxed">
          {comparison.summary}
        </p>
      )}
      {compact && (
        <div className="h-px bg-border mb-4" />
      )}

      {/* Split panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side */}
        <motion.div
          onHoverStart={() => setHoveredSide("left")}
          onHoverEnd={() => setHoveredSide(null)}
          animate={{
            scale:
              hoveredSide === "left"
                ? 1.02
                : hoveredSide === "right"
                ? 0.98
                : 1,
          }}
          transition={{ duration: 0.2 }}
          className={`rounded-[12px] p-5 border transition-all duration-300 ${
            hoveredSide === "left"
              ? "bg-bg-tertiary border-border-hover"
              : "bg-bg-secondary/50 border-border"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${comparison.color.left} flex items-center justify-center text-lg`}
            >
              {comparison.left.icon}
            </div>
            <h4 className="font-semibold text-text-primary text-base">
              {comparison.left.label}
            </h4>
          </div>
          <div className="space-y-3">
            {comparison.left.points.map((point, j) => (
              <motion.div
                key={j}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: j * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="text-base mt-0.5 shrink-0">{point.icon}</span>
                <div>
                  <span className="text-sm font-medium text-text-primary block">
                    {point.title}
                  </span>
                  {!compact && (
                    <span className="text-xs text-text-secondary leading-relaxed block mt-0.5">
                      {point.text}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          onHoverStart={() => setHoveredSide("right")}
          onHoverEnd={() => setHoveredSide(null)}
          animate={{
            scale:
              hoveredSide === "right"
                ? 1.02
                : hoveredSide === "left"
                ? 0.98
                : 1,
          }}
          transition={{ duration: 0.2 }}
          className={`rounded-[12px] p-5 border transition-all duration-300 ${
            hoveredSide === "right"
              ? "bg-primary/5 border-primary/20"
              : "bg-bg-secondary/50 border-border"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${comparison.color.right} flex items-center justify-center text-lg`}
            >
              {comparison.right.icon}
            </div>
            <h4 className="font-semibold text-text-primary text-base">
              {comparison.right.label}
            </h4>
          </div>
          <div className="space-y-3">
            {comparison.right.points.map((point, j) => (
              <motion.div
                key={j}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: j * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="text-base mt-0.5 shrink-0">{point.icon}</span>
                <div>
                  <span className="text-sm font-medium text-text-primary block">
                    {point.title}
                  </span>
                  {!compact && (
                    <span className="text-xs text-text-secondary leading-relaxed block mt-0.5">
                      {point.text}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </GlassCard>
  );
}
