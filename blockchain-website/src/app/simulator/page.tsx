"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Section,
  SectionTitle,
  GlassCard,
  GlowButton,
} from "@/components/ui";

interface Block {
  id: number;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
  isValid: boolean;
  isMining: boolean;
}

// Deterministic hash function (simulates SHA-256 without async)
// Uses a simple but effective hash for visual demonstration
function simpleHash(input: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const combined = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return combined.toString(16).padStart(16, "0");
}

function computeHash(data: string, previousHash: string, nonce: number): string {
  const input = `${data}${previousHash}${nonce}`;
  // Create a longer hash by hashing multiple times with different seeds
  const h1 = simpleHash(input);
  const h2 = simpleHash(input + h1);
  const h3 = simpleHash(input + h2);
  const h4 = simpleHash(input + h3);
  return (h1 + h2 + h3 + h4).slice(0, 64);
}

function isHashValid(hash: string): boolean {
  return hash.startsWith("00");
}

function createBlock(
  id: number,
  data: string,
  previousHash: string,
  nonce: number = 0
): Block {
  const hash = computeHash(data, previousHash, nonce);
  return {
    id,
    data,
    previousHash,
    nonce,
    hash,
    isValid: isHashValid(hash),
    isMining: false,
  };
}

const GENESIS_HASH = "0".repeat(64);

export default function SimulatorPage() {
  const [blocks, setBlocks] = useState<Block[]>([
    createBlock(1, "Alice sends 5 ETH to Bob", GENESIS_HASH),
    createBlock(
      2,
      "Bob sends 2 ETH to Charlie",
      computeHash("Alice sends 5 ETH to Bob", GENESIS_HASH, 0)
    ),
  ]);
  const [miningBlockId, setMiningBlockId] = useState<number | null>(null);
  const miningRef = useRef(false);

  const updateBlock = useCallback(
    (blockId: number, updates: Partial<Block>) => {
      setBlocks((prev) => {
        const newBlocks = prev.map((b) => {
          if (b.id === blockId) {
            return { ...b, ...updates };
          }
          return b;
        });

        // Recalculate chain: update subsequent blocks' previousHash
        for (let i = 1; i < newBlocks.length; i++) {
          const prevBlock = newBlocks[i - 1];
          if (newBlocks[i].previousHash !== prevBlock.hash) {
            const newHash = computeHash(
              newBlocks[i].data,
              prevBlock.hash,
              newBlocks[i].nonce
            );
            newBlocks[i] = {
              ...newBlocks[i],
              previousHash: prevBlock.hash,
              hash: newHash,
              isValid: isHashValid(newHash),
            };
          }
        }

        return newBlocks;
      });
    },
    []
  );

  const handleDataChange = useCallback(
    (blockId: number, newData: string) => {
      setBlocks((prev) => {
        const newBlocks = [...prev];
        const idx = newBlocks.findIndex((b) => b.id === blockId);
        if (idx === -1) return prev;

        const prevHash =
          idx === 0 ? GENESIS_HASH : newBlocks[idx - 1].hash;

        const newHash = computeHash(newData, prevHash, newBlocks[idx].nonce);
        newBlocks[idx] = {
          ...newBlocks[idx],
          data: newData,
          hash: newHash,
          isValid: isHashValid(newHash),
        };

        // Cascade to subsequent blocks
        for (let i = idx + 1; i < newBlocks.length; i++) {
          const cascadeHash = computeHash(
            newBlocks[i].data,
            newBlocks[i - 1].hash,
            newBlocks[i].nonce
          );
          newBlocks[i] = {
            ...newBlocks[i],
            previousHash: newBlocks[i - 1].hash,
            hash: cascadeHash,
            isValid: isHashValid(cascadeHash),
          };
        }

        return newBlocks;
      });
    },
    []
  );

  const mineBlock = useCallback(
    async (blockId: number) => {
      if (miningRef.current) return;
      miningRef.current = true;
      setMiningBlockId(blockId);

      setBlocks((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, isMining: true } : b))
      );

      let nonce = 0;
      const maxAttempts = 100000;

      const block = blocks.find((b) => b.id === blockId);
      if (!block) {
        miningRef.current = false;
        return;
      }

      const idx = blocks.findIndex((b) => b.id === blockId);
      const prevHash = idx === 0 ? GENESIS_HASH : blocks[idx - 1].hash;

      // Mine with visual updates
      const mineStep = () => {
        const batchSize = 100;
        for (let i = 0; i < batchSize && nonce < maxAttempts; i++) {
          const hash = computeHash(block.data, prevHash, nonce);
          if (isHashValid(hash)) {
            // Found valid hash
            setBlocks((prev) => {
              const newBlocks = [...prev];
              const bIdx = newBlocks.findIndex((b) => b.id === blockId);
              if (bIdx === -1) return prev;

              newBlocks[bIdx] = {
                ...newBlocks[bIdx],
                nonce,
                hash,
                isValid: true,
                isMining: false,
              };

              // Cascade
              for (let j = bIdx + 1; j < newBlocks.length; j++) {
                const cascadeHash = computeHash(
                  newBlocks[j].data,
                  newBlocks[j - 1].hash,
                  newBlocks[j].nonce
                );
                newBlocks[j] = {
                  ...newBlocks[j],
                  previousHash: newBlocks[j - 1].hash,
                  hash: cascadeHash,
                  isValid: isHashValid(cascadeHash),
                };
              }

              return newBlocks;
            });
            setMiningBlockId(null);
            miningRef.current = false;
            return;
          }
          nonce++;
        }

        // Update nonce display during mining
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === blockId
              ? {
                  ...b,
                  nonce,
                  hash: computeHash(block.data, prevHash, nonce),
                }
              : b
          )
        );

        if (nonce < maxAttempts) {
          requestAnimationFrame(mineStep);
        } else {
          setBlocks((prev) =>
            prev.map((b) =>
              b.id === blockId ? { ...b, isMining: false } : b
            )
          );
          setMiningBlockId(null);
          miningRef.current = false;
        }
      };

      requestAnimationFrame(mineStep);
    },
    [blocks]
  );

  return (
    <div className="pt-24">
      <Section>
        <SectionTitle
          eyebrow="Interactive"
          title="Block Mining Simulator"
          description="Experience how blockchain mining works. Edit block data, watch the chain break, and mine new valid hashes."
        />

        {/* Instructions */}
        <GlassCard hover={false} className="mb-8 p-5">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success" />
              <span className="text-text-secondary">
                Valid block (hash starts with &quot;00&quot;)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-danger" />
              <span className="text-text-secondary">
                Invalid block (needs mining)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">💡</span>
              <span className="text-text-secondary">
                Edit Block 1 data → Block 2 breaks!
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Blocks */}
        <div className="space-y-6">
          {blocks.map((block, idx) => (
            <div key={block.id}>
              {/* Chain link indicator */}
              {idx > 0 && (
                <div className="flex justify-center my-4">
                  <motion.div
                    animate={{
                      opacity: block.isValid ? [0.5, 1, 0.5] : 1,
                    }}
                    transition={
                      block.isValid
                        ? { duration: 2, repeat: Infinity }
                        : undefined
                    }
                    className={`flex flex-col items-center gap-1 ${
                      block.isValid ? "text-success" : "text-danger"
                    }`}
                  >
                    <div
                      className={`w-px h-6 ${
                        block.isValid ? "bg-success/50" : "bg-danger/50"
                      }`}
                    />
                    <span className="text-xs font-mono">
                      {block.isValid ? "⛓ linked" : "✕ broken"}
                    </span>
                    <div
                      className={`w-px h-6 ${
                        block.isValid ? "bg-success/50" : "bg-danger/50"
                      }`}
                    />
                  </motion.div>
                </div>
              )}

              <BlockCard
                block={block}
                onDataChange={(data) => handleDataChange(block.id, data)}
                onMine={() => mineBlock(block.id)}
                isMining={miningBlockId === block.id}
                isGenesis={idx === 0}
              />
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <SectionTitle
            eyebrow="How It Works"
            title="Mining Explained"
            description="The miner increments the nonce until the hash meets the difficulty target (starts with '00')."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Compute Hash",
                desc: "Combine block data + previous hash + nonce → hash function",
                icon: "🔢",
              },
              {
                step: "02",
                title: "Check Target",
                desc: 'Does the hash start with "00"? If not, increment nonce and retry.',
                icon: "🎯",
              },
              {
                step: "03",
                title: "Block Validated",
                desc: "Once a valid hash is found, the block is accepted into the chain.",
                icon: "✅",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <GlassCard className="h-full">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="text-xs text-primary font-mono mb-2">
                    Step {item.step}
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

function BlockCard({
  block,
  onDataChange,
  onMine,
  isMining,
  isGenesis,
}: {
  block: Block;
  onDataChange: (data: string) => void;
  onMine: () => void;
  isMining: boolean;
  isGenesis: boolean;
}) {
  const borderColor = block.isMining
    ? "border-warning/40"
    : block.isValid
    ? "border-success/30"
    : "border-danger/30";

  const glowStyle = block.isMining
    ? "shadow-[0_0_30px_rgba(255,181,71,0.15)]"
    : block.isValid
    ? "shadow-[0_0_30px_rgba(0,211,149,0.1)]"
    : "shadow-[0_0_30px_rgba(255,77,106,0.1)]";

  return (
    <motion.div
      layout
      animate={
        isMining
          ? {
              borderColor: [
                "rgba(255,181,71,0.4)",
                "rgba(40,160,240,0.4)",
                "rgba(255,181,71,0.4)",
              ],
            }
          : undefined
      }
      transition={
        isMining ? { duration: 1, repeat: Infinity } : { duration: 0.3 }
      }
      className={`glass rounded-[16px] p-6 md:p-8 border-2 ${borderColor} ${glowStyle} transition-all duration-500`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              block.isValid
                ? "bg-success/20 text-success"
                : "bg-danger/20 text-danger"
            }`}
          >
            #{block.id}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">
              Block {block.id}
              {isGenesis && (
                <span className="ml-2 text-xs text-text-muted">(Genesis)</span>
              )}
            </h3>
            <AnimatePresence mode="wait">
              <motion.span
                key={block.isValid ? "valid" : "invalid"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`text-xs font-medium ${
                  block.isMining
                    ? "text-warning"
                    : block.isValid
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {block.isMining
                  ? "⛏ Mining..."
                  : block.isValid
                  ? "✓ Valid"
                  : "✕ Invalid"}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <GlowButton
          onClick={onMine}
          disabled={isMining || block.isValid}
          variant={block.isValid ? "outline" : "primary"}
          size="sm"
        >
          {isMining ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⛏
            </motion.span>
          ) : block.isValid ? (
            "✓ Mined"
          ) : (
            "⛏ Mine"
          )}
        </GlowButton>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {/* Data */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block uppercase tracking-wider">
            Block Data
          </label>
          <input
            type="text"
            value={block.data}
            onChange={(e) => onDataChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-[10px] bg-bg-tertiary border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(40,160,240,0.15)] transition-all duration-300"
            placeholder="Enter transaction data..."
          />
        </div>

        {/* Previous Hash */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block uppercase tracking-wider">
            Previous Hash
          </label>
          <div className="px-4 py-2.5 rounded-[10px] bg-bg-tertiary/50 border border-border text-xs font-mono text-text-muted break-all select-all">
            {block.previousHash}
          </div>
        </div>

        {/* Nonce */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block uppercase tracking-wider">
            Nonce
          </label>
          <div className="px-4 py-2.5 rounded-[10px] bg-bg-tertiary/50 border border-border text-sm font-mono text-text-primary">
            <AnimatePresence mode="wait">
              <motion.span
                key={block.nonce}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                {block.nonce.toLocaleString()}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Hash */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block uppercase tracking-wider">
            Hash
          </label>
          <motion.div
            animate={{
              borderColor: block.isValid
                ? "rgba(0, 211, 149, 0.3)"
                : "rgba(255, 77, 106, 0.3)",
            }}
            className={`px-4 py-2.5 rounded-[10px] border text-xs font-mono break-all select-all ${
              block.isValid
                ? "bg-success/5 text-success border-success/30"
                : "bg-danger/5 text-danger border-danger/30"
            }`}
          >
            {block.hash}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
