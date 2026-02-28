import { AssetClass } from "./strategy";

export type ExecutionSide = "buy" | "sell";
export type TradeDirection = "long" | "short";
export type TradeStatus = "open" | "closed" | "breakeven";
export type TradeEmotion = "confident" | "fearful" | "greedy" | "neutral" | "revenge" | "fomo";

export interface Execution {
  id: string;
  tradeId: string;
  date: string;
  side: ExecutionSide;
  price: number;
  quantity: number;
  fees: number;
  notes?: string;
}

export interface StrategyChecklist {
  strategyId: string;
  /** rule item id -> checked */
  checkedRules: Record<string, boolean>;
}

export interface Trade {
  id: string;
  symbol: string;
  direction: TradeDirection;
  assetClass: AssetClass;
  status: TradeStatus;

  // Executions
  executions: Execution[];
  totalExecutions: number;

  // Aggregates
  avgEntryPrice: number;
  avgExitPrice?: number;
  netQuantity: number;
  plannedQuantity: number;
  peakQuantity: number;
  totalBuyValue: number;
  totalSellValue: number;
  investedAmount: number;

  // Financials
  grossPnl: number;
  realizedPnl: number;
  totalFees: number;
  netPnl: number;
  returnPercent?: number;

  // Risk
  initialStopLoss?: number;
  takeProfitTarget?: number;
  riskAmount?: number;
  plannedRR?: number;
  riskMultiple?: number;

  // Advanced performance
  mae?: number;
  mfe?: number;
  profitCapture?: number;
  holdingPeriodReturn?: number;
  profitVelocity?: number;

  // Execution quality
  totalSlippage?: number;
  executionScore?: number;

  // Psychology
  tags: string[];
  notes?: string;
  screenshots: string[];
  emotion?: TradeEmotion;
  mistakes?: string[];
  disciplineScore?: number;

  // Strategy link
  strategyChecklist?: StrategyChecklist;

  // Time
  entryDate: string;
  exitDate?: string;
  durationSeconds?: number;

  // Meta
  source: "MANUAL" | "IMPORT" | "API";
  createdAt: string;
  updatedAt: string;
}

export const TRADE_EMOTIONS: { value: TradeEmotion; label: string; emoji: string }[] = [
  { value: "confident", label: "Confident", emoji: "😎" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "fearful", label: "Fearful", emoji: "😰" },
  { value: "greedy", label: "Greedy", emoji: "🤑" },
  { value: "revenge", label: "Revenge", emoji: "😤" },
  { value: "fomo", label: "FOMO", emoji: "😱" },
];
