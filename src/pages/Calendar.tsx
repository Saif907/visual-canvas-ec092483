import { useState, useMemo } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { sampleTrades } from "@/data/trades";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, ArrowLeft, Calendar as CalendarIcon, Activity, DollarSign, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface DaySummary {
  date: string;
  trades: typeof sampleTrades;
  netPnl: number;
  wins: number;
  losses: number;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { day: number; inMonth: boolean; date: string }[] = [];

  for (let i = startDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    cells.push({ day: d, inMonth: false, date: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, date: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }

  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const m = month === 11 ? 0 : month + 1;
      const y = month === 11 ? year + 1 : year;
      cells.push({ day: d, inMonth: false, date: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
    }
  }

  return cells;
}

function buildTradeMap(trades: typeof sampleTrades) {
  const map: Record<string, DaySummary> = {};
  trades.forEach((t) => {
    const dateKey = t.entryDate.split("T")[0];
    if (!map[dateKey]) {
      map[dateKey] = { date: dateKey, trades: [], netPnl: 0, wins: 0, losses: 0 };
    }
    map[dateKey].trades.push(t);
    map[dateKey].netPnl += t.netPnl;
    if (t.netPnl >= 0) map[dateKey].wins++;
    else map[dateKey].losses++;
  });
  return map;
}

function getHeatColor(pnl: number): string {
  if (pnl > 1000) return "bg-success/30 border-success/40";
  if (pnl > 0) return "bg-success/15 border-success/25";
  if (pnl < -500) return "bg-loss/30 border-loss/40";
  if (pnl < 0) return "bg-loss/15 border-loss/25";
  return "";
}

function formatPnl(v: number) {
  const prefix = v >= 0 ? "+$" : "-$";
  return `${prefix}${Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// ─── Monthly Summary Card (Year View) ───
function MonthCard({
  year, month, tradeMap, onSelect,
}: {
  year: number; month: number; tradeMap: Record<string, DaySummary>; onSelect: () => void;
}) {
  const cells = getMonthDays(year, month);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Monthly aggregates
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthEntries = Object.entries(tradeMap).filter(([k]) => k.startsWith(monthPrefix));
  const monthPnl = monthEntries.reduce((s, [, v]) => s + v.netPnl, 0);
  const monthTrades = monthEntries.reduce((s, [, v]) => s + v.trades.length, 0);
  const monthWins = monthEntries.reduce((s, [, v]) => s + v.wins, 0);

  return (
    <button
      onClick={onSelect}
      className="card-boundary rounded-2xl bg-card p-4 hover:border-primary/30 transition-all duration-200 cursor-pointer text-left group"
    >
      {/* Month Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{MONTHS[month]}</h3>
        {monthTrades > 0 && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${monthPnl >= 0 ? "bg-success/15 text-success" : "bg-loss/15 text-loss"}`}>
            {formatPnl(monthPnl)}
          </span>
        )}
      </div>

      {/* Mini stats */}
      {monthTrades > 0 && (
        <div className="flex gap-3 mb-3 text-[10px] text-text-secondary">
          <span>{monthTrades} trade{monthTrades > 1 ? "s" : ""}</span>
          <span className="text-success">{monthWins}W</span>
          <span className="text-loss">{monthTrades - monthWins}L</span>
        </div>
      )}

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-[9px] text-text-secondary text-center font-medium">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-px">
        {cells.map((cell, i) => {
          const summary = tradeMap[cell.date];
          const isToday = cell.date === todayStr;
          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center text-[10px] rounded-md transition-colors
                ${!cell.inMonth ? "text-text-disabled/40" : "text-text-secondary"}
                ${isToday ? "ring-1 ring-primary text-primary font-bold" : ""}
                ${cell.inMonth && summary ? getHeatColor(summary.netPnl) : ""}
              `}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </button>
  );
}

// ─── Expanded Month View ───
function MonthDetail({
  year, month, tradeMap, onBack,
}: {
  year: number; month: number; tradeMap: Record<string, DaySummary>; onBack: () => void;
}) {
  const navigate = useNavigate();
  const cells = getMonthDays(year, month);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthEntries = Object.entries(tradeMap).filter(([k]) => k.startsWith(monthPrefix));
  const monthPnl = monthEntries.reduce((s, [, v]) => s + v.netPnl, 0);
  const monthTrades = monthEntries.reduce((s, [, v]) => s + v.trades.length, 0);
  const monthWins = monthEntries.reduce((s, [, v]) => s + v.wins, 0);
  const tradingDays = monthEntries.length;
  const winRate = monthTrades > 0 ? ((monthWins / monthTrades) * 100).toFixed(0) : "0";
  const bestDay = monthEntries.length ? monthEntries.reduce((best, [, v]) => (v.netPnl > best.netPnl ? v : best), monthEntries[0][1]) : null;
  const worstDay = monthEntries.length ? monthEntries.reduce((worst, [, v]) => (v.netPnl < worst.netPnl ? v : worst), monthEntries[0][1]) : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Back + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-foreground">{MONTHS[month]} {year}</h2>
          <p className="text-xs text-text-secondary">{tradingDays} trading day{tradingDays !== 1 ? "s" : ""} · {monthTrades} trade{monthTrades !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard icon={DollarSign} label="Net P&L" value={formatPnl(monthPnl)} positive={monthPnl >= 0} />
        <SummaryCard icon={Target} label="Win Rate" value={`${winRate}%`} positive={Number(winRate) >= 50} />
        <SummaryCard icon={TrendingUp} label="Best Day" value={bestDay ? formatPnl(bestDay.netPnl) : "—"} positive />
        <SummaryCard icon={TrendingDown} label="Worst Day" value={worstDay ? formatPnl(worstDay.netPnl) : "—"} positive={false} />
      </div>

      {/* Large Calendar */}
      <div className="card-boundary rounded-2xl bg-card p-6">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-xs font-semibold text-text-secondary text-center py-1">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell, i) => {
            const summary = tradeMap[cell.date];
            const isToday = cell.date === todayStr;
            const hasTrades = cell.inMonth && summary;

            return (
              <div
                key={i}
                onClick={() => hasTrades && navigate(`/trades`)}
                className={`relative min-h-[80px] rounded-xl p-2 transition-all duration-150 border
                  ${!cell.inMonth ? "opacity-30 border-transparent" : "border-transparent"}
                  ${isToday ? "ring-1 ring-primary/60" : ""}
                  ${hasTrades ? `${getHeatColor(summary.netPnl)} cursor-pointer hover:scale-[1.03]` : "hover:bg-secondary/30"}
                `}
              >
                <span className={`text-xs font-medium ${isToday ? "text-primary font-bold" : cell.inMonth ? "text-foreground" : "text-text-disabled"}`}>
                  {cell.day}
                </span>

                {hasTrades && (
                  <div className="mt-1.5 space-y-0.5">
                    <p className={`text-[11px] font-bold ${summary.netPnl >= 0 ? "text-success" : "text-loss"}`}>
                      {formatPnl(summary.netPnl)}
                    </p>
                    <p className="text-[9px] text-text-secondary">
                      {summary.trades.length} trade{summary.trades.length > 1 ? "s" : ""}
                    </p>
                    <div className="flex gap-0.5 mt-1 flex-wrap">
                      {summary.trades.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className={`text-[8px] px-1 py-px rounded font-medium ${t.netPnl >= 0 ? "bg-success/20 text-success" : "bg-loss/20 text-loss"}`}
                        >
                          {t.symbol}
                        </span>
                      ))}
                      {summary.trades.length > 3 && (
                        <span className="text-[8px] text-text-secondary">+{summary.trades.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Day-by-day breakdown */}
      {monthEntries.length > 0 && (
        <div className="card-boundary rounded-2xl bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity size={14} className="text-primary" />
            Daily Breakdown
          </h3>
          <div className="space-y-2">
            {monthEntries
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([dateKey, summary]) => {
                const d = new Date(dateKey + "T00:00:00");
                const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
                const dayNum = d.getDate();
                return (
                  <div
                    key={dateKey}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-secondary/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex flex-col items-center justify-center">
                      <span className="text-[9px] text-text-secondary font-medium leading-none">{dayName}</span>
                      <span className="text-sm font-bold text-foreground leading-tight">{dayNum}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {summary.trades.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => navigate(`/trades/${t.id}`)}
                            className={`text-xs px-2 py-0.5 rounded-md font-medium hover:opacity-80 transition-opacity ${t.netPnl >= 0 ? "bg-success/15 text-success" : "bg-loss/15 text-loss"}`}
                          >
                            {t.symbol} {formatPnl(t.netPnl)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${summary.netPnl >= 0 ? "text-success" : "text-loss"}`}>
                        {formatPnl(summary.netPnl)}
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        {summary.wins}W {summary.losses}L
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, positive }: { icon: React.ElementType; label: string; value: string; positive: boolean }) {
  return (
    <div className="card-boundary rounded-xl bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-text-secondary" />
        <span className="text-xs text-text-secondary">{label}</span>
      </div>
      <p className={`text-lg font-bold ${positive ? "text-success" : "text-loss"}`}>{value}</p>
    </div>
  );
}

// ─── Main Page ───
export default function CalendarPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [year, setYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const tradeMap = useMemo(() => buildTradeMap(sampleTrades), []);

  // Year stats
  const yearPrefix = `${year}`;
  const yearEntries = Object.entries(tradeMap).filter(([k]) => k.startsWith(yearPrefix));
  const yearPnl = yearEntries.reduce((s, [, v]) => s + v.netPnl, 0);
  const yearTrades = yearEntries.reduce((s, [, v]) => s + v.trades.length, 0);
  const yearWins = yearEntries.reduce((s, [, v]) => s + v.wins, 0);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 p-6 pb-16 ${sidebarCollapsed ? "ml-[80px]" : "ml-[280px]"}`}>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CalendarIcon size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Calendar</h1>
              <p className="text-xs text-text-secondary">Visual overview of your trading activity</p>
            </div>
          </div>
        </div>

        {selectedMonth === null ? (
          /* ─── Year View ─── */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Year navigation + stats */}
            <div className="card-boundary rounded-2xl bg-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setYear(year - 1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-secondary transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-2xl font-bold text-primary tabular-nums">{year}</h2>
                <button onClick={() => setYear(year + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-secondary transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>

              {yearTrades > 0 && (
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-text-secondary text-xs">P&L</p>
                    <p className={`font-bold ${yearPnl >= 0 ? "text-success" : "text-loss"}`}>{formatPnl(yearPnl)}</p>
                  </div>
                  <div className="w-px h-8 bg-divider" />
                  <div className="text-center">
                    <p className="text-text-secondary text-xs">Trades</p>
                    <p className="font-bold text-foreground">{yearTrades}</p>
                  </div>
                  <div className="w-px h-8 bg-divider" />
                  <div className="text-center">
                    <p className="text-text-secondary text-xs">Win Rate</p>
                    <p className="font-bold text-foreground">{yearTrades > 0 ? ((yearWins / yearTrades) * 100).toFixed(0) : 0}%</p>
                  </div>
                </div>
              )}
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center justify-end gap-3 text-[10px] text-text-secondary">
              <span>Loss</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded bg-loss/30" />
                <div className="w-3 h-3 rounded bg-loss/15" />
                <div className="w-3 h-3 rounded bg-secondary/30" />
                <div className="w-3 h-3 rounded bg-success/15" />
                <div className="w-3 h-3 rounded bg-success/30" />
              </div>
              <span>Profit</span>
            </div>

            {/* 12-month grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }, (_, m) => (
                <MonthCard key={m} year={year} month={m} tradeMap={tradeMap} onSelect={() => setSelectedMonth(m)} />
              ))}
            </div>
          </div>
        ) : (
          /* ─── Month Detail ─── */
          <MonthDetail year={year} month={selectedMonth} tradeMap={tradeMap} onBack={() => setSelectedMonth(null)} />
        )}
      </main>
    </div>
  );
}
