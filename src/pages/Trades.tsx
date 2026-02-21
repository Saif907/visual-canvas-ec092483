import { useState, useMemo } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Table2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Search,
  SlidersHorizontal,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Target,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Sample trade data ──────────────────────────────────────
interface Trade {
  id: number;
  date: string;
  symbol: string;
  status: "WIN" | "LOSS";
  side: "long" | "short";
  qty: number;
  entry: number;
  exit: number;
  entryTotal: number;
  exitTotal: number;
  hold: string;
  returnAmt: number;
  returnPct: number;
}

const sampleTrades: Trade[] = [
  { id: 1, date: "1/24/2026", symbol: "NVDA", status: "WIN", side: "long", qty: 22, entry: 700.0, exit: 777.0, entryTotal: 15400.0, exitTotal: 17094.0, hold: "4 MIN", returnAmt: 1694.0, returnPct: 11.0 },
  { id: 2, date: "1/22/2026", symbol: "GOOGL", status: "WIN", side: "long", qty: 28, entry: 317.857, exit: 397.5, entryTotal: 8900.0, exitTotal: 11130.0, hold: "23 MIN", returnAmt: 2227.0, returnPct: 25.02 },
  { id: 3, date: "1/22/2026", symbol: "GOOGL", status: "LOSS", side: "short", qty: 22, entry: 400.0, exit: 432.0, entryTotal: 8800.0, exitTotal: 9504.0, hold: "-", returnAmt: -704.0, returnPct: -8.0 },
  { id: 4, date: "1/8/2026", symbol: "TSLA", status: "LOSS", side: "short", qty: 34, entry: 25000.0, exit: 23000.0, entryTotal: 850000.0, exitTotal: 782000.0, hold: "9 DAYS", returnAmt: -68014.0, returnPct: -8.0 },
];

// ── Metric summary card ────────────────────────────────────
function TradeMetricCard({
  icon: Icon,
  iconBg,
  title,
  subtitle,
  value,
  valueColor,
}: {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  subtitle: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-card rounded-xl p-5 card-boundary flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={22} className="text-inherit" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-text-secondary">{subtitle}</p>
        <p className={`text-lg font-bold mt-0.5 ${valueColor || "text-foreground"}`}>{value}</p>
      </div>
    </div>
  );
}

// ── Trade row card (split style from image 1) ──────────────
function TradeRowCard({ trade }: { trade: Trade }) {
  const isWin = trade.status === "WIN";
  return (
    <div className="bg-card rounded-xl card-boundary p-4 hover:border-primary/20 transition-colors">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* Date */}
        <div className="w-24 shrink-0">
          <p className="text-xs text-text-secondary">Date</p>
          <p className="text-sm font-medium text-foreground">{trade.date}</p>
        </div>

        {/* Symbol */}
        <div className="w-20 shrink-0">
          <p className="text-xs text-text-secondary">Symbol</p>
          <p className="text-sm font-semibold text-primary">{trade.symbol}</p>
        </div>

        {/* Status */}
        <div className="w-16 shrink-0">
          <p className="text-xs text-text-secondary">Status</p>
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              isWin
                ? "bg-success/15 text-success"
                : "bg-loss/15 text-loss"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isWin ? "bg-success" : "bg-loss"}`} />
            {trade.status}
          </span>
        </div>

        {/* Side */}
        <div className="w-14 shrink-0">
          <p className="text-xs text-text-secondary">Side</p>
          <div className="flex items-center gap-1">
            {trade.side === "long" ? (
              <TrendingUp size={13} className="text-success" />
            ) : (
              <TrendingDown size={13} className="text-loss" />
            )}
            <span className="text-xs text-foreground capitalize">{trade.side}</span>
          </div>
        </div>

        {/* Qty */}
        <div className="w-12 shrink-0">
          <p className="text-xs text-text-secondary">Qty</p>
          <p className="text-sm text-foreground">{trade.qty}</p>
        </div>

        {/* Entry */}
        <div className="w-24 shrink-0">
          <p className="text-xs text-text-secondary">Entry</p>
          <p className="text-sm text-foreground">${trade.entry.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Exit */}
        <div className="w-24 shrink-0">
          <p className="text-xs text-text-secondary">Exit</p>
          <p className="text-sm text-foreground">${trade.exit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Hold */}
        <div className="w-20 shrink-0">
          <p className="text-xs text-text-secondary">Hold</p>
          {trade.hold !== "-" ? (
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {trade.hold}
            </span>
          ) : (
            <span className="text-sm text-text-secondary">-</span>
          )}
        </div>

        {/* Return */}
        <div className="w-28 shrink-0">
          <p className="text-xs text-text-secondary">Return</p>
          <p className={`text-sm font-bold ${isWin ? "text-success" : "text-loss"}`}>
            {isWin ? "+" : ""}${trade.returnAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Return % */}
        <div className="w-20 shrink-0">
          <p className="text-xs text-text-secondary">Return %</p>
          <p className={`text-sm font-semibold ${isWin ? "text-success" : "text-loss"}`}>
            {trade.returnPct > 0 ? "+" : ""}{trade.returnPct.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function Trades() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState("25");
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = parseInt(rowsPerPage);

  const filteredTrades = useMemo(() => {
    if (!searchQuery.trim()) return sampleTrades;
    const q = searchQuery.toLowerCase();
    return sampleTrades.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.date.includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTrades.length / perPage));
  const paginatedTrades = filteredTrades.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Compute metrics
  const totalVolume = sampleTrades.reduce((s, t) => s + t.qty, 0);
  const wins = sampleTrades.filter((t) => t.status === "WIN");
  const losses = sampleTrades.filter((t) => t.status === "LOSS");
  const winRate = sampleTrades.length > 0 ? ((wins.length / sampleTrades.length) * 100).toFixed(1) : "0";
  const netPnl = sampleTrades.reduce((s, t) => s + t.returnAmt, 0);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <DashboardHeader sidebarCollapsed={collapsed} />

      <main
        className={`transition-all duration-300 p-6 pb-16 ${
          collapsed ? "ml-[80px]" : "ml-[280px]"
        }`}
      >
        {/* Page title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Table2 size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Trades</h1>
            <p className="text-sm text-muted-foreground mt-0.5">View and manage your closed trades</p>
          </div>
        </div>

        {/* ── Metric cards row (from image 2) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          <TradeMetricCard
            icon={BarChart3}
            iconBg="bg-primary/15 text-primary"
            title="Volume"
            subtitle={`${sampleTrades.length} trades`}
            value={totalVolume.toString()}
          />
          <TradeMetricCard
            icon={TrendingUp}
            iconBg="bg-success/15 text-success"
            title="WIN"
            subtitle={`${wins.length} trades`}
            value={wins.reduce((s, t) => s + t.returnAmt, 0).toLocaleString()}
            valueColor="text-success"
          />
          <TradeMetricCard
            icon={TrendingDown}
            iconBg="bg-loss/15 text-loss"
            title="LOSS"
            subtitle={`${losses.length} trades`}
            value={Math.abs(losses.reduce((s, t) => s + t.returnAmt, 0)).toLocaleString()}
            valueColor="text-loss"
          />
          <TradeMetricCard
            icon={Target}
            iconBg="bg-primary/15 text-primary"
            title="Win Rate"
            subtitle={`${wins.length} Win`}
            value={`${winRate}%`}
          />
          <TradeMetricCard
            icon={DollarSign}
            iconBg={netPnl >= 0 ? "bg-success/15 text-success" : "bg-loss/15 text-loss"}
            title="Net PnL"
            subtitle={`${sampleTrades.length} trades`}
            value={`${netPnl >= 0 ? "" : "-"}$${Math.abs(netPnl).toLocaleString()}`}
            valueColor={netPnl >= 0 ? "text-success" : "text-loss"}
          />
        </div>

        {/* ── Toolbar: Columns, Filter, Export, Search (from image 2) ── */}
        <div className="bg-card rounded-xl card-boundary p-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-secondary/60 hover:text-foreground transition-colors">
                <SlidersHorizontal size={15} />
                <span className="hidden sm:inline">Columns</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-secondary/60 hover:text-foreground transition-colors">
                <Filter size={15} />
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-secondary/60 hover:text-foreground transition-colors">
                <Download size={15} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>

            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 rounded-lg bg-secondary/40 border border-border text-sm text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary/40 w-48 sm:w-64 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ── Trade rows (split card style from image 1) ── */}
        <div className="space-y-3 mb-6">
          {paginatedTrades.length > 0 ? (
            paginatedTrades.map((trade) => (
              <TradeRowCard key={trade.id} trade={trade} />
            ))
          ) : (
            <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <Table2 size={40} className="text-muted-foreground mb-4 opacity-40" />
              <p className="text-foreground font-semibold mb-1">No trades found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {filteredTrades.length > 0 && (
          <div className="bg-card rounded-xl card-boundary p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Rows per page */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">Rows per page</span>
                <Select
                  value={rowsPerPage}
                  onValueChange={(v) => {
                    setRowsPerPage(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20 h-8 text-xs bg-secondary/40 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page info and nav */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">
                  {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredTrades.length)} of {filteredTrades.length}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-foreground hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-foreground hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
