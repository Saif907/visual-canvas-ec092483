import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import StrategyCard from "@/components/strategies/StrategyCard";
import AddStrategyModal from "@/components/strategies/AddStrategyModal";
import DeleteStrategyDialog from "@/components/strategies/DeleteStrategyDialog";
import { sampleStrategies } from "@/data/strategies";
import { Strategy } from "@/types/strategy";
import {
  Plus,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";

export default function Strategies() {
  const [collapsed, setCollapsed] = useState(false);
  const [strategies, setStrategies] = useState<Strategy[]>(sampleStrategies);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStrategy, setEditStrategy] = useState<Strategy | null>(null);
  const [deleteStrategy, setDeleteStrategy] = useState<Strategy | null>(null);

  const totalPnl = strategies.reduce((acc, s) => acc + s.metrics.netPnl, 0);
  const avgWinRate = strategies.length > 0 ? strategies.reduce((acc, s) => acc + s.metrics.winRate, 0) / strategies.length : 0;
  const totalTrades = strategies.reduce((acc, s) => acc + s.metrics.totalTrades, 0);

  const handleSave = (strategy: Strategy) => {
    setStrategies(prev => {
      const idx = prev.findIndex(s => s.id === strategy.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = strategy;
        return next;
      }
      return [...prev, strategy];
    });
    setEditStrategy(null);
  };

  const handleDelete = () => {
    if (deleteStrategy) {
      setStrategies(prev => prev.filter(s => s.id !== deleteStrategy.id));
      setDeleteStrategy(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <DashboardHeader sidebarCollapsed={collapsed} />

      <main className={`transition-all duration-300 pt-6 pb-16 px-6 ${collapsed ? "ml-[80px]" : "ml-[280px]"}`}>
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Strategies</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track and manage your trading strategies</p>
          </div>
          <button
            onClick={() => { setEditStrategy(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
          >
            <Plus size={16} /> Add Strategy
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-5 card-boundary">
            <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Total PnL</p>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold tabular-nums ${totalPnl >= 0 ? "text-success" : "text-loss"}`}>
                {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(2)}
              </span>
              {totalPnl >= 0 ? <ArrowUpRight size={18} className="text-success mb-0.5" /> : <ArrowDownRight size={18} className="text-loss mb-0.5" />}
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 card-boundary">
            <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Avg Win Rate</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold tabular-nums text-foreground">{avgWinRate.toFixed(1)}%</span>
              <TrendingUp size={18} className="text-primary mb-0.5" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 card-boundary">
            <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Total Trades</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold tabular-nums text-foreground">{totalTrades}</span>
              <Activity size={18} className="text-primary mb-0.5" />
            </div>
          </div>
        </div>

        {/* Strategy cards grid */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Your Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {strategies.map(s => (
              <StrategyCard
                key={s.id}
                strategy={s}
                onEdit={(st) => { setEditStrategy(st); setModalOpen(true); }}
                onDelete={setDeleteStrategy}
              />
            ))}
          </div>
        </div>
      </main>

      <AddStrategyModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditStrategy(null); }}
        onSave={handleSave}
        editStrategy={editStrategy}
      />
      <DeleteStrategyDialog
        open={!!deleteStrategy}
        strategy={deleteStrategy}
        onClose={() => setDeleteStrategy(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
