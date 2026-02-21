export type StrategyStatus = "active" | "paused" | "archived";
export type TradingStyle = "scalping" | "day-trading" | "swing" | "position";
export type AssetClass = "forex" | "stocks" | "crypto" | "futures" | "options";

export interface StrategyRuleItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface StrategyRuleGroup {
  id: string;
  name: string;
  items: StrategyRuleItem[];
}

export interface StrategyMetrics {
  totalTrades: number;
  winRate: number;
  netPnl: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
}

export interface Strategy {
  id: string;
  name: string;
  description?: string;
  status: StrategyStatus;
  emoji?: string;
  color: string;
  style?: TradingStyle;
  assetClasses: AssetClass[];
  trackMissedTrades: boolean;
  rules: StrategyRuleGroup[];
  metrics: StrategyMetrics;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_RULE_GROUPS: StrategyRuleGroup[] = [
  { id: "entry", name: "Entry Conditions", items: [] },
  { id: "exit", name: "Exit Conditions", items: [] },
  { id: "risk", name: "Risk Management", items: [] },
];

export const STRATEGY_COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#ef4444", "#06b6d4", "#f97316",
];

export const STRATEGY_EMOJIS = [
  "🎯", "⚡", "🔥", "💎", "🚀", "📊", "🧠", "🦈",
  "🐂", "🐻", "⭐", "🏆", "💰", "📈", "🎲", "🛡️",
];
