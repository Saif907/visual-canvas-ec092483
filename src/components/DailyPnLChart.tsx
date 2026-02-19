import { useState } from "react";
import { TrendingUp, BarChart3 } from "lucide-react";

export default function DailyPnLChart() {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [pnlType, setPnlType] = useState<"net" | "gross">("net");
  const [tab, setTab] = useState<"daily" | "cumulative">("daily");

  return (
    <div className="bg-card rounded-lg p-6 card-boundary">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <h3 className="text-base font-semibold text-foreground">Daily PnL</h3>
          <span className="text-base font-semibold text-foreground">0</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType("line")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              chartType === "line" ? "bg-secondary text-foreground" : "text-text-secondary hover:text-foreground"
            }`}
          >
            <TrendingUp size={18} />
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              chartType === "bar" ? "bg-secondary text-foreground" : "text-text-secondary hover:text-foreground"
            }`}
          >
            <BarChart3 size={18} />
          </button>
          <div className="flex ml-2">
            <button
              onClick={() => setPnlType("net")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pnlType === "net"
                  ? "bg-foreground text-background"
                  : "text-text-secondary hover:text-foreground"
              }`}
            >
              Net PnL
            </button>
            <button
              onClick={() => setPnlType("gross")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pnlType === "gross"
                  ? "bg-foreground text-background"
                  : "text-text-secondary hover:text-foreground"
              }`}
            >
              Gross PnL
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => setTab("daily")}
          className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${
            tab === "daily"
              ? "bg-secondary text-foreground"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          Daily PnL
        </button>
        <button
          onClick={() => setTab("cumulative")}
          className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors ${
            tab === "cumulative"
              ? "bg-secondary text-foreground"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          Cumulative Daily PnL
        </button>
      </div>

      {/* Chart placeholder */}
      <div className="h-48 flex items-center justify-center border border-dashed border-divider rounded-lg">
        <p className="text-sm text-text-secondary">No trading data available</p>
      </div>
    </div>
  );
}
