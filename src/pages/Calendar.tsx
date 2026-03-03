import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { sampleTrades } from "@/data/trades";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";

// Build trade map from sample data
type DayTrade = { pnl: number; wins: number; losses: number; tradeIds: string[]; symbols: string[] };
const tradesByDate: Record<string, DayTrade> = {};
sampleTrades.forEach((t) => {
  const dateKey = t.entryDate.split("T")[0];
  if (!tradesByDate[dateKey]) {
    tradesByDate[dateKey] = { pnl: 0, wins: 0, losses: 0, tradeIds: [], symbols: [] };
  }
  tradesByDate[dateKey].pnl += t.netPnl;
  tradesByDate[dateKey].tradeIds.push(t.id);
  tradesByDate[dateKey].symbols.push(t.symbol);
  if (t.netPnl >= 0) tradesByDate[dateKey].wins++;
  else tradesByDate[dateKey].losses++;
});

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { day: number; inMonth: boolean; dateStr: string }[] = [];
  for (let i = startDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    cells.push({ day: d, inMonth: false, dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }
  while (cells.length < 42) {
    const d = cells.length - startDay - daysInMonth + 1;
    const m = month + 2 > 12 ? 1 : month + 2;
    const y = month + 2 > 12 ? year + 1 : year;
    cells.push({ day: d, inMonth: false, dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }
  return cells;
}

function getHeatmapColor(pnl: number) {
  if (pnl > 2000) return "bg-success/40 border-success/50";
  if (pnl > 0) return "bg-success/20 border-success/30";
  if (pnl < -500) return "bg-loss/40 border-loss/50";
  if (pnl < 0) return "bg-loss/20 border-loss/30";
  return "";
}

function formatPnl(v: number) {
  const prefix = v >= 0 ? "+$" : "-$";
  return `${prefix}${Math.abs(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function getTodayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

function getMonthSummary(year: number, month: number) {
  let totalPnl = 0, totalWins = 0, totalLosses = 0;
  Object.entries(tradesByDate).forEach(([date, trade]) => {
    const d = new Date(date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      totalPnl += trade.pnl;
      totalWins += trade.wins;
      totalLosses += trade.losses;
    }
  });
  return { totalPnl, totalWins, totalLosses, hasTrades: totalWins + totalLosses > 0 };
}

// ─── Compact Month Card (Year View) ───
function MonthCard({ year, month, onClick, isCurrentMonth }: { year: number; month: number; onClick: () => void; isCurrentMonth: boolean }) {
  const cells = getMonthDays(year, month);
  const summary = getMonthSummary(year, month);
  const todayStr = getTodayStr();

  return (
    <button
      onClick={onClick}
      className={cn(
        "card-boundary rounded-2xl bg-card p-4 text-left transition-all duration-200 cursor-pointer group hover:border-primary/30",
        isCurrentMonth && "ring-1 ring-primary/40"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {MONTHS[month]}
        </h3>
      </div>

      {summary.hasTrades && (
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("text-xs font-bold", summary.totalPnl >= 0 ? "text-success" : "text-loss")}>
            {formatPnl(summary.totalPnl)}
          </span>
          <span className="text-[10px] text-text-secondary">{summary.totalWins} Wins</span>
        </div>
      )}
      {!summary.hasTrades && <div className="h-5 mb-2" />}

      {/* Mini calendar grid */}
      <div className="grid grid-cols-7 gap-px">
        {DAYS.map((d) => (
          <div key={d} className="text-[8px] text-text-secondary text-center font-medium pb-0.5">{d}</div>
        ))}
        {cells.slice(0, 42).map((cell, i) => {
          const trade = tradesByDate[cell.dateStr];
          return (
            <div
              key={i}
              className={cn(
                "aspect-square flex items-center justify-center text-[9px] rounded transition-colors",
                !cell.inMonth && "text-text-disabled/30",
                cell.inMonth && !trade && "text-text-secondary",
                cell.inMonth && trade && cn(getHeatmapColor(trade.pnl), "font-semibold"),
                cell.dateStr === todayStr && cell.inMonth && "ring-1 ring-primary text-primary font-bold"
              )}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </button>
  );
}

// ─── Expanded Month Detail View ───
function MonthDetail({ year, month, onBack }: { year: number; month: number; onBack: () => void }) {
  const navigate = useNavigate();
  const cells = getMonthDays(year, month);
  const summary = getMonthSummary(year, month);
  const todayStr = getTodayStr();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selectedTrade = selectedDate ? tradesByDate[selectedDate] : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Back + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-foreground">{MONTHS[month]} {year}</h2>
          {summary.hasTrades && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn("text-sm font-bold", summary.totalPnl >= 0 ? "text-success" : "text-loss")}>
                {formatPnl(summary.totalPnl)}
              </span>
              <span className="text-xs text-text-secondary">
                {summary.totalWins} Wins · {summary.totalLosses} Losses
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-6 flex-col xl:flex-row">
        {/* Calendar grid */}
        <div className="flex-1 card-boundary rounded-2xl bg-card p-5">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-xs font-semibold text-text-secondary text-center py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-2">
            {cells.slice(0, 42).map((cell, i) => {
              const trade = tradesByDate[cell.dateStr];
              const selected = selectedDate === cell.dateStr;
              return (
                <div
                  key={i}
                  onClick={() => cell.inMonth && setSelectedDate(cell.dateStr)}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all relative border border-transparent",
                    !cell.inMonth && "text-muted-foreground/25 cursor-default",
                    cell.inMonth && !trade && "text-muted-foreground hover:bg-secondary/50 cursor-pointer",
                    cell.inMonth && trade && cn(getHeatmapColor(trade.pnl), "cursor-pointer hover:scale-105"),
                    cell.dateStr === todayStr && cell.inMonth && "ring-2 ring-primary font-bold text-primary",
                    selected && "ring-2 ring-primary scale-105"
                  )}
                >
                  {cell.day}
                  {cell.inMonth && trade && (
                    <span className={cn("text-[10px] font-bold", trade.pnl >= 0 ? "text-success" : "text-loss")}>
                      {formatPnl(trade.pnl)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-divider">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-success/40" />
              <span className="text-[10px] text-text-secondary">Big Win</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-success/20" />
              <span className="text-[10px] text-text-secondary">Win</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-loss/20" />
              <span className="text-[10px] text-text-secondary">Loss</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-loss/40" />
              <span className="text-[10px] text-text-secondary">Big Loss</span>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-full xl:w-80 space-y-4 shrink-0">
          {/* Trade detail card */}
          <div className="card-boundary rounded-2xl bg-card p-5">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">
              {selectedTrade ? `Trade on ${selectedDate}` : "Select a day"}
            </h4>
            {selectedTrade ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">P&L</span>
                  <div className="flex items-center gap-1.5">
                    {selectedTrade.pnl >= 0 ? <TrendingUp size={14} className="text-success" /> : <TrendingDown size={14} className="text-loss" />}
                    <span className={cn("text-lg font-bold", selectedTrade.pnl >= 0 ? "text-success" : "text-loss")}>
                      {formatPnl(selectedTrade.pnl)}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-divider" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Wins</span>
                  <span className="text-sm font-semibold text-success">{selectedTrade.wins}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Losses</span>
                  <span className="text-sm font-semibold text-loss">{selectedTrade.losses}</span>
                </div>
                {/* Link to trades */}
                <div className="pt-2 space-y-1.5">
                  {selectedTrade.tradeIds.map((id, idx) => (
                    <button
                      key={id}
                      onClick={() => navigate(`/trades/${id}`)}
                      className="w-full text-left text-xs px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium">{selectedTrade.symbols[idx]}</span>
                      <ChevronRight size={12} className="text-text-secondary" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-secondary">Click on a date with trades to see details.</p>
            )}
          </div>

          {/* Monthly stats */}
          <div className="card-boundary rounded-2xl bg-card p-5 space-y-3">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Monthly Stats</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Total P&L</span>
              <span className={cn("text-sm font-bold", summary.totalPnl >= 0 ? "text-success" : "text-loss")}>
                {formatPnl(summary.totalPnl)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Win Rate</span>
              <span className="text-sm font-semibold text-foreground">
                {summary.totalWins + summary.totalLosses > 0
                  ? `${Math.round((summary.totalWins / (summary.totalWins + summary.totalLosses)) * 100)}%`
                  : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Total Trades</span>
              <span className="text-sm font-semibold text-foreground">{summary.totalWins + summary.totalLosses}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ───
const CalendarPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [year, setYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const today = new Date();

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 p-6 pb-16 ${sidebarCollapsed ? "ml-[80px]" : "ml-[280px]"}`}>
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Calendar</h1>
          <p className="text-xs text-text-secondary mt-0.5">Visualize your trading activity across the year</p>
        </div>

        {selectedMonth !== null ? (
          <MonthDetail year={year} month={selectedMonth} onBack={() => setSelectedMonth(null)} />
        ) : (
          <>
            {/* Year navigation */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <button
                onClick={() => setYear((y) => y - 1)}
                className="w-9 h-9 rounded-xl bg-card card-boundary flex items-center justify-center text-text-secondary hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-2xl font-bold text-primary tabular-nums">{year}</span>
              <button
                onClick={() => setYear((y) => y + 1)}
                className="w-9 h-9 rounded-xl bg-card card-boundary flex items-center justify-center text-text-secondary hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 mb-5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-success/40" />
                <span className="text-[10px] text-text-secondary">Big Win (&gt;$2k)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-success/20" />
                <span className="text-[10px] text-text-secondary">Win</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-loss/20" />
                <span className="text-[10px] text-text-secondary">Loss</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-loss/40" />
                <span className="text-[10px] text-text-secondary">Big Loss (&gt;$500)</span>
              </div>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {MONTHS.map((_, i) => (
                <MonthCard
                  key={i}
                  year={year}
                  month={i}
                  onClick={() => setSelectedMonth(i)}
                  isCurrentMonth={year === today.getFullYear() && i === today.getMonth()}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CalendarPage;
