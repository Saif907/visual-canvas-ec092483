import { useState, useMemo } from "react";
import { X, Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, Circle, Clock, CalendarIcon } from "lucide-react";
import { Trade, Execution, TradeDirection, ExecutionSide, TradeEmotion, TRADE_EMOTIONS } from "@/types/trade";
import { AssetClass } from "@/types/strategy";
import { sampleStrategies } from "@/data/strategies";
import { format } from "date-fns";

interface AddTradeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (trade: Trade) => void;
  editTrade?: Trade | null;
}

const ASSET_CLASSES: { value: AssetClass; label: string }[] = [
  { value: "stocks", label: "Stocks" },
  { value: "forex", label: "Forex" },
  { value: "crypto", label: "Crypto" },
  { value: "futures", label: "Futures" },
  { value: "options", label: "Options" },
];

interface ExecutionDraft {
  id: string;
  side: ExecutionSide;
  date: string;
  time: string;
  price: string;
  quantity: string;
  fees: string;
}

function newExecDraft(side: ExecutionSide = "buy"): ExecutionDraft {
  return {
    id: crypto.randomUUID(),
    side,
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    price: "",
    quantity: "",
    fees: "0",
  };
}

export default function AddTradeModal({ open, onClose, onSave, editTrade }: AddTradeModalProps) {
  const isEdit = !!editTrade;

  // Trade-level fields
  const [symbol, setSymbol] = useState(editTrade?.symbol || "");
  const [direction, setDirection] = useState<TradeDirection>(editTrade?.direction || "long");
  const [assetClass, setAssetClass] = useState<AssetClass>(editTrade?.assetClass || "stocks");
  const [stopLoss, setStopLoss] = useState(editTrade?.initialStopLoss?.toString() || "");
  const [takeProfit, setTakeProfit] = useState(editTrade?.takeProfitTarget?.toString() || "");
  const [tags, setTags] = useState(editTrade?.tags?.join(", ") || "");
  const [notes, setNotes] = useState(editTrade?.notes || "");
  const [emotion, setEmotion] = useState<TradeEmotion | "">(editTrade?.emotion || "");

  // Strategy
  const [selectedStrategyId, setSelectedStrategyId] = useState(editTrade?.strategyChecklist?.strategyId || "");
  const [checkedRules, setCheckedRules] = useState<Record<string, boolean>>(editTrade?.strategyChecklist?.checkedRules || {});
  const [strategyExpanded, setStrategyExpanded] = useState(!!editTrade?.strategyChecklist);

  // Executions
  const [executions, setExecutions] = useState<ExecutionDraft[]>(() => {
    if (editTrade?.executions?.length) {
      return editTrade.executions.map(e => ({
        id: e.id,
        side: e.side,
        date: e.date.split("T")[0],
        time: e.date.split("T")[1]?.substring(0, 5) || "09:30",
        price: e.price.toString(),
        quantity: e.quantity.toString(),
        fees: e.fees.toString(),
      }));
    }
    return [newExecDraft("buy")];
  });

  const [activeSection, setActiveSection] = useState<"trade" | "executions" | "strategy">("trade");

  const selectedStrategy = useMemo(() => sampleStrategies.find(s => s.id === selectedStrategyId), [selectedStrategyId]);

  if (!open) return null;

  const addExecution = () => setExecutions(prev => [...prev, newExecDraft("buy")]);

  const updateExec = (id: string, field: keyof ExecutionDraft, value: string) => {
    setExecutions(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeExec = (id: string) => {
    setExecutions(prev => prev.length > 1 ? prev.filter(e => e.id !== id) : prev);
  };

  const toggleRule = (ruleId: string) => {
    setCheckedRules(prev => ({ ...prev, [ruleId]: !prev[ruleId] }));
  };

  const handleSave = () => {
    if (!symbol.trim() || executions.length === 0) return;

    const parsedExecs: Execution[] = executions
      .filter(e => e.price && e.quantity)
      .map(e => ({
        id: e.id,
        tradeId: editTrade?.id || crypto.randomUUID(),
        date: `${e.date}T${e.time}:00`,
        side: e.side,
        price: parseFloat(e.price),
        quantity: parseFloat(e.quantity),
        fees: parseFloat(e.fees) || 0,
      }));

    if (parsedExecs.length === 0) return;

    // Calculate aggregates
    const buys = parsedExecs.filter(e => e.side === "buy");
    const sells = parsedExecs.filter(e => e.side === "sell");
    const totalBuyQty = buys.reduce((s, e) => s + e.quantity, 0);
    const totalSellQty = sells.reduce((s, e) => s + e.quantity, 0);
    const totalBuyValue = buys.reduce((s, e) => s + e.price * e.quantity, 0);
    const totalSellValue = sells.reduce((s, e) => s + e.price * e.quantity, 0);
    const avgEntry = totalBuyQty > 0 ? totalBuyValue / totalBuyQty : 0;
    const avgExit = totalSellQty > 0 ? totalSellValue / totalSellQty : undefined;
    const totalFees = parsedExecs.reduce((s, e) => s + e.fees, 0);
    const grossPnl = direction === "long" ? totalSellValue - totalBuyValue : totalBuyValue - totalSellValue;
    const netPnl = grossPnl - totalFees;
    const invested = direction === "long" ? totalBuyValue : totalSellValue;
    const netQty = direction === "long" ? totalBuyQty - totalSellQty : totalSellQty - totalBuyQty;

    const sorted = [...parsedExecs].sort((a, b) => a.date.localeCompare(b.date));
    const now = new Date().toISOString();

    const sl = parseFloat(stopLoss) || undefined;
    const tp = parseFloat(takeProfit) || undefined;
    let riskAmount: number | undefined;
    if (sl && avgEntry) {
      riskAmount = Math.abs(avgEntry - sl) * (totalBuyQty || totalSellQty);
    }

    const trade: Trade = {
      id: editTrade?.id || crypto.randomUUID(),
      symbol: symbol.trim().toUpperCase(),
      direction,
      assetClass,
      status: netQty === 0 ? "closed" : "open",
      executions: parsedExecs,
      totalExecutions: parsedExecs.length,
      avgEntryPrice: avgEntry,
      avgExitPrice: avgExit,
      netQuantity: netQty,
      plannedQuantity: Math.max(totalBuyQty, totalSellQty),
      peakQuantity: Math.max(totalBuyQty, totalSellQty),
      totalBuyValue,
      totalSellValue,
      investedAmount: invested,
      grossPnl,
      realizedPnl: netQty === 0 ? grossPnl : 0,
      totalFees,
      netPnl,
      returnPercent: invested > 0 ? (netPnl / invested) * 100 : undefined,
      initialStopLoss: sl,
      takeProfitTarget: tp,
      riskAmount,
      plannedRR: riskAmount && tp && avgEntry ? Math.abs(tp - avgEntry) * (totalBuyQty || totalSellQty) / riskAmount : undefined,
      riskMultiple: riskAmount ? netPnl / riskAmount : undefined,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      notes: notes.trim() || undefined,
      screenshots: editTrade?.screenshots || [],
      emotion: emotion || undefined,
      strategyChecklist: selectedStrategyId ? { strategyId: selectedStrategyId, checkedRules } : undefined,
      entryDate: sorted[0]?.date || now,
      exitDate: netQty === 0 ? sorted[sorted.length - 1]?.date : undefined,
      durationSeconds: netQty === 0 && sorted.length >= 2
        ? Math.floor((new Date(sorted[sorted.length - 1].date).getTime() - new Date(sorted[0].date).getTime()) / 1000)
        : undefined,
      source: "MANUAL",
      createdAt: editTrade?.createdAt || now,
      updatedAt: now,
    };

    onSave(trade);
    onClose();
  };

  const sections = [
    { id: "trade" as const, label: "Trade Info" },
    { id: "executions" as const, label: `Executions (${executions.length})` },
    { id: "strategy" as const, label: "Strategy" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden card-boundary mx-4 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border rounded-t-2xl px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-foreground">{isEdit ? "Edit Trade" : "Add Trade"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex items-center border-b border-border px-6 shrink-0">
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                activeSection === sec.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── Trade Info Section ── */}
          {activeSection === "trade" && (
            <div className="space-y-5">
              {/* Symbol + Direction */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Symbol *</label>
                  <input
                    type="text"
                    placeholder="e.g. AAPL"
                    value={symbol}
                    onChange={e => setSymbol(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 uppercase font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Direction</label>
                  <div className="flex items-center gap-2">
                    {(["long", "short"] as TradeDirection[]).map(d => (
                      <button
                        key={d}
                        onClick={() => setDirection(d)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors ${
                          direction === d
                            ? d === "long" ? "bg-success/15 text-success border border-success/30" : "bg-loss/15 text-loss border border-loss/30"
                            : "bg-secondary/40 text-muted-foreground border border-border hover:text-foreground"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Asset Class */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Asset Class</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {ASSET_CLASSES.map(ac => (
                    <button
                      key={ac.value}
                      onClick={() => setAssetClass(ac.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        assetClass === ac.value
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "bg-secondary/40 text-muted-foreground border border-border hover:text-foreground"
                      }`}
                    >
                      {ac.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SL + TP */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Stop Loss</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Price"
                    value={stopLoss}
                    onChange={e => setStopLoss(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Take Profit</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Price"
                    value={takeProfit}
                    onChange={e => setTakeProfit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Emotion */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Emotion</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {TRADE_EMOTIONS.map(em => (
                    <button
                      key={em.value}
                      onClick={() => setEmotion(emotion === em.value ? "" : em.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        emotion === em.value
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "bg-secondary/40 text-muted-foreground border border-border hover:text-foreground"
                      }`}
                    >
                      <span>{em.emoji}</span> {em.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Tags</label>
                <input
                  type="text"
                  placeholder="momentum, breakout, scalp (comma separated)"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Notes</label>
                <textarea
                  placeholder="Trade notes..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                />
              </div>
            </div>
          )}

          {/* ── Executions Section ── */}
          {activeSection === "executions" && (
            <div className="space-y-4">
              {executions.map((exec, idx) => (
                <div key={exec.id} className="bg-secondary/20 border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Execution #{idx + 1}
                    </span>
                    <button
                      onClick={() => removeExec(exec.id)}
                      disabled={executions.length <= 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-loss hover:bg-loss/10 transition-colors disabled:opacity-30"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Side */}
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Side</label>
                      <div className="flex gap-1.5">
                        {(["buy", "sell"] as ExecutionSide[]).map(s => (
                          <button
                            key={s}
                            onClick={() => updateExec(exec.id, "side", s)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-colors ${
                              exec.side === s
                                ? s === "buy" ? "bg-success/15 text-success border border-success/30" : "bg-loss/15 text-loss border border-loss/30"
                                : "bg-secondary/40 text-muted-foreground border border-border"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date + Time */}
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Date & Time</label>
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <CalendarIcon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          <input
                            type="date"
                            value={exec.date}
                            onChange={e => updateExec(exec.id, "date", e.target.value)}
                            className="w-full pl-8 pr-2 py-2 rounded-lg bg-secondary/40 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                          />
                        </div>
                        <div className="relative w-24">
                          <Clock size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          <input
                            type="time"
                            value={exec.time}
                            onChange={e => updateExec(exec.id, "time", e.target.value)}
                            className="w-full pl-8 pr-2 py-2 rounded-lg bg-secondary/40 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Price *</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={exec.price}
                        onChange={e => updateExec(exec.id, "price", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Quantity *</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        value={exec.quantity}
                        onChange={e => updateExec(exec.id, "quantity", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Fees</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={exec.fees}
                        onChange={e => updateExec(exec.id, "fees", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addExecution}
                className="w-full py-3 rounded-xl border border-dashed border-border text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={15} /> Add Execution
              </button>
            </div>
          )}

          {/* ── Strategy Section ── */}
          {activeSection === "strategy" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Link Strategy</label>
                <select
                  value={selectedStrategyId}
                  onChange={e => {
                    setSelectedStrategyId(e.target.value);
                    setCheckedRules({});
                    setStrategyExpanded(!!e.target.value);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer"
                >
                  <option value="">No strategy</option>
                  {sampleStrategies.map(s => (
                    <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
                  ))}
                </select>
              </div>

              {selectedStrategy && (
                <div className="space-y-3">
                  {/* Strategy info */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: `${selectedStrategy.color}20` }}>
                      {selectedStrategy.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{selectedStrategy.name}</p>
                      {selectedStrategy.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{selectedStrategy.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Rule groups checklist */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Rules Checklist</p>
                    <div className="space-y-2">
                      {selectedStrategy.rules.map(group => (
                        <div key={group.id} className="border border-border rounded-xl overflow-hidden">
                          <div className="px-4 py-2.5 bg-secondary/10">
                            <span className="text-xs font-bold text-foreground">{group.name}</span>
                          </div>
                          {group.items.length > 0 && (
                            <div className="px-4 py-2.5 space-y-2">
                              {group.items.map(item => (
                                <button
                                  key={item.id}
                                  onClick={() => toggleRule(item.id)}
                                  className="w-full flex items-start gap-2.5 text-left group"
                                >
                                  {checkedRules[item.id] ? (
                                    <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" />
                                  ) : (
                                    <Circle size={16} className="text-muted-foreground mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
                                  )}
                                  <span className={`text-xs leading-relaxed ${checkedRules[item.id] ? "text-foreground" : "text-muted-foreground"}`}>
                                    {item.text}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!selectedStrategyId && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Select a strategy to see the rules checklist</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-card border-t border-border rounded-b-2xl px-6 py-4 flex items-center justify-between shrink-0">
          <span className="text-xs text-muted-foreground">
            {executions.filter(e => e.price && e.quantity).length} execution{executions.filter(e => e.price && e.quantity).length !== 1 ? "s" : ""} ready
          </span>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!symbol.trim() || executions.every(e => !e.price || !e.quantity)}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEdit ? "Save Changes" : "Add Trade"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
