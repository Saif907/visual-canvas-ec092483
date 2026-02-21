import { Strategy } from "@/types/strategy";

export const sampleStrategies: Strategy[] = [
  {
    id: "1",
    name: "Market Structure",
    description: "Identifying market structural changes and entering at key break of structure points.",
    status: "active",
    emoji: "🎯",
    color: "#3b82f6",
    style: "day-trading",
    assetClasses: ["stocks"],
    trackMissedTrades: false,
    rules: [
      {
        id: "entry",
        name: "Entry Conditions",
        items: [
          { id: "e1", text: "Wait for BOS on 15m timeframe", checked: false },
          { id: "e2", text: "Confirm with volume spike > 1.5x avg", checked: false },
          { id: "e3", text: "Price must be above 20 EMA", checked: false },
        ],
      },
      {
        id: "exit",
        name: "Exit Conditions",
        items: [
          { id: "x1", text: "Take profit at next supply zone", checked: false },
          { id: "x2", text: "Trail stop below last swing low", checked: false },
        ],
      },
      {
        id: "risk",
        name: "Risk Management",
        items: [
          { id: "r1", text: "Max 2% risk per trade", checked: false },
          { id: "r2", text: "Max 3 trades per day", checked: false },
        ],
      },
    ],
    metrics: { totalTrades: 33, winRate: 72.7, netPnl: 28028.23, profitFactor: 15.17, avgWin: 1250.25, avgLoss: -219.75 },
    createdAt: "2026-01-10",
    updatedAt: "2026-02-20",
  },
  {
    id: "2",
    name: "Supply and Demand",
    description: "Identifying price zones with strong reactions and entering at high-probability reversal areas.",
    status: "active",
    emoji: "📊",
    color: "#8b5cf6",
    style: "swing",
    assetClasses: ["forex", "stocks"],
    trackMissedTrades: true,
    rules: [
      {
        id: "entry",
        name: "Entry Conditions",
        items: [
          { id: "e1", text: "Identify fresh demand/supply zone on H4", checked: false },
          { id: "e2", text: "Wait for rejection candle at zone", checked: false },
        ],
      },
      {
        id: "exit",
        name: "Exit Conditions",
        items: [
          { id: "x1", text: "Target opposite zone", checked: false },
        ],
      },
      {
        id: "risk",
        name: "Risk Management",
        items: [
          { id: "r1", text: "Stop loss below/above zone", checked: false },
        ],
      },
    ],
    metrics: { totalTrades: 22, winRate: 45.5, netPnl: -95.13, profitFactor: 0.63, avgWin: 16.13, avgLoss: -21.37 },
    createdAt: "2026-01-15",
    updatedAt: "2026-02-18",
  },
  {
    id: "3",
    name: "Elliott Wave",
    description: "Counting 5-wave impulse and 3-wave corrective patterns, waiting for high-confluence entries.",
    status: "paused",
    emoji: "⚡",
    color: "#06b6d4",
    style: "swing",
    assetClasses: ["crypto"],
    trackMissedTrades: false,
    rules: [
      {
        id: "entry",
        name: "Entry Conditions",
        items: [
          { id: "e1", text: "Identify completed Wave 2 or Wave 4", checked: false },
          { id: "e2", text: "Fibonacci retracement 50-61.8%", checked: false },
        ],
      },
      {
        id: "exit",
        name: "Exit Conditions",
        items: [
          { id: "x1", text: "Wave 3 or 5 projection target", checked: false },
        ],
      },
      {
        id: "risk",
        name: "Risk Management",
        items: [
          { id: "r1", text: "Invalidation below Wave 1 start", checked: false },
        ],
      },
    ],
    metrics: { totalTrades: 19, winRate: 68.4, netPnl: 1148.64, profitFactor: 10.24, avgWin: 97.92, avgLoss: -20.72 },
    createdAt: "2026-01-20",
    updatedAt: "2026-02-15",
  },
  {
    id: "4",
    name: "Harmonic Patterns",
    description: "Calculating precise Fibonacci ratios of patterns and entering at PRZ completion zones.",
    status: "archived",
    emoji: "💎",
    color: "#ec4899",
    style: "day-trading",
    assetClasses: ["futures"],
    trackMissedTrades: false,
    rules: [
      {
        id: "entry",
        name: "Entry Conditions",
        items: [
          { id: "e1", text: "Identify Gartley, Bat, or Butterfly pattern", checked: false },
          { id: "e2", text: "D-leg completion at PRZ", checked: false },
        ],
      },
      {
        id: "exit",
        name: "Exit Conditions",
        items: [
          { id: "x1", text: "38.2% retracement of AD leg", checked: false },
        ],
      },
      {
        id: "risk",
        name: "Risk Management",
        items: [
          { id: "r1", text: "Max 1.5% risk per trade", checked: false },
        ],
      },
    ],
    metrics: { totalTrades: 13, winRate: 15.4, netPnl: -99.72, profitFactor: 0.75, avgWin: 153.21, avgLoss: -36.92 },
    createdAt: "2026-02-01",
    updatedAt: "2026-02-10",
  },
];
