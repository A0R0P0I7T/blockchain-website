import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center text-white font-bold text-xs">
                ⬡
              </div>
              <span className="font-bold text-lg tracking-tight">
                Chain<span className="gradient-primary-text">Lens</span>
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Explore blockchain technology through interactive visualizations
              and real-time data.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/concepts", label: "Concepts" },
                { href: "/prices", label: "Live Prices" },
                { href: "/simulator", label: "Simulator" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
              Built With
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "D3.js", "Framer Motion"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium text-text-secondary bg-bg-tertiary rounded-full border border-border"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} ChainLens. Educational project — not
            financial advice.
          </p>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <span>Powered by</span>
            <span className="gradient-primary-text font-semibold">
              Arbitrum
            </span>
            <span>ecosystem data</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
