import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Zap, TrendingUp, Shield, BarChart3, Brain, Target,
  ArrowRight, ChevronRight, Star, Check, Moon, Sun,
  LineChart, Layers, Globe, Lock, Cpu, Sparkles, Play,
  ArrowUpRight, Menu, X,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   TradeOmen — Premium Landing Page
   ═══════════════════════════════════════════════════════════ */

// Scroll-reveal wrapper
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { resolvedMode, setMode } = useTheme();
  const isDark = resolvedMode === "dark";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hero parallax
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Analytics", href: "#analytics" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "dark" : "light"} bg-background text-foreground overflow-x-hidden`}>

      {/* ── Animated mesh gradient background ──────────── */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Primary orb */}
        <motion.div
          className="absolute w-[900px] h-[900px] rounded-full"
          style={{
            top: "-20%",
            left: "50%",
            x: "-50%",
            background: isDark
              ? `radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)`
              : `radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Secondary orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            bottom: "10%",
            right: "-10%",
            background: isDark
              ? `radial-gradient(circle, hsl(var(--accent) / 0.08) 0%, transparent 70%)`
              : `radial-gradient(circle, hsl(var(--accent) / 0.05) 0%, transparent 70%)`,
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Tertiary orb */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            top: "50%",
            left: "-5%",
            background: isDark
              ? `radial-gradient(circle, hsl(145 63% 49% / 0.05) 0%, transparent 70%)`
              : `radial-gradient(circle, hsl(145 63% 49% / 0.03) 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
          animate={{
            y: [0, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
            opacity: isDark ? 0.4 : 0.15,
          }}
        />
      </div>

      {/* ── Navigation — Transparent, Fixed ────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-2xl border-b border-border/30"
            : ""
        }`}
        style={{
          backgroundColor: scrolled
            ? isDark ? "hsla(var(--background) / 0.7)" : "hsla(var(--background) / 0.8)"
            : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Zap size={18} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Trade<span className="text-primary">Omen</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode(isDark ? "light" : "dark")}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden sm:flex h-9 px-4 items-center rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="landing-btn-primary h-9 px-5 rounded-xl text-[13px] font-semibold transition-all"
            >
              Get Started Free
            </button>
            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-border/20 backdrop-blur-2xl"
            style={{ backgroundColor: isDark ? "hsla(var(--background) / 0.95)" : "hsla(var(--background) / 0.97)" }}
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">{link.label}</a>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-32 pb-8 md:pt-44 md:pb-12 min-h-[90vh] flex flex-col justify-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/15 bg-primary/5 backdrop-blur-sm mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-xs font-semibold text-primary tracking-wide">Now in Public Beta — Join 10K+ Traders</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold tracking-[-0.04em] leading-[0.95] mb-7"
          >
            <span className="block text-foreground">Your trades.</span>
            <span className="block mt-1">
              <span className="landing-gradient-text">Decoded.</span>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed mb-12"
          >
            The AI-powered journal that transforms raw trade data into
            actionable intelligence. Track, analyze, dominate.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="landing-btn-primary group h-13 px-8 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-2xl transition-all"
            >
              Start Free — No Card Required
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group h-13 px-8 rounded-2xl text-sm font-medium border border-border/40 text-foreground hover:border-foreground/20 hover:bg-foreground/[0.03] transition-all flex items-center gap-3 backdrop-blur-sm">
              <Play size={14} className="text-primary" />
              Watch Demo
            </button>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-5"
          >
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2.5">
                {["from-blue-400 to-indigo-600", "from-emerald-400 to-teal-600", "from-amber-400 to-orange-600", "from-violet-400 to-purple-600", "from-rose-400 to-pink-600"].map((bg, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${bg} border-[2.5px] border-background flex items-center justify-center text-[10px] font-bold text-white shadow-md`}>
                    {["A", "M", "J", "S", "K"][i]}
                  </div>
                ))}
              </div>
              <div className="h-8 w-px bg-border/40" />
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-sm font-semibold text-foreground ml-2">4.9</span>
                </div>
                <span className="text-[11px] text-muted-foreground">from 2,400+ reviews</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 3D Dashboard Preview ──────────────────────── */}
      <section className="relative pb-16 md:pb-32">
        <Reveal>
          <div className="max-w-6xl mx-auto px-6">
            <div
              className="relative rounded-2xl border border-border/30 overflow-hidden"
              style={{
                perspective: "1200px",
              }}
            >
              <motion.div
                initial={{ rotateX: 8, scale: 0.95, opacity: 0 }}
                whileInView={{ rotateX: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative rounded-2xl overflow-hidden shadow-[0_20px_80px_-20px_hsl(var(--primary)/0.15)]"
                style={{
                  background: isDark
                    ? "linear-gradient(145deg, hsl(var(--card)), hsl(var(--background)))"
                    : "linear-gradient(145deg, hsl(var(--card)), hsl(var(--background) / 0.8))",
                  border: `1px solid ${isDark ? "hsl(var(--border))" : "hsl(var(--border))"}`,
                }}
              >
                {/* Title bar */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/30">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-loss/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-success/70" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="h-6 px-4 rounded-lg bg-foreground/[0.04] border border-border/20 flex items-center">
                      <span className="text-[11px] text-muted-foreground font-mono">tradeomen.app/dashboard</span>
                    </div>
                  </div>
                </div>

                {/* Mock dashboard */}
                <div className="p-6 grid grid-cols-4 gap-4">
                  {/* Metric cards */}
                  {[
                    { label: "Total P&L", value: "$12,847", change: "+18.2%", up: true },
                    { label: "Win Rate", value: "68.5%", change: "+2.1%", up: true },
                    { label: "Trades", value: "142", change: "This month", up: true },
                    { label: "Best Trade", value: "+$2,300", change: "XAUUSD", up: true },
                  ].map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="rounded-xl border border-border/20 p-4"
                      style={{ background: isDark ? "hsl(var(--surface) / 0.5)" : "hsl(var(--card) / 0.8)" }}
                    >
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">{m.label}</p>
                      <p className="text-lg font-bold text-success">{m.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{m.change}</p>
                    </motion.div>
                  ))}

                  {/* Chart */}
                  <div className="col-span-3 rounded-xl border border-border/20 p-5 h-52" style={{ background: isDark ? "hsl(var(--surface) / 0.5)" : "hsl(var(--card) / 0.8)" }}>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold text-foreground">Portfolio Growth</p>
                      <div className="flex gap-2">
                        {["1D", "1W", "1M", "ALL"].map((t) => (
                          <span key={t} className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${t === "ALL" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="h-32 flex items-end gap-[3px]">
                      {[35, 42, 38, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 92, 88, 95, 90, 98, 82, 88, 94, 100, 96, 105, 98, 108, 102, 110].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.03, duration: 0.6 }}
                          className="flex-1 rounded-t"
                          style={{
                            background: `linear-gradient(180deg, hsl(var(--primary) / ${0.6 + h / 300}), hsl(var(--primary) / 0.08))`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Side panel */}
                  <div className="rounded-xl border border-border/20 p-4 h-52" style={{ background: isDark ? "hsl(var(--surface) / 0.5)" : "hsl(var(--card) / 0.8)" }}>
                    <p className="text-xs font-semibold text-foreground mb-3">Recent Trades</p>
                    <div className="space-y-3">
                      {[
                        { symbol: "XAUUSD", pnl: "+$2,300", win: true },
                        { symbol: "BTCUSDT", pnl: "+$485", win: true },
                        { symbol: "EURUSD", pnl: "-$125", win: false },
                        { symbol: "AAPL", pnl: "+$97", win: true },
                        { symbol: "TSLA", pnl: "+$312", win: true },
                      ].map((t, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${t.win ? "bg-success" : "bg-loss"}`} />
                            <span className="text-[11px] font-medium text-foreground">{t.symbol}</span>
                          </div>
                          <span className={`text-[11px] font-semibold ${t.win ? "text-success" : "text-loss"}`}>{t.pnl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                  style={{ background: `linear-gradient(transparent, hsl(var(--background)))` }}
                />
              </motion.div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Logo strip ────────────────────────────────── */}
      <Reveal>
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-center text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-[0.2em] mb-8">
              Integrates with your favorite platforms
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {["MetaTrader 4", "MetaTrader 5", "cTrader", "TradingView", "Binance", "Interactive Brokers"].map((p, i) => (
                <span key={i} className="text-sm font-semibold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors cursor-default tracking-wide">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Bento Features Grid ───────────────────────── */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-20">
              <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-[0.25em] mb-4">Features</span>
              <h2 className="text-3xl md:text-[3.5rem] font-extrabold tracking-[-0.03em] leading-[1.05] text-foreground">
                Built for traders who<br />
                <span className="text-muted-foreground">refuse to guess.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Brain,
                title: "AI Analysis",
                description: "Pattern recognition that spots what you miss. Get personalized insights from every single trade.",
                span: "lg:col-span-2",
                gradient: "from-violet-500/10 to-purple-500/5",
                iconGradient: "from-violet-500 to-purple-600",
              },
              {
                icon: LineChart,
                title: "Live Tracking",
                description: "Real-time P&L, custom gauges, and automated risk alerts. Always know where you stand.",
                span: "",
                gradient: "from-emerald-500/10 to-teal-500/5",
                iconGradient: "from-emerald-500 to-teal-600",
              },
              {
                icon: BarChart3,
                title: "Deep Reports",
                description: "Strategies, discipline metrics, session analysis — every angle covered.",
                span: "",
                gradient: "from-blue-500/10 to-cyan-500/5",
                iconGradient: "from-blue-500 to-cyan-600",
              },
              {
                icon: Shield,
                title: "Risk Engine",
                description: "Position sizing, drawdown limits, and automated safety nets. Trade with confidence.",
                span: "",
                gradient: "from-amber-500/10 to-orange-500/5",
                iconGradient: "from-amber-500 to-orange-600",
              },
              {
                icon: Target,
                title: "Strategy Lab",
                description: "Track unlimited strategies with win rates, profit factors, and trend analysis. A/B test your edge.",
                span: "",
                gradient: "from-rose-500/10 to-pink-500/5",
                iconGradient: "from-rose-500 to-pink-600",
              },
              {
                icon: Layers,
                title: "Custom Dashboards",
                description: "Drag-and-drop widgets, multiple layouts, personalized views. Your workspace, your rules.",
                span: "lg:col-span-2",
                gradient: "from-cyan-500/10 to-blue-500/5",
                iconGradient: "from-cyan-500 to-blue-600",
              },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.08} className={feature.span}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`group relative rounded-2xl border border-border/30 p-8 h-full overflow-hidden transition-colors hover:border-border/50`}
                  style={{
                    background: isDark
                      ? "hsl(var(--card) / 0.4)"
                      : "hsl(var(--card) / 0.7)",
                  }}
                >
                  {/* Hover gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.iconGradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon size={22} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Analytics Showcase (Split) ────────────────── */}
      <section id="analytics" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <Reveal>
              <div>
                <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-[0.25em] mb-4">Analytics</span>
                <h2 className="text-3xl md:text-[2.8rem] font-extrabold tracking-[-0.03em] leading-[1.1] text-foreground mb-6">
                  Every trade tells a story.<br />
                  <span className="text-muted-foreground">We help you read it.</span>
                </h2>
                <p className="text-muted-foreground mb-10 leading-relaxed text-[15px]">
                  Our analytics engine processes every entry, exit, and hold time to surface
                  patterns invisible to the naked eye. Stop repeating mistakes. Start compounding wins.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: Cpu, label: "AI Pattern Recognition", desc: "Automatically detect setups that make you money — and ones that don't." },
                    { icon: Globe, label: "Multi-Market Coverage", desc: "Forex, Crypto, Stocks, Futures, Options — unified in one view." },
                    { icon: Lock, label: "Bank-Grade Security", desc: "End-to-end encryption. Read-only API. Your data never leaves our vault." },
                  ].map((item, i) => (
                    <motion.div key={i} whileHover={{ x: 4 }} className="flex items-start gap-4 group cursor-default">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                        <item.icon size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground mb-0.5">{item.label}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Stats bento */}
            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "10K+", label: "Active Traders", icon: TrendingUp },
                  { value: "2.5M", label: "Trades Analyzed", icon: BarChart3 },
                  { value: "99.9%", label: "Uptime", icon: Zap },
                  { value: "4.9★", label: "User Rating", icon: Star },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="rounded-2xl border border-border/30 p-7 text-center transition-colors hover:border-primary/15 group"
                    style={{
                      background: isDark ? "hsl(var(--card) / 0.4)" : "hsl(var(--card) / 0.7)",
                    }}
                  >
                    <stat.icon size={22} className="text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-extrabold text-foreground tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 font-medium">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────── */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-20">
              <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-[0.25em] mb-4">Pricing</span>
              <h2 className="text-3xl md:text-[3.5rem] font-extrabold tracking-[-0.03em] leading-[1.05] text-foreground">
                Start free.<br />
                <span className="text-muted-foreground">Scale when ready.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$0",
                period: "/forever",
                description: "For getting started",
                features: ["2 Active Accounts", "50 Trades/month", "Basic Reports", "Community Support", "1 Strategy"],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Nova",
                price: "$29",
                period: "/month",
                description: "For serious traders",
                features: ["5 Active Accounts", "Unlimited Trades", "Advanced Reports", "AI Chat (10/day)", "8 Strategies", "Live Trade Tracking", "Platform Integrations"],
                cta: "Start 14-Day Trial",
                highlighted: true,
              },
              {
                name: "Carina",
                price: "$49",
                period: "/month",
                description: "For professionals",
                features: ["12 Active Accounts", "Unlimited Trades", "All Reports + Export", "AI Chat (25/day)", "24 Strategies", "Priority Support", "API Access"],
                cta: "Get Started",
                highlighted: false,
              },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className={`relative rounded-2xl p-8 h-full transition-all ${
                    plan.highlighted
                      ? "border-2 border-primary/30 shadow-[0_8px_60px_-12px_hsl(var(--primary)/0.2)]"
                      : "border border-border/30"
                  }`}
                  style={{
                    background: plan.highlighted
                      ? isDark
                        ? "linear-gradient(180deg, hsl(var(--card)), hsl(var(--background)))"
                        : "linear-gradient(180deg, hsl(var(--card)), hsl(var(--background) / 0.5))"
                      : isDark
                      ? "hsl(var(--card) / 0.4)"
                      : "hsl(var(--card) / 0.7)",
                  }}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold tracking-wide shadow-lg shadow-primary/20">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>

                  <div className="mt-7 mb-8">
                    <span className="text-5xl font-extrabold text-foreground tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                  </div>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className={`w-full h-12 rounded-xl text-sm font-semibold transition-all ${
                      plan.highlighted
                        ? "landing-btn-primary shadow-lg"
                        : "border border-border/40 text-foreground hover:bg-foreground/[0.03] hover:border-foreground/20"
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <div className="mt-8 space-y-3.5">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <Check size={14} className="text-success flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <section id="faq" className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-[0.25em] mb-4">FAQ</span>
              <h2 className="text-3xl md:text-[2.8rem] font-extrabold tracking-[-0.03em] leading-[1.1] text-foreground">
                Questions?<br />
                <span className="text-muted-foreground">We've got answers.</span>
              </h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {[
              { q: "What makes TradeOmen different?", a: "We combine AI-powered analysis, professional risk management, custom dashboards, and seamless broker integrations into one platform. Our AI doesn't just report — it learns your patterns and coaches you." },
              { q: "Which brokers are supported?", a: "MetaTrader 4 & 5, cTrader, TradingView, Binance, and Interactive Brokers with real-time sync. More added monthly." },
              { q: "How does the free trial work?", a: "Full Nova access for 14 days. No credit card. No catches. If you love it, upgrade. If not, stay on Starter free forever." },
              { q: "Is my data secure?", a: "Bank-grade encryption, read-only API connections, SOC 2 compliant infrastructure. We never store broker credentials." },
              { q: "Can I cancel anytime?", a: "Yes. One click. No questions. Your data stays accessible on the free plan." },
            ].map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <FAQItem question={faq.q} answer={faq.a} isDark={isDark} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div
              className="relative rounded-3xl border border-primary/15 p-14 md:p-20 overflow-hidden"
              style={{
                background: isDark
                  ? "linear-gradient(145deg, hsl(var(--card)), hsl(var(--background)))"
                  : "linear-gradient(145deg, hsl(var(--card)), hsl(var(--background) / 0.5))",
              }}
            >
              {/* Ambient glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full"
                  style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.1), transparent 70%)", filter: "blur(60px)" }}
                />
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] text-foreground mb-5">
                  Ready to trade smarter?
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-10 text-[15px]">
                  Join 10,000+ traders who already use TradeOmen to track, analyze, and dominate their markets.
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="landing-btn-primary group h-13 px-10 rounded-2xl text-sm font-semibold inline-flex items-center gap-3 shadow-2xl"
                >
                  Get Started — It's Free
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-border/20 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Zap size={15} className="text-primary-foreground" />
                </div>
                <span className="text-base font-bold text-foreground">TradeOmen</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                The AI-powered trading journal for modern traders. Track, analyze, and elevate your performance.
              </p>
            </div>

            {[
              { title: "Product", links: ["Dashboard", "Strategies", "AI Chat", "Reports", "Pricing"] },
              { title: "Resources", links: ["Help Center", "Changelog", "API Docs", "Community"] },
              { title: "Company", links: ["About", "Careers", "Privacy", "Terms"] },
            ].map((col, i) => (
              <div key={i}>
                <p className="text-xs font-bold text-foreground uppercase tracking-[0.15em] mb-4">{col.title}</p>
                <div className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <a key={j} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground/60">© 2026 TradeOmen. All rights reserved.</p>
            <div className="flex items-center gap-5">
              {["Twitter", "Discord", "Telegram"].map((s, i) => (
                <a key={i} href="#" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── FAQ Accordion ──────────────────────────────────── */
function FAQItem({ question, answer, isDark }: { question: string; answer: string; isDark: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      className={`rounded-2xl border transition-all overflow-hidden ${open ? "border-primary/20" : "border-border/20"}`}
      style={{
        background: isDark ? "hsl(var(--card) / 0.3)" : "hsl(var(--card) / 0.7)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-[15px] font-semibold text-foreground pr-4">{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          className="text-muted-foreground flex-shrink-0 text-xl font-light"
        >
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-0">
          <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
