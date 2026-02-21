import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Strategy, StrategyStatus, DEFAULT_RULE_GROUPS, STRATEGY_COLORS, STRATEGY_EMOJIS, StrategyRuleGroup } from "@/types/strategy";

interface AddStrategyModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (strategy: Strategy) => void;
  editStrategy?: Strategy | null;
}

export default function AddStrategyModal({ open, onClose, onSave, editStrategy }: AddStrategyModalProps) {
  const isEdit = !!editStrategy;

  const [name, setName] = useState(editStrategy?.name || "");
  const [description, setDescription] = useState(editStrategy?.description || "");
  const [status, setStatus] = useState<StrategyStatus>(editStrategy?.status || "active");
  const [emoji, setEmoji] = useState(editStrategy?.emoji || "🎯");
  const [color, setColor] = useState(editStrategy?.color || STRATEGY_COLORS[0]);
  const [rules, setRules] = useState<StrategyRuleGroup[]>(
    editStrategy?.rules?.length ? editStrategy.rules : DEFAULT_RULE_GROUPS.map(g => ({ ...g, items: [] }))
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!open) return null;

  const addRuleItem = (groupId: string) => {
    setRules(prev =>
      prev.map(g =>
        g.id === groupId
          ? { ...g, items: [...g.items, { id: crypto.randomUUID(), text: "", checked: false }] }
          : g
      )
    );
  };

  const updateRuleItem = (groupId: string, itemId: string, text: string) => {
    setRules(prev =>
      prev.map(g =>
        g.id === groupId
          ? { ...g, items: g.items.map(i => (i.id === itemId ? { ...i, text } : i)) }
          : g
      )
    );
  };

  const removeRuleItem = (groupId: string, itemId: string) => {
    setRules(prev =>
      prev.map(g =>
        g.id === groupId
          ? { ...g, items: g.items.filter(i => i.id !== itemId) }
          : g
      )
    );
  };

  const addRuleGroup = () => {
    setRules(prev => [...prev, { id: crypto.randomUUID(), name: "New Group", items: [] }]);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const now = new Date().toISOString();
    const strategy: Strategy = {
      id: editStrategy?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      status,
      emoji,
      color,
      assetClasses: editStrategy?.assetClasses || [],
      trackMissedTrades: editStrategy?.trackMissedTrades || false,
      rules: rules.filter(g => g.items.length > 0 || DEFAULT_RULE_GROUPS.some(d => d.id === g.id)),
      metrics: editStrategy?.metrics || { totalTrades: 0, winRate: 0, netPnl: 0, profitFactor: 0, avgWin: 0, avgLoss: 0 },
      createdAt: editStrategy?.createdAt || now,
      updatedAt: now,
    };
    onSave(strategy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto card-boundary mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border rounded-t-2xl px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-foreground">{isEdit ? "Edit Strategy" : "New Strategy"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Emoji + Name row */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-14 h-14 rounded-xl border border-border flex items-center justify-center text-2xl hover:border-primary/40 transition-colors"
                style={{ backgroundColor: `${color}15` }}
              >
                {emoji}
              </button>
              {showEmojiPicker && (
                <div className="absolute top-16 left-0 bg-card border border-border rounded-xl p-3 card-boundary grid grid-cols-8 gap-1.5 z-20 w-[280px]">
                  {STRATEGY_EMOJIS.map(e => (
                    <button
                      key={e}
                      onClick={() => { setEmoji(e); setShowEmojiPicker(false); }}
                      className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-lg transition-colors"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <input
                type="text"
                placeholder="Strategy name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
              />
            </div>
          </div>

          {/* Color + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {STRATEGY_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-offset-card ring-primary scale-110" : "hover:scale-110"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Status</label>
              <div className="flex items-center gap-2">
                {(["active", "paused", "archived"] as StrategyStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      status === s
                        ? s === "active" ? "bg-success/15 text-success" : s === "paused" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        : "bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rule Groups */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-muted-foreground">Rule Groups</label>
              <button onClick={addRuleGroup} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold transition-colors">
                <Plus size={13} /> Add Group
              </button>
            </div>
            <div className="space-y-4">
              {rules.map(group => (
                <div key={group.id} className="bg-secondary/20 border border-border rounded-xl p-4">
                  <input
                    type="text"
                    value={group.name}
                    onChange={e => setRules(prev => prev.map(g => g.id === group.id ? { ...g, name: e.target.value } : g))}
                    className="text-sm font-semibold text-foreground bg-transparent border-none outline-none w-full mb-3"
                  />
                  <div className="space-y-2">
                    {group.items.map(item => (
                      <div key={item.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.text}
                          onChange={e => updateRuleItem(group.id, item.id, e.target.value)}
                          placeholder="Rule description..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                        />
                        <button onClick={() => removeRuleItem(group.id, item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-loss hover:bg-loss/10 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addRuleItem(group.id)} className="mt-2 flex items-center gap-1 text-xs text-primary/70 hover:text-primary font-medium transition-colors">
                    <Plus size={12} /> Add Rule
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border rounded-b-2xl px-6 py-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEdit ? "Save Changes" : "Create Strategy"}
          </button>
        </div>
      </div>
    </div>
  );
}
