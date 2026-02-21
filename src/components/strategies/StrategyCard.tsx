import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Strategy } from "@/types/strategy";

function WinRateBar({ rate }: { rate: number }) {
  const barColor = rate >= 60 ? "hsl(var(--success))" : rate >= 40 ? "hsl(38 92% 55%)" : "hsl(var(--loss))";
  return (
    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${rate}%`, backgroundColor: barColor }} />
    </div>
  );
}

function StatRow({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  const isColored = positive !== undefined;
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-semibold tabular-nums ${isColored ? (positive ? "text-success" : "text-loss") : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

interface StrategyCardProps {
  strategy: Strategy;
  onEdit: (s: Strategy) => void;
  onDelete: (s: Strategy) => void;
}

export default function StrategyCard({ strategy, onEdit, onDelete }: StrategyCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const winRateTextColor = strategy.metrics.winRate >= 60 ? "text-success" : strategy.metrics.winRate >= 40 ? "text-[hsl(38_92%_55%)]" : "text-loss";
  const statusStyles = strategy.status === "active"
    ? "bg-success/12 text-success"
    : strategy.status === "paused"
    ? "bg-primary/12 text-primary"
    : "bg-muted text-muted-foreground";

  return (
    <div className="group relative bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: `${strategy.color}20` }}>
            {strategy.emoji || "🎯"}
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${statusStyles}`}>
            {strategy.status}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-card border border-border rounded-xl card-boundary py-1 w-36 z-20">
              <button onClick={() => { navigate(`/strategies/${strategy.id}`); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary transition-colors">
                <Eye size={13} /> View Details
              </button>
              <button onClick={() => { onEdit(strategy); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary transition-colors">
                <Pencil size={13} /> Edit
              </button>
              <button onClick={() => { onDelete(strategy); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-loss hover:bg-loss/10 transition-colors">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Name + description */}
      <div className="cursor-pointer" onClick={() => navigate(`/strategies/${strategy.id}`)}>
        <h3 className="text-base font-semibold text-foreground mb-1">{strategy.name}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{strategy.description}</p>
      </div>

      {/* Win Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Win Rate</span>
          <span className={`text-sm font-bold tabular-nums ${winRateTextColor}`}>{strategy.metrics.winRate}%</span>
        </div>
        <WinRateBar rate={strategy.metrics.winRate} />
      </div>

      <div className="h-px bg-border" />

      {/* Stats */}
      <div className="space-y-0.5">
        <StatRow label="Trades" value={String(strategy.metrics.totalTrades)} />
        <StatRow
          label="Net PnL"
          value={strategy.metrics.netPnl >= 0 ? `+${strategy.metrics.netPnl.toFixed(2)}` : strategy.metrics.netPnl.toFixed(2)}
          positive={strategy.metrics.netPnl >= 0}
        />
        <StatRow label="Profit Factor" value={strategy.metrics.profitFactor.toFixed(2)} />
        <StatRow label="Avg Win" value={`+${strategy.metrics.avgWin.toFixed(2)}`} positive={true} />
        <StatRow label="Avg Loss" value={strategy.metrics.avgLoss.toFixed(2)} positive={false} />
      </div>
    </div>
  );
}
