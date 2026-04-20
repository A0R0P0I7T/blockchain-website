"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionTitle, GlassCard, GlowButton, Skeleton } from "@/components/ui";

interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  usd: number;
  usd_24h_change: number;
}

const COINS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: "₿" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: "◆" },
];

// Simple sparkline component using SVG
function Sparkline({
  data,
  color,
  width = 120,
  height = 40,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#spark-${color})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricesPage() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sparklineData, setSparklineData] = useState<Record<string, number[]>>({
    bitcoin: [],
    ethereum: [],
  });

  const fetchPrices = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd&include_24hr_change=true",
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      const newPrices: CryptoPrice[] = COINS.map((coin) => ({
        ...coin,
        usd: data[coin.id]?.usd ?? 0,
        usd_24h_change: data[coin.id]?.usd_24h_change ?? 0,
      }));

      setPrices(newPrices);
      setLastUpdated(new Date());
      setLoading(false);

      // Append to sparkline data
      setSparklineData((prev) => {
        const next = { ...prev };
        for (const coin of COINS) {
          const price = data[coin.id]?.usd ?? 0;
          const existing = prev[coin.id] || [];
          // Keep last 20 data points
          next[coin.id] = [...existing.slice(-19), price];
        }
        return next;
      });
    } catch {
      setError("Unable to fetch prices. Check your connection or try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle
          eyebrow="Real-Time Data"
          title="Live Crypto Prices"
          description="Track Bitcoin and Ethereum prices in real-time, powered by the CoinGecko API."
        />

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-text-muted">
            {lastUpdated && (
              <span>
                Updated{" "}
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            )}
          </div>
          <GlowButton
            variant="outline"
            size="sm"
            onClick={fetchPrices}
            disabled={loading}
          >
            {loading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  ↻
                </motion.span>
                Fetching...
              </>
            ) : (
              <>↻ Refresh</>
            )}
          </GlowButton>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-[12px] bg-danger/10 border border-danger/20 text-danger text-sm"
            >
              ⚠ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? COINS.map((coin) => (
                <GlassCard key={coin.id} hover={false}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="w-24 h-5" />
                        <Skeleton className="w-16 h-4" />
                      </div>
                    </div>
                    <Skeleton className="w-40 h-10" />
                    <Skeleton className="w-full h-10" />
                  </div>
                </GlassCard>
              ))
            : prices.map((coin, i) => {
                const isPositive = coin.usd_24h_change >= 0;
                const changeColor = isPositive ? "text-success" : "text-danger";
                const glowType = isPositive ? "success" : "danger";
                const sparkColor = isPositive ? "#00D395" : "#FF4D6A";

                return (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                  >
                    <GlassCard hover={true} className="relative overflow-hidden">
                      {/* Subtle glow background */}
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 ${
                          isPositive ? "bg-success" : "bg-danger"
                        }`}
                      />

                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                                coin.id === "bitcoin"
                                  ? "bg-[#F7931A]/20 text-[#F7931A]"
                                  : "bg-[#627EEA]/20 text-[#627EEA]"
                              }`}
                            >
                              {coin.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-text-primary">
                                {coin.name}
                              </h3>
                              <span className="text-xs text-text-muted font-mono">
                                {coin.symbol}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isPositive
                                ? "bg-success/15 text-success"
                                : "bg-danger/15 text-danger"
                            }`}
                          >
                            {isPositive ? "▲" : "▼"}{" "}
                            {formatChange(coin.usd_24h_change)}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={coin.usd}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-3xl md:text-4xl font-bold tracking-tight"
                            >
                              {formatPrice(coin.usd)}
                            </motion.div>
                          </AnimatePresence>
                          <span className="text-xs text-text-muted">USD</span>
                        </div>

                        {/* Sparkline */}
                        <div className="mt-2">
                          <Sparkline
                            data={
                              sparklineData[coin.id]?.length > 1
                                ? sparklineData[coin.id]
                                : [coin.usd * 0.99, coin.usd]
                            }
                            color={sparkColor}
                            width={280}
                            height={50}
                          />
                        </div>
                      </div>

                      {/* Bottom glow line */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${
                          isPositive
                            ? "from-transparent via-success to-transparent"
                            : "from-transparent via-danger to-transparent"
                        }`}
                      />
                    </GlassCard>
                  </motion.div>
                );
              })}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          {[
            {
              icon: "📡",
              title: "Live Data",
              desc: "Prices update every 30 seconds from CoinGecko",
            },
            {
              icon: "📈",
              title: "24h Change",
              desc: "Track daily price movements with visual indicators",
            },
            {
              icon: "📊",
              title: "Sparklines",
              desc: "Mini charts show recent price trajectory",
            },
          ].map((info, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="text-center">
                <div className="text-2xl mb-2">{info.icon}</div>
                <h4 className="font-semibold text-sm text-text-primary mb-1">
                  {info.title}
                </h4>
                <p className="text-xs text-text-secondary">{info.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}
