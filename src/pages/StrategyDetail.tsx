import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { sampleStrategies } from "@/data/strategies";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  DollarSign,
  BarChart3,
  Target,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Circle,
  Activity,
} from "lucide-react";

const sampleLinkedTrades = [
  { id: 1, date: "1/24/2026", symbol: "NVDA", status: "WIN" as const, side: "long", returnAmt: 1694.0, returnPct: 11.0, hold: "4 MIN" },
  { id: 2, date: "1/22/2026", symbol: "GOOGL", status: "WIN" as const, side: "long", returnAmt: 2227.0, returnPct: 25.02, hold: "23 MIN" },
  { id: 3, date: "1/22/2026", symbol: "GOOGL", status: "LOSS" as const, side: "short", returnAmt: -704.0, returnPct: -8.0, hold: "-" },
];

export default function StrategyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "trades">("details");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const strategy = useMemo(() => sampleStrategies.find(s => s.id === id), [id]);

  if (!strategy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">Strategy not found</p>
          <button onClick={() => navigate("/strategies")} className="text-sm text-primary hover:underline">Go back</button>
        </div>
      </div>
    );
  }

  const toggleGroup = (gId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(gId) ? next.delete(gId) : next.add(gId);
      return next;
    });
  };

  const expandAll = () => {
    if (expandedGroups.size === strategy.rules.length) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set(strategy.rules.map(g => g.id)));
    }
  };

  const allExpanded = expandedGroups.size === strategy.rules.length;

  const statusStyles = strategy.status === "active"
    ? "bg-success/12 text-success"
    : strategy.status === "paused"
    ? "bg-primary/12 text-primary"
    : "bg-muted text-muted-foreground";

  const metrics = strategy.metrics;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <DashboardHeader sidebarCollapsed={collapsed} />

      <main className={`transition-all duration-300 p-6 pb-16 ${collapsed ? "ml-[80px]" : "ml-[280px]"}`}>
        {/* Back button */}
        <button onClick={() => navigate("/strategies")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Strategies
        </button>

        {/* Strategy Header */}
        <div className="bg-card rounded-2xl card-boundary p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: `${strategy.color}20` }}>
              {strategy.emoji || "🎯"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">{strategy.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${statusStyles}`}>{strategy.status}</span>
              </div>
              {strategy.description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{strategy.description}</p>}
              <div className="flex items-center gap-4 mt-3">
                {strategy.style && (
                  <span className="text-xs text-muted-foreground bg-secondary/40 px-2.5 py-1 rounded-lg capitalize">{strategy.style}</span>
                )}
                {strategy.assetClasses.map(ac => (
                  <span key={ac} className="text-xs text-muted-foreground bg-secondary/40 px-2.5 py-1 rounded-lg capitalize">{ac}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {(["details", "trades"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "trades" ? `Trades (${sampleLinkedTrades.length})` : "Strategy Detail"}
            </button>
          ))}
        </div>

        {activeTab === "details" && (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Left: Metrics */}
            <div className="xl:col-span-2 space-y-4">
              {/* Win Rate */}
              <div className="bg-card rounded-2xl card-boundary p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">Win Rate</span>
                  <span className={`text-lg font-bold tabular-nums ${metrics.winRate >= 60 ? "text-success" : metrics.winRate >= 40 ? "text-[hsl(38_92%_55%)]" : "text-loss"}`}>
                    {metrics.winRate}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${metrics.winRate}%`,
                      backgroundColor: metrics.winRate >= 60 ? "hsl(var(--success))" : metrics.winRate >= 40 ? "hsl(38 92% 55%)" : "hsl(var(--loss))",
                    }}
                  />
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-card rounded-2xl card-boundary p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <MetricRow icon={DollarSign} label="Net PnL" value={`${metrics.netPnl >= 0 ? "+" : ""}${metrics.netPnl.toFixed(2)}`} color={metrics.netPnl >= 0 ? "text-success" : "text-loss"} />
                  <div className="grid grid-cols-2 gap-4">
                    <MetricRow icon={Activity} label="Total Trades" value={String(metrics.totalTrades)} />
                    <MetricRow icon={BarChart3} label="Profit Factor" value={metrics.profitFactor.toFixed(2)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricRow icon={TrendingUp} label="Avg Winner" value={`+${metrics.avgWin.toFixed(2)}`} color="text-success" />
                    <MetricRow icon={TrendingDown} label="Avg Loser" value={metrics.avgLoss.toFixed(2)} color="text-loss" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Rule Groups */}
            <div className="xl:col-span-3">
              <div className="bg-card rounded-2xl card-boundary p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Strategy Playbook</h3>
                  <button onClick={expandAll} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    {allExpanded ? "Collapse All" : "Expand All"}
                  </button>
                </div>

                <div className="space-y-2">
                  {strategy.rules.map(group => {
                    const isOpen = expandedGroups.has(group.id);
                    return (
                      <div key={group.id} className="border border-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleGroup(group.id)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">{group.name}</span>
                            <span className="text-[11px] font-medium text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">
                              {group.items.length} {group.items.length === 1 ? "rule" : "rules"}
                            </span>
                          </div>
                          {isOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                        </button>
                        {isOpen && group.items.length > 0 && (
                          <div className="border-t border-border px-4 py-3 space-y-2">
                            {group.items.map(item => (
                              <div key={item.id} className="flex items-start gap-2.5">
                                {item.checked ? (
                                  <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" />
                                ) : (
                                  <Circle size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                                )}
                                <span className="text-sm text-foreground leading-relaxed">{item.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {isOpen && group.items.length === 0 && (
                          <div className="border-t border-border px-4 py-4">
                            <p className="text-xs text-muted-foreground italic">No rules defined yet</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "trades" && (
          <div className="space-y-3">
            {sampleLinkedTrades.length > 0 ? (
              sampleLinkedTrades.map(trade => {
                const isWin = trade.status === "WIN";
                return (
                  <div key={trade.id} className="bg-card rounded-xl card-boundary p-4 hover:border-primary/20 transition-colors">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      <div className="w-24 shrink-0">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium text-foreground">{trade.date}</p>
                      </div>
                      <div className="w-20 shrink-0">
                        <p className="text-xs text-muted-foreground">Symbol</p>
                        <p className="text-sm font-semibold text-primary">{trade.symbol}</p>
                      </div>
                      <div className="w-16 shrink-0">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isWin ? "bg-success/15 text-success" : "bg-loss/15 text-loss"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isWin ? "bg-success" : "bg-loss"}`} />
                          {trade.status}
                        </span>
                      </div>
                      <div className="w-14 shrink-0">
                        <p className="text-xs text-muted-foreground">Side</p>
                        <div className="flex items-center gap-1">
                          {trade.side === "long" ? <TrendingUp size={13} className="text-success" /> : <TrendingDown size={13} className="text-loss" />}
                          <span className="text-xs text-foreground capitalize">{trade.side}</span>
                        </div>
                      </div>
                      <div className="w-20 shrink-0">
                        <p className="text-xs text-muted-foreground">Hold</p>
                        {trade.hold !== "-" ? (
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{trade.hold}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </div>
                      <div className="w-28 shrink-0">
                        <p className="text-xs text-muted-foreground">Return</p>
                        <p className={`text-sm font-bold ${isWin ? "text-success" : "text-loss"}`}>
                          {isWin ? "+" : ""}${Math.abs(trade.returnAmt).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="w-20 shrink-0">
                        <p className="text-xs text-muted-foreground">Return %</p>
                        <p className={`text-sm font-semibold ${isWin ? "text-success" : "text-loss"}`}>
                          {trade.returnPct > 0 ? "+" : ""}{trade.returnPct.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <Target size={40} className="text-muted-foreground mx-auto mb-4 opacity-40" />
                <p className="text-foreground font-semibold mb-1">No linked trades</p>
                <p className="text-sm text-muted-foreground">Trades using this strategy will appear here.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function MetricRow({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-secondary/40 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-bold ${color || "text-foreground"}`}>{value}</p>
      </div>
    </div>
  );
}
