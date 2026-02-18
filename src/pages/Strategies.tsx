import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Plus,
  TrendingUp,
  MoreHorizontal,
  Zap,
  Activity,
  Target,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";



const strategies = [
  {
    id: 1,
    name: "Market Structure",
    description: "Identifying market structural changes and entering at key break of structure points.",
    trend: "In Trend",
    trendPositive: true,
    winRate: 72.7,
    winRateColor: "success",
    trades: 33,
    netPnl: 28028.23,
    profitFactor: 15.17,
    avgWin: 1250.25,
    avgLoss: -219.75,
    icon: Activity,
    iconColor: "hsl(var(--primary))",
  },
  {
    id: 2,
    name: "Supply and Demand",
    description: "Identifying price zones with strong reactions and entering at high-probability reversal areas.",
    trend: "In Trend",
    trendPositive: true,
    winRate: 45.5,
    winRateColor: "warning",
    trades: 22,
    netPnl: -95.13,
    profitFactor: 0.63,
    avgWin: 16.13,
    avgLoss: -21.37,
    icon: BarChart2,
    iconColor: "hsl(var(--primary))",
  },
  {
    id: 3,
    name: "Elliott Wave",
    description: "Counting 5-wave impulse and 3-wave corrective patterns, waiting for high-confluence entries.",
    trend: "In Trend",
    trendPositive: true,
    winRate: 68.4,
    winRateColor: "success",
    trades: 19,
    netPnl: 1148.64,
    profitFactor: 10.24,
    avgWin: 97.92,
    avgLoss: -20.72,
    icon: Zap,
    iconColor: "hsl(var(--primary))",
  },
  {
    id: 4,
    name: "Harmonic Patterns",
    description: "Calculating precise Fibonacci ratios of patterns and entering at PRZ completion zones.",
    trend: "Against Trend",
    trendPositive: false,
    winRate: 15.4,
    winRateColor: "loss",
    trades: 13,
    netPnl: -99.72,
    profitFactor: 0.75,
    avgWin: 153.21,
    avgLoss: -36.92,
    icon: Target,
    iconColor: "hsl(var(--primary))",
  },
];

function WinRateBar({ rate, color }: { rate: number; color: string }) {
  const barColor =
    color === "success"
      ? "hsl(var(--success))"
      : color === "warning"
      ? "hsl(38 92% 55%)"
      : "hsl(var(--loss))";

  return (
    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${rate}%`, backgroundColor: barColor }}
      />
    </div>
  );
}

function StatRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  const isColored = positive !== undefined;
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`text-xs font-semibold tabular-nums ${
          isColored
            ? positive
              ? "text-[hsl(var(--success))]"
              : "text-[hsl(var(--loss))]"
            : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StrategyCard({ strategy }: { strategy: (typeof strategies)[0] }) {
  const Icon = strategy.icon;
  const winRateTextColor =
    strategy.winRateColor === "success"
      ? "text-[hsl(var(--success))]"
      : strategy.winRateColor === "warning"
      ? "text-[hsl(38_92%_55%)]"
      : "text-[hsl(var(--loss))]";

  return (
    <div className="group relative bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon size={18} style={{ color: strategy.iconColor }} />
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
              strategy.trendPositive
                ? "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]"
                : "bg-[hsl(var(--loss)/0.12)] text-[hsl(var(--loss))]"
            }`}
          >
            {strategy.trend}
          </span>
        </div>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal size={15} />
        </button>
      </div>

      {/* Name + description */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">{strategy.name}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {strategy.description}
        </p>
      </div>

      {/* Win Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Win Rate</span>
          <span className={`text-sm font-bold tabular-nums ${winRateTextColor}`}>
            {strategy.winRate}%
          </span>
        </div>
        <WinRateBar rate={strategy.winRate} color={strategy.winRateColor} />
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Stats */}
      <div className="space-y-0.5">
        <StatRow label="Trades" value={String(strategy.trades)} />
        <StatRow
          label="Net PnL"
          value={strategy.netPnl >= 0 ? `+${strategy.netPnl.toFixed(2)}` : strategy.netPnl.toFixed(2)}
          positive={strategy.netPnl >= 0}
        />
        <StatRow label="Profit Factor" value={strategy.profitFactor.toFixed(2)} />
        <StatRow label="Avg Win" value={`+${strategy.avgWin.toFixed(2)}`} positive={true} />
        <StatRow label="Avg Loss" value={strategy.avgLoss.toFixed(2)} positive={false} />
      </div>
    </div>
  );
}

export default function Strategies() {
  const [collapsed, setCollapsed] = useState(false);

  const totalPnl = strategies.reduce((acc, s) => acc + s.netPnl, 0);
  const avgWinRate =
    strategies.reduce((acc, s) => acc + s.winRate, 0) / strategies.length;
  const totalTrades = strategies.reduce((acc, s) => acc + s.trades, 0);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <DashboardHeader sidebarCollapsed={collapsed} />

      <main
        className={`transition-all duration-300 pt-6 pb-16 px-6 ${
          collapsed ? "ml-[80px]" : "ml-[280px]"
        }`}
      >
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Strategies</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track and manage your trading strategies
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
            <Plus size={16} />
            Add Strategy
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Total PnL</p>
            <div className="flex items-end gap-2">
              <span
                className={`text-2xl font-bold tabular-nums ${
                  totalPnl >= 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--loss))]"
                }`}
              >
                {totalPnl >= 0 ? "+" : ""}
                {totalPnl.toFixed(2)}
              </span>
              {totalPnl >= 0 ? (
                <ArrowUpRight size={18} className="text-[hsl(var(--success))] mb-0.5" />
              ) : (
                <ArrowDownRight size={18} className="text-[hsl(var(--loss))] mb-0.5" />
              )}
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Avg Win Rate</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold tabular-nums text-foreground">
                {avgWinRate.toFixed(1)}%
              </span>
              <TrendingUp size={18} className="text-primary mb-0.5" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Total Trades</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold tabular-nums text-foreground">{totalTrades}</span>
              <Activity size={18} className="text-primary mb-0.5" />
            </div>
          </div>
        </div>

        {/* Strategy cards grid */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Your Strategies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {strategies.map((s) => (
              <StrategyCard key={s.id} strategy={s} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
