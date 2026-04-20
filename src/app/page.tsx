"use client";

import { motion } from "framer-motion";
import { GlassCard, GlowButton, Section, SectionTitle } from "@/components/ui";
import { BlockchainViz } from "@/components/viz/BlockchainViz";
import Link from "next/link";

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Finality",
    description:
      "Transactions confirmed in milliseconds, not minutes. Layer 2 makes blockchain usable.",
    gradient: "from-primary to-primary-light",
  },
  {
    icon: "🔒",
    title: "Ethereum Security",
    description:
      "Inherit the full security of Ethereum mainnet while scaling to thousands of TPS.",
    gradient: "from-accent to-accent-light",
  },
  {
    icon: "💰",
    title: "10x Lower Fees",
    description:
      "Gas costs reduced by 90%+. Execute complex smart contracts without breaking the bank.",
    gradient: "from-success to-primary",
  },
  {
    icon: "🌐",
    title: "Full EVM Compatibility",
    description:
      "Deploy existing Solidity contracts without changes. Same tools, better performance.",
    gradient: "from-primary to-accent",
  },
];

const L2_BENEFITS = [
  { metric: "10x", label: "Lower fees" },
  { metric: "40x", label: "Faster TXs" },
  { metric: "100%", label: "EVM compatible" },
  { metric: "L1", label: "Security" },
];

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 radial-primary" />
        <div className="absolute inset-0 radial-accent" />
        <div className="absolute inset-0 grid-bg opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-[pulse-glow_2s_ease-in-out_infinite]" />
              Blockchain Visualization Platform
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
              <span className="block">Explore the</span>
              <span className="block gradient-primary-text mt-2">
                Future of Scaling
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Visualize blockchain architecture, understand Layer 2 solutions,
              and interact with live crypto data — all in one place.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <Link href="/simulator">
                <GlowButton size="lg">
                  Launch Simulator
                  <span className="text-lg">→</span>
                </GlowButton>
              </Link>
              <Link href="/concepts">
                <GlowButton variant="outline" size="lg">
                  Learn Concepts
                </GlowButton>
              </Link>
            </div>
          </motion.div>

          {/* D3 Blockchain Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8"
          >
            <BlockchainViz />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-text-muted flex justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-text-muted" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== WHY LAYER 2 ===== */}
      <Section id="why-l2" className="radial-primary">
        <SectionTitle
          eyebrow="The Scaling Problem"
          title="Why Layer 2?"
          description="Ethereum processes ~15 transactions per second. The world needs millions. Layer 2 bridges this gap without sacrificing security."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {L2_BENEFITS.map((item, i) => (
            <motion.div key={i} variants={fadeUp}>
              <GlassCard delay={i * 0.1} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-primary-text mb-2">
                  {item.metric}
                </div>
                <div className="text-sm text-text-secondary">{item.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* L2 Diagram — simplified visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16"
        >
          <GlassCard hover={false} className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* L1 */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-2xl mb-3">
                  ◆
                </div>
                <h4 className="font-semibold text-text-primary">
                  Ethereum L1
                </h4>
                <p className="text-xs text-text-secondary mt-1">
                  Security & settlement
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center gap-2 text-text-muted">
                <div className="w-12 h-px bg-gradient-to-r from-accent to-primary" />
                <span className="text-xs">Batched proofs</span>
                <div className="w-12 h-px bg-gradient-to-r from-primary to-success" />
              </div>
              <div className="md:hidden flex flex-col items-center gap-2 text-text-muted">
                <div className="h-8 w-px bg-gradient-to-b from-accent to-primary" />
                <span className="text-xs">Batched proofs</span>
                <div className="h-8 w-px bg-gradient-to-b from-primary to-success" />
              </div>

              {/* L2 */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-2xl mb-3">
                  ⬡
                </div>
                <h4 className="font-semibold text-text-primary">Arbitrum L2</h4>
                <p className="text-xs text-text-secondary mt-1">
                  Fast execution & low fees
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center gap-2 text-text-muted">
                <div className="w-12 h-px bg-gradient-to-r from-primary to-success" />
                <span className="text-xs">Fast TXs</span>
                <div className="w-12 h-px bg-gradient-to-r from-success to-primary" />
              </div>
              <div className="md:hidden flex flex-col items-center gap-2 text-text-muted">
                <div className="h-8 w-px bg-gradient-to-b from-primary to-success" />
                <span className="text-xs">Fast TXs</span>
                <div className="h-8 w-px bg-gradient-to-b from-success to-primary" />
              </div>

              {/* Users */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-success/20 border border-success/30 flex items-center justify-center text-2xl mb-3">
                  👤
                </div>
                <h4 className="font-semibold text-text-primary">Users</h4>
                <p className="text-xs text-text-secondary mt-1">
                  Seamless experience
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </Section>

      {/* ===== WHAT IS ARBITRUM ===== */}
      <Section id="arbitrum">
        <SectionTitle
          eyebrow="Technology"
          title="What is Arbitrum?"
          description="Arbitrum is an Optimistic Rollup — it executes transactions off-chain and posts compressed data back to Ethereum for verification."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {FEATURES.map((feature, i) => (
            <motion.div key={i} variants={fadeUp}>
              <GlassCard delay={i * 0.1} className="h-full">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-xl shrink-0`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-text-primary mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ===== CTA ===== */}
      <Section className="radial-accent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Ready to <span className="gradient-primary-text">explore</span>?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            Dive into live market data or simulate your own blockchain — hands-on
            learning, zero setup.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/prices">
              <GlowButton size="lg">
                View Live Prices
                <span>📊</span>
              </GlowButton>
            </Link>
            <Link href="/simulator">
              <GlowButton variant="accent" size="lg">
                Mine a Block
                <span>⛏️</span>
              </GlowButton>
            </Link>
          </div>
        </motion.div>
      </Section>
    </>
  );
}
