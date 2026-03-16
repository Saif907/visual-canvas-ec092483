import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Zap, TrendingUp, Shield, BarChart3, Brain, Target,
  ArrowRight, ChevronRight, Star, Check, Moon, Sun,
  LineChart, Layers, Globe, Lock, Cpu, Sparkles,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   TradeOmen — Landing Page
   ═══════════════════════════════════════════════════════════ */

export default function Landing() {
  const navigate = useNavigate();
  const { resolvedMode, setMode } = useTheme();
  const isDark = resolvedMode === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "dark" : "light"} bg-background text-foreground overflow-x-hidden`}>
      {/* ── Ambient background ─────────────────────────── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: isDark
              ? `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(199 92% 48% / 0.08), transparent),
                 radial-gradient(ellipse 60% 40% at 80% 100%, hsl(262 83% 58% / 0.05), transparent),
                 radial-gradient(ellipse 40% 30% at 10% 60%, hsl(145 63% 49% / 0.03), transparent)`
              : `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(199 92% 48% / 0.06), transparent),
                 radial-gradient(ellipse 60% 40% at 80% 100%, hsl(262 83% 58% / 0.03), transparent)`,
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(hsl(0 0% 100% / 0.06) 1px, transparent 1px),
                 linear-gradient(90deg, hsl(0 0% 100% / 0.06) 1px, transparent 1px)`
              : `linear-gradient(hsl(0 0% 0% / 0.04) 1px, transparent 1px),
                 linear-gradient(90deg, hsl(0 0% 0% / 0.04) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ── Navigation ─────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap size={18} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Trade<span className="text-primary">Omen</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#analytics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Analytics</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode(isDark ? "light" : "dark")}
              className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden sm:flex h-9 px-4 items-center rounded-lg text-sm font-medium border border-border/60 text-foreground hover:bg-muted transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="h-9 px-5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative pt-20 pb-28 md:pt-32 md:pb-40">
        {/* Floating orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, hsl(199 92% 48% / ${isDark ? "0.06" : "0.04"}), transparent 70%)`,
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-primary">Now in Public Beta</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            <span className="block text-foreground">
              Master Your Trades
            </span>
            <span className="block mt-2">
              <span className="text-muted-foreground font-light">with </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))`,
                }}
              >
                TradeOmen
              </span>
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
            The most advanced trading journal and analytics platform.
            Track, analyze, and elevate your performance with AI-powered insights
            and professional-grade risk management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="group h-12 px-8 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              Start 14 Days Free Trial
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="h-12 px-8 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted transition-all flex items-center gap-2">
              Watch Demo
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Trusted by traders worldwide</p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {[
                  "bg-gradient-to-br from-blue-400 to-blue-600",
                  "bg-gradient-to-br from-emerald-400 to-emerald-600",
                  "bg-gradient-to-br from-amber-400 to-amber-600",
                  "bg-gradient-to-br from-violet-400 to-violet-600",
                  "bg-gradient-to-br from-rose-400 to-rose-600",
                ].map((bg, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-background flex items-center justify-center text-[10px] font-bold text-white`}>
                    {["A", "M", "J", "S", "K"][i]}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-1.5">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dashboard Preview ─────────────────────────── */}
      <section className="relative pb-20 md:pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="relative rounded-2xl border border-border/60 overflow-hidden shadow-2xl"
            style={{
              background: isDark
                ? "linear-gradient(145deg, hsl(212 22% 13%), hsl(213 22% 10%))"
                : "linear-gradient(145deg, hsl(0 0% 99%), hsl(0 0% 96%))",
            }}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/40">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
              </div>
              <span className="text-xs text-muted-foreground ml-2 font-mono">tradeomen.app/dashboard</span>
            </div>

            {/* Mock dashboard grid */}
            <div className="p-6 grid grid-cols-4 gap-4">
              {/* Metric cards row */}
              {[
                { label: "Total P&L", value: "$12,847.32", change: "+18.2%", positive: true },
                { label: "Win Rate", value: "68.5%", change: "+2.1%", positive: true },
                { label: "Total Trades", value: "142", change: "This month", positive: true },
                { label: "Best Trade", value: "+$2,300", change: "XAUUSD", positive: true },
              ].map((metric, i) => (
                <div key={i} className="rounded-xl border border-border/40 p-4" style={{ background: isDark ? "hsl(212 22% 15% / 0.6)" : "hsl(0 0% 100% / 0.8)" }}>
                  <p className="text-[11px] text-muted-foreground mb-1">{metric.label}</p>
                  <p className={`text-lg font-bold ${metric.positive ? "text-success" : "text-loss"}`}>{metric.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{metric.change}</p>
                </div>
              ))}

              {/* Chart area */}
              <div className="col-span-3 rounded-xl border border-border/40 p-5 h-48" style={{ background: isDark ? "hsl(212 22% 15% / 0.6)" : "hsl(0 0% 100% / 0.8)" }}>
                <p className="text-xs font-medium text-foreground mb-3">Portfolio Growth</p>
                <div className="h-32 flex items-end gap-1.5">
                  {[35, 42, 38, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 92, 88, 95, 90, 98, 82, 88, 94, 100, 96, 105].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t transition-all"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(180deg, hsl(var(--primary) / ${0.7 + (h / 400)}), hsl(var(--primary) / 0.15))`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Side panel */}
              <div className="rounded-xl border border-border/40 p-4 h-48" style={{ background: isDark ? "hsl(212 22% 15% / 0.6)" : "hsl(0 0% 100% / 0.8)" }}>
                <p className="text-xs font-medium text-foreground mb-3">Recent</p>
                <div className="space-y-2.5">
                  {[
                    { symbol: "XAUUSD", pnl: "+$2,300", win: true },
                    { symbol: "BTCUSDT", pnl: "+$485", win: true },
                    { symbol: "EURUSD", pnl: "-$125", win: false },
                    { symbol: "AAPL", pnl: "+$97", win: true },
                  ].map((trade, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-foreground">{trade.symbol}</span>
                      <span className={`text-[11px] font-semibold ${trade.win ? "text-success" : "text-loss"}`}>{trade.pnl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom fade */}
            <div
              className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{
                background: `linear-gradient(transparent, hsl(var(--background)))`,
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Everything You Need to
              <span className="text-muted-foreground font-light"> Win</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Professional-grade tools designed for serious traders who demand precision and insight.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Get intelligent insights on your trading patterns, risk exposure, and strategy performance with our AI assistant.",
                accent: "from-violet-500 to-purple-600",
              },
              {
                icon: LineChart,
                title: "Live Trade Monitoring",
                description: "Real-time trade tracking with custom gauges, instant P&L updates, and automated risk alerts.",
                accent: "from-emerald-500 to-teal-600",
              },
              {
                icon: BarChart3,
                title: "Advanced Reporting",
                description: "Comprehensive reports covering strategies, discipline metrics, session analysis, and performance breakdowns.",
                accent: "from-blue-500 to-cyan-600",
              },
              {
                icon: Shield,
                title: "Risk Management",
                description: "Professional-grade risk controls with position sizing, max drawdown limits, and automated safety alerts.",
                accent: "from-amber-500 to-orange-600",
              },
              {
                icon: Target,
                title: "Strategy Tracking",
                description: "Track unlimited strategies with individual win rates, profit factors, expectancy, and trend analysis.",
                accent: "from-rose-500 to-pink-600",
              },
              {
                icon: Layers,
                title: "Custom Dashboards",
                description: "Build your perfect workspace with drag-and-drop widgets, multiple layouts, and personalized views.",
                accent: "from-cyan-500 to-blue-600",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-border/50 p-7 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
                style={{
                  background: isDark
                    ? "hsl(212 22% 13% / 0.5)"
                    : "hsl(0 0% 100% / 0.7)",
                }}
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform`}>
                  <feature.icon size={20} className="text-white" />
                </div>

                <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Analytics Showcase ────────────────────────── */}
      <section id="analytics" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Advanced Analytics</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-6">
                Data-Driven <br />
                <span className="text-muted-foreground font-light">Trading Decisions</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Transform raw trade data into actionable intelligence. Our analytics engine processes every trade
                to reveal patterns, optimize strategies, and accelerate your growth as a trader.
              </p>

              <div className="space-y-5">
                {[
                  { icon: Cpu, label: "AI Pattern Recognition", desc: "Detect recurring setups automatically" },
                  { icon: Globe, label: "Multi-Market Support", desc: "Forex, Crypto, Stocks, Futures" },
                  { icon: Lock, label: "Bank-Grade Security", desc: "End-to-end encryption for all data" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "10K+", label: "Active Traders", icon: TrendingUp },
                { value: "2.5M", label: "Trades Analyzed", icon: BarChart3 },
                { value: "99.9%", label: "Uptime", icon: Zap },
                { value: "4.9★", label: "User Rating", icon: Star },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/50 p-6 text-center transition-all hover:border-primary/20"
                  style={{
                    background: isDark
                      ? "hsl(212 22% 13% / 0.5)"
                      : "hsl(0 0% 100% / 0.7)",
                  }}
                >
                  <stat.icon size={20} className="text-primary mx-auto mb-3" />
                  <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Integrations ──────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Integrations</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Seamless Trading <span className="text-muted-foreground font-light">Ecosystem</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">
            Connect TradeOmen with your favorite platforms for automatic data synchronization.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {["MetaTrader 4", "MetaTrader 5", "cTrader", "TradingView", "Binance"].map((platform, i) => (
              <div
                key={i}
                className="h-14 px-6 rounded-xl border border-border/50 flex items-center gap-3 transition-all hover:border-primary/30 hover:shadow-md"
                style={{
                  background: isDark ? "hsl(212 22% 13% / 0.5)" : "hsl(0 0% 100% / 0.7)",
                }}
              >
                <Globe size={18} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{platform}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Check size={14} className="text-success" /> Real-time sync</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-success" /> Secure API access</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-success" /> One-click setup</span>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────── */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Simple, Transparent <span className="text-muted-foreground font-light">Pricing</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                period: "",
                description: "Perfect for beginners",
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
                cta: "Start Free Trial",
                highlighted: true,
              },
              {
                name: "Carina",
                price: "$49",
                period: "/month",
                description: "For professional traders",
                features: ["12 Active Accounts", "Unlimited Trades", "All Reports + Export", "AI Chat (25/day)", "24 Strategies", "Priority Support", "API Access"],
                cta: "Get Started",
                highlighted: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border p-8 transition-all ${
                  plan.highlighted
                    ? "border-primary/40 shadow-xl shadow-primary/10 scale-[1.02]"
                    : "border-border/50"
                }`}
                style={{
                  background: plan.highlighted
                    ? isDark
                      ? "linear-gradient(145deg, hsl(212 22% 15%), hsl(213 22% 12%))"
                      : "linear-gradient(145deg, hsl(0 0% 100%), hsl(0 0% 97%))"
                    : isDark
                    ? "hsl(212 22% 13% / 0.5)"
                    : "hsl(0 0% 100% / 0.7)",
                }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    Most Popular
                  </div>
                )}

                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>

                <div className="mt-6 mb-8">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                  {plan.name === "Nova" && (
                    <p className="text-xs text-primary mt-1">14 Days Free Trial</p>
                  )}
                </div>

                <button
                  onClick={() => navigate("/dashboard")}
                  className={`w-full h-11 rounded-xl text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {plan.cta}
                </button>

                <div className="mt-8 space-y-3">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2.5">
                      <Check size={14} className="text-success flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <section id="faq" className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Frequently Asked <span className="text-muted-foreground font-light">Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What makes TradeOmen different from other trading journals?",
                a: "TradeOmen combines AI-powered analysis, professional risk management, custom dashboards, and seamless broker integrations into one unified platform. Our AI assistant provides personalized trading guidance based on your actual data.",
              },
              {
                q: "Which brokers and platforms are supported?",
                a: "We support MetaTrader 4, MetaTrader 5, cTrader, and TradingView with real-time data synchronization. More integrations are added regularly.",
              },
              {
                q: "How does the 14-day free trial work?",
                a: "Start with full Nova plan access for 14 days — no credit card required. If you love it, choose a plan. If not, you can continue with our free Starter plan.",
              },
              {
                q: "Is my trading data secure?",
                a: "Absolutely. We use bank-grade encryption, read-only API connections, and never store your broker credentials. Your data is yours — always.",
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel anytime with no questions asked. Your data remains accessible on the free plan.",
              },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            className="rounded-3xl border border-primary/20 p-12 md:p-16 relative overflow-hidden"
            style={{
              background: isDark
                ? "linear-gradient(145deg, hsl(212 22% 14%), hsl(213 22% 10%))"
                : "linear-gradient(145deg, hsl(0 0% 100%), hsl(0 0% 96%))",
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.08), transparent 60%)`,
            }} />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                Ready to Transform Your Trading?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Join thousands of traders who use TradeOmen to track, analyze, and improve their performance every day.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="group h-12 px-8 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20 inline-flex items-center gap-2"
              >
                Start Your Free Trial
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-border/40 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Zap size={14} className="text-primary-foreground" />
                </div>
                <span className="text-sm font-bold text-foreground">TradeOmen</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional trading analytics for modern traders.
              </p>
            </div>

            {[
              { title: "Product", links: ["Dashboard", "Strategies", "AI Chat", "Reports", "Pricing"] },
              { title: "Resources", links: ["Help Center", "Changelog", "API Docs", "Community", "Blog"] },
              { title: "Company", links: ["About", "Careers", "Contact", "Privacy", "Terms"] },
            ].map((col, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-foreground mb-4">{col.title}</p>
                <div className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <a key={j} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 TradeOmen. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {["Twitter", "Discord", "Telegram", "Reddit"].map((social, i) => (
                <a key={i} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── FAQ Accordion Item ─────────────────────────────── */
function FAQItem({ question, answer, isDark }: { question: string; answer: string; isDark: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`rounded-xl border transition-all ${open ? "border-primary/30" : "border-border/50"}`}
      style={{
        background: isDark ? "hsl(212 22% 13% / 0.5)" : "hsl(0 0% 100% / 0.7)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-sm font-semibold text-foreground pr-4">{question}</span>
        <span className={`text-muted-foreground transition-transform flex-shrink-0 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
