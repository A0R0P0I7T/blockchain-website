import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "ChainLens — Visualize the Blockchain",
  description:
    "Explore Ethereum Layer 2 scaling with Arbitrum. Interactive blockchain visualization, live crypto prices, and a hands-on block mining simulator.",
  keywords: [
    "blockchain",
    "arbitrum",
    "layer 2",
    "ethereum",
    "web3",
    "crypto",
    "mining simulator",
  ],
  openGraph: {
    title: "ChainLens — Visualize the Blockchain",
    description:
      "Interactive Web3 education platform with live crypto data and blockchain simulations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col noise">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
