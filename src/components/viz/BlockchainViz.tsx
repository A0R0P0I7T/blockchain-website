"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface BlockNode {
  id: number;
  x: number;
  y: number;
  hash: string;
  label: string;
}

export function BlockchainViz() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Define gradients and filters
    const defs = svg.append("defs");

    // Glow filter
    const glow = defs.append("filter").attr("id", "glow");
    glow
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
    const feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Line gradient
    const lineGrad = defs
      .append("linearGradient")
      .attr("id", "line-grad")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    lineGrad.append("stop").attr("offset", "0%").attr("stop-color", "#28A0F0");
    lineGrad
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#9945FF");

    // Generate block nodes
    const blockCount = Math.min(Math.floor(width / 180), 6);
    const spacing = width / (blockCount + 1);
    const centerY = height / 2;

    const blocks: BlockNode[] = Array.from({ length: blockCount }, (_, i) => ({
      id: i,
      x: spacing * (i + 1),
      y: centerY + Math.sin(i * 0.8) * 20,
      hash: `0x${Math.random().toString(16).slice(2, 10)}`,
      label: `Block #${1847 + i}`,
    }));

    // Draw connection lines with animated data flow
    for (let i = 0; i < blocks.length - 1; i++) {
      const from = blocks[i];
      const to = blocks[i + 1];

      // Base line
      svg
        .append("line")
        .attr("x1", from.x + 50)
        .attr("y1", from.y)
        .attr("x2", to.x - 50)
        .attr("y2", to.y)
        .attr("stroke", "url(#line-grad)")
        .attr("stroke-width", 2)
        .attr("opacity", 0.3);

      // Animated particle along line
      const particle = svg
        .append("circle")
        .attr("r", 3)
        .attr("fill", "#28A0F0")
        .attr("filter", "url(#glow)")
        .attr("opacity", 0.8);

      const animateParticle = () => {
        particle
          .attr("cx", from.x + 50)
          .attr("cy", from.y)
          .transition()
          .duration(1500 + i * 200)
          .ease(d3.easeLinear)
          .attr("cx", to.x - 50)
          .attr("cy", to.y)
          .on("end", () => {
            setTimeout(animateParticle, 500 + Math.random() * 1000);
          });
      };
      setTimeout(animateParticle, i * 400);
    }

    // Draw block nodes
    const blockGroups = svg
      .selectAll(".block")
      .data(blocks)
      .enter()
      .append("g")
      .attr("class", "block")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    // Block rectangle (glass effect)
    blockGroups
      .append("rect")
      .attr("x", -50)
      .attr("y", -35)
      .attr("width", 100)
      .attr("height", 70)
      .attr("rx", 12)
      .attr("fill", "rgba(18, 19, 26, 0.8)")
      .attr("stroke", "#28A0F0")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.4)
      .attr("filter", "url(#glow)");

    // Block label
    blockGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -8)
      .attr("fill", "#E8EAED")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("font-family", "var(--font-space-grotesk)")
      .text((d) => d.label);

    // Hash text
    blockGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", 12)
      .attr("fill", "#28A0F0")
      .attr("font-size", "9px")
      .attr("font-family", "var(--font-jetbrains-mono)")
      .attr("opacity", 0.7)
      .text((d) => d.hash);

    // Nonce text
    blockGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", 26)
      .attr("fill", "#8B8D97")
      .attr("font-size", "8px")
      .attr("font-family", "var(--font-jetbrains-mono)")
      .text(() => `nonce: ${Math.floor(Math.random() * 99999)}`);

    // Float animation for blocks
    blockGroups.each(function (_, i) {
      const group = d3.select(this);
      const animateFloat = () => {
        group
          .transition()
          .duration(3000 + i * 500)
          .ease(d3.easeSinInOut)
          .attr(
            "transform",
            (d) => `translate(${(d as BlockNode).x}, ${(d as BlockNode).y - 8})`
          )
          .transition()
          .duration(3000 + i * 500)
          .ease(d3.easeSinInOut)
          .attr(
            "transform",
            (d) => `translate(${(d as BlockNode).x}, ${(d as BlockNode).y + 8})`
          )
          .on("end", animateFloat);
      };
      animateFloat();
    });

    // Background floating particles
    for (let i = 0; i < 15; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      const pr = 1 + Math.random() * 2;

      const dot = svg
        .append("circle")
        .attr("cx", px)
        .attr("cy", py)
        .attr("r", pr)
        .attr("fill", i % 3 === 0 ? "#9945FF" : "#28A0F0")
        .attr("opacity", 0.15 + Math.random() * 0.2);

      const animateDot = () => {
        dot
          .transition()
          .duration(4000 + Math.random() * 4000)
          .ease(d3.easeSinInOut)
          .attr("cy", py + (Math.random() - 0.5) * 40)
          .attr("cx", px + (Math.random() - 0.5) * 30)
          .attr("opacity", 0.1 + Math.random() * 0.3)
          .transition()
          .duration(4000 + Math.random() * 4000)
          .ease(d3.easeSinInOut)
          .attr("cy", py)
          .attr("cx", px)
          .attr("opacity", 0.15)
          .on("end", animateDot);
      };
      animateDot();
    }

    // Cleanup
    return () => {
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[300px] md:h-[400px] relative">
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
