import { TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";

interface MetricCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function MetricCard({ title, children, className = "" }: MetricCardProps) {
  return (
    <div className={`bg-card rounded-lg p-6 card-boundary min-h-[162px] ${className}`}>
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function WinRateCard() {
  const data = [{ value: 0 }, { value: 100 }];
  return (
    <MetricCard title="Win Rate">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-foreground">0</span>
            <span className="text-sm text-text-secondary">Trades</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown size={14} className="text-loss" />
            <span className="text-sm text-text-secondary">0 Trades</span>
          </div>
        </div>
        <div className="relative w-20 h-20">
          <PieChart width={80} height={80}>
            <Pie
              data={data}
              cx={35}
              cy={35}
              innerRadius={25}
              outerRadius={35}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="hsl(var(--text-secondary))" />
              <Cell fill="hsl(var(--secondary))" />
            </Pie>
          </PieChart>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-foreground">
            0%
          </span>
        </div>
      </div>
    </MetricCard>
  );
}

export function PnLCard() {
  return (
    <MetricCard title="PnL">
      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-bold text-foreground">0</span>
        <span className="text-sm text-text-secondary">Net</span>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <TrendingDown size={14} className="text-success" />
        <span className="text-sm text-text-secondary">0 Gross</span>
      </div>
    </MetricCard>
  );
}

export function AccountBalanceCard() {
  return (
    <MetricCard title="Account Balance">
      <span className="text-[28px] font-bold text-foreground">0</span>
      <div className="flex items-center gap-1 mt-2">
        <TrendingDown size={14} className="text-success" />
        <span className="text-sm text-text-secondary">+0 Net PnL</span>
      </div>
    </MetricCard>
  );
}

export function TradeCountCard() {
  return (
    <MetricCard title="Trade Count">
      <span className="text-[28px] font-bold text-foreground">0</span>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1">
          <TrendingUp size={14} className="text-success" />
          <span className="text-sm text-foreground">0</span>
          <span className="text-sm text-text-secondary">Trades</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingDown size={14} className="text-loss" />
          <span className="text-sm text-foreground">0</span>
          <span className="text-sm text-text-secondary">Trades</span>
        </div>
      </div>
    </MetricCard>
  );
}

export function ProfitFactorCard() {
  return (
    <MetricCard title="Profit Factor">
      <span className="text-[28px] font-bold text-foreground">0</span>
      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-1">
          <TrendingUp size={14} className="text-success" />
          <span className="text-sm text-text-secondary">0</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingDown size={14} className="text-loss" />
          <span className="text-sm text-text-secondary">0</span>
        </div>
      </div>
    </MetricCard>
  );
}

export function VolumeCard() {
  return (
    <MetricCard title="Volume">
      <span className="text-[28px] font-bold text-foreground">0</span>
      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-1">
          <TrendingUp size={14} className="text-success" />
          <span className="text-sm text-text-secondary">0</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingDown size={14} className="text-loss" />
          <span className="text-sm text-text-secondary">0</span>
        </div>
      </div>
    </MetricCard>
  );
}

export function AvgHoldingTimeCard() {
  return (
    <MetricCard title="Average Holding Time">
      <span className="text-[28px] font-bold text-primary">0s</span>
      <div className="space-y-1 mt-2">
        <div className="flex items-center gap-1">
          <TrendingDown size={14} className="text-success" />
          <span className="text-sm text-text-secondary">0s</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingDown size={14} className="text-loss" />
          <span className="text-sm text-text-secondary">0s</span>
        </div>
      </div>
    </MetricCard>
  );
}

export function StreakCard() {
  return (
    <MetricCard title="Streak">
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center">
          <span className="text-[28px] font-bold text-success">0</span>
          <span className="text-sm text-text-secondary ml-1">Day</span>
        </div>
        <div className="text-center">
          <span className="text-[28px] font-bold text-success">0</span>
          <span className="text-sm text-text-secondary ml-1">Trade</span>
        </div>
        <div className="text-center">
          <span className="text-[28px] font-bold text-loss">0</span>
          <span className="text-sm text-text-secondary ml-1">Day</span>
        </div>
        <div className="text-center">
          <span className="text-[28px] font-bold text-loss">0</span>
          <span className="text-sm text-text-secondary ml-1">Trade</span>
        </div>
      </div>
    </MetricCard>
  );
}
