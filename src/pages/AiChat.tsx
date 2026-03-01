import { useState, useRef, useEffect, useMemo } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Send,
  Sparkles,
  TrendingUp,
  BarChart3,
  Brain,
  Target,
  History,
  Plus,
  Trash2,
  MessageSquare,
  Copy,
  RotateCcw,
  ChevronDown,
  Lightbulb,
  Zap,
  Search,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  mode?: string;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
  messages: Message[];
}

type ChatMode = {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
};

const CHAT_MODES: ChatMode[] = [
  { id: "general", label: "General", icon: Sparkles, description: "Ask anything about your trading", color: "text-primary" },
  { id: "analysis", label: "Trade Analysis", icon: TrendingUp, description: "Deep dive into trade performance", color: "text-success" },
  { id: "strategy", label: "Strategy Review", icon: Target, description: "Evaluate & improve strategies", color: "text-[hsl(262,83%,58%)]" },
  { id: "risk", label: "Risk Assessment", icon: BarChart3, description: "Portfolio risk & exposure", color: "text-[hsl(25,95%,53%)]" },
  { id: "psychology", label: "Psychology", icon: Brain, description: "Mindset, emotions & discipline", color: "text-[hsl(346,77%,50%)]" },
];

const QUICK_PROMPTS = [
  { icon: TrendingUp, text: "Analyze my best trades this month", mode: "analysis" },
  { icon: Target, text: "Which strategy has the highest win rate?", mode: "strategy" },
  { icon: BarChart3, text: "Show my risk exposure breakdown", mode: "risk" },
  { icon: Brain, text: "How can I improve my trading discipline?", mode: "psychology" },
  { icon: Lightbulb, text: "What patterns do my losing trades share?", mode: "analysis" },
  { icon: Zap, text: "Summarize my weekly performance", mode: "general" },
];

// ── Mock response generator ──────────────────────────────────
function getMockResponse(input: string, mode: string): string {
  const responses: Record<string, string[]> = {
    analysis: [
      `## Trade Analysis Summary\n\nBased on your recent trading data:\n\n| Metric | Value |\n|--------|-------|\n| Win Rate | **62.4%** |\n| Avg Winner | **$847** |\n| Avg Loser | **-$423** |\n| Profit Factor | **1.89** |\n\n### Key Observations\n- Your **BTCUSD** trades have the strongest R-multiple at **2.3R**\n- Morning entries (9-11 AM) show a **73% win rate** vs 51% for afternoon\n- Consider reducing position size on counter-trend setups — they account for **68% of losses**\n\n> 💡 *Focus on your edge: trend-following setups during high-volume sessions.*`,
      `## Performance Breakdown\n\nYour last 20 trades show interesting patterns:\n\n### Winners\n- Average hold time: **2.4 hours**\n- Most profitable pair: **EURUSD** (+$2,340)\n- Best entry pattern: **Breakout retests**\n\n### Losers\n- Average hold time: **4.1 hours** ⚠️\n- Most frequent mistake: **Moving stop loss**\n- Largest drawdown: **-$1,200** on revenge trade\n\n*Recommendation: Set a hard 3-hour time stop for trades that aren't working.*`,
    ],
    strategy: [
      `## Strategy Performance Comparison\n\n### 🏆 Top Performer: Breakout Strategy\n- Win Rate: **68%**\n- Avg R-Multiple: **2.1R**\n- Total Trades: **47**\n- Net PnL: **+$12,450**\n\n### ⚡ Needs Review: Mean Reversion\n- Win Rate: **45%**\n- Avg R-Multiple: **0.8R**\n- Consider tightening entry criteria or pausing this strategy.\n\n### Checklist Adherence\nYou followed **82%** of your entry rules on winning trades vs only **54%** on losers. This confirms that *discipline directly correlates with profitability*.`,
    ],
    risk: [
      `## Risk Assessment Report\n\n### Current Exposure\n- **Open positions:** 3 trades\n- **Total risk:** $1,450 (2.9% of account)\n- **Max single-trade risk:** $650 (1.3%)\n\n### Risk Distribution\n| Asset Class | Allocation | Risk |\n|------------|-----------|------|\n| Forex | 45% | 1.2% |\n| Crypto | 35% | 1.4% |\n| Indices | 20% | 0.3% |\n\n⚠️ **Alert:** Crypto exposure is elevated. Consider reducing BTCUSD position by 20% to stay within your 1% per-asset rule.`,
    ],
    psychology: [
      `## Trading Psychology Check-in\n\nBased on your recent journal entries and trade patterns:\n\n### 🟢 Strengths\n- **Patience on entries** — 78% of trades waited for confirmation\n- **Consistent position sizing** — staying within 1-2% risk\n\n### 🔴 Areas for Improvement\n- **Revenge trading** detected on 3 occasions this week\n- **Overtrading** — 12 trades on Tuesday vs your 6-trade daily limit\n- **Moving stop losses** — happened on 4 losing trades\n\n### Action Items\n1. Set a **2-loss daily limit** before taking a 1-hour break\n2. Review your rules checklist *before* every trade entry\n3. Practice the **5-minute rule** — wait 5 min after a loss before analyzing\n\n> *\"The goal of a successful trader is to make the best trades. Money is secondary.\"*`,
    ],
    general: [
      `## Weekly Performance Summary\n\n📊 **This Week at a Glance:**\n\n- **Total Trades:** 18\n- **Won:** 11 | **Lost:** 7\n- **Net PnL:** +$3,240\n- **Best Trade:** AAPL Long (+$1,100)\n- **Worst Trade:** GBPUSD Short (-$580)\n\n### Highlights\n- ✅ Win rate improved from 55% to **61%** week-over-week\n- ✅ Average winner increased by **12%**\n- ⚠️ Friday trading remains weak — consider reducing size on Fridays\n\n*Keep up the strong execution this week. Your process is working.* 🎯`,
    ],
  };

  const modeResponses = responses[mode] || responses.general;
  return modeResponses[Math.floor(Math.random() * modeResponses.length)];
}

// ── Component ────────────────────────────────────────────────
export default function AiChat() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "demo-1",
      title: "Weekly Performance Review",
      lastMessage: "Your win rate improved to 61% this week",
      updatedAt: new Date(Date.now() - 3600000),
      messages: [],
    },
    {
      id: "demo-2",
      title: "BTCUSD Trade Analysis",
      lastMessage: "The breakout entry had strong momentum confirmation",
      updatedAt: new Date(Date.now() - 86400000),
      messages: [],
    },
    {
      id: "demo-3",
      title: "Risk Management Check",
      lastMessage: "Current portfolio risk is within tolerance",
      updatedAt: new Date(Date.now() - 172800000),
      messages: [],
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>("general");
  const [historyOpen, setHistoryOpen] = useState(true);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modeRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;
  const currentMode = CHAT_MODES.find((m) => m.id === selectedMode) || CHAT_MODES[0];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close mode dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modeRef.current && !modeRef.current.contains(e.target as Node)) {
        setModeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: msg,
      timestamp: new Date(),
      mode: selectedMode,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Create session if new
    if (!activeSessionId) {
      const newSession: ChatSession = {
        id: crypto.randomUUID(),
        title: msg.slice(0, 40) + (msg.length > 40 ? "…" : ""),
        lastMessage: msg,
        updatedAt: new Date(),
        messages: [userMsg],
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    }

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: getMockResponse(msg, selectedMode),
      timestamp: new Date(),
      mode: selectedMode,
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveSessionId(null);
    setInput("");
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) startNewChat();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

      <main
        className={cn(
          "transition-all duration-300 h-[calc(100vh-64px)] flex",
          sidebarCollapsed ? "ml-[80px]" : "ml-[280px]"
        )}
      >
        {/* ── Chat History Panel ─────────────────── */}
        <aside
          className={cn(
            "h-full flex flex-col border-r border-divider transition-all duration-300 shrink-0",
            historyOpen ? "w-[280px]" : "w-0 overflow-hidden border-r-0"
          )}
          style={{ backgroundColor: "hsl(var(--sidebar-background))" }}
        >
          {/* History header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-divider">
            <span className="text-sm font-semibold text-foreground">Chat History</span>
            <button
              onClick={startNewChat}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-secondary hover:text-foreground transition-colors"
              title="New chat"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Session list */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setActiveSessionId(session.id);
                  setMessages(session.messages);
                }}
                className={cn(
                  "w-full group flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors",
                  activeSessionId === session.id
                    ? "bg-secondary text-foreground"
                    : "text-text-secondary hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <MessageSquare size={16} className="mt-0.5 shrink-0 opacity-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.title}</p>
                  <p className="text-xs text-text-secondary truncate mt-0.5">{session.lastMessage}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 w-6 h-6 rounded flex items-center justify-center text-text-secondary hover:text-loss transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Chat Area ──────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Toggle history */}
          <div className="absolute top-3 left-3 z-10">
            <button
              onClick={() => setHistoryOpen((p) => !p)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-secondary hover:text-foreground transition-colors"
              title={historyOpen ? "Hide history" : "Show history"}
            >
              <History size={18} />
            </button>
          </div>

          {!hasMessages ? (
            /* ── Empty State ─────────────────────── */
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              {/* Hero */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Sparkles className="text-primary" size={24} />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">TradePulse AI</h1>
              <p className="text-text-secondary text-sm mb-8 text-center max-w-md">
                Your intelligent trading assistant. Analyze trades, review strategies, assess risk, and sharpen your edge.
              </p>

              {/* Quick prompts grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-10">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedMode(prompt.mode);
                      handleSend(prompt.text);
                    }}
                    className="group flex items-start gap-3 p-4 rounded-xl card-boundary bg-card hover:border-primary/30 transition-all text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <prompt.icon size={18} className="text-primary" />
                    </div>
                    <span className="text-sm text-text-secondary group-hover:text-foreground transition-colors leading-snug pt-1.5">
                      {prompt.text}
                    </span>
                  </button>
                ))}
              </div>

              {/* Input box (centered empty state) */}
              <div className="w-full max-w-2xl">
                <ChatInput
                  input={input}
                  setInput={setInput}
                  onSend={handleSend}
                  onKeyDown={handleKeyDown}
                  isLoading={isLoading}
                  selectedMode={selectedMode}
                  setSelectedMode={setSelectedMode}
                  currentMode={currentMode}
                  modeDropdownOpen={modeDropdownOpen}
                  setModeDropdownOpen={setModeDropdownOpen}
                  modeRef={modeRef}
                  inputRef={inputRef}
                />
              </div>
            </div>
          ) : (
            /* ── Active Chat ─────────────────────── */
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 pt-14 pb-4">
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                          <Sparkles size={16} className="text-primary" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground px-4 py-3"
                            : "bg-card card-boundary px-5 py-4"
                        )}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm prose-invert max-w-none text-foreground [&_table]:text-sm [&_th]:text-text-secondary [&_th]:font-semibold [&_th]:border-b [&_th]:border-divider [&_th]:pb-2 [&_th]:px-3 [&_td]:px-3 [&_td]:py-2 [&_td]:border-b [&_td]:border-divider/50 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mb-2 [&_p]:text-text-secondary [&_p]:leading-relaxed [&_li]:text-text-secondary [&_strong]:text-foreground [&_blockquote]:border-l-primary [&_blockquote]:bg-primary/5 [&_blockquote]:rounded-r-lg [&_blockquote]:py-2 [&_blockquote]:px-4 [&_em]:text-text-secondary [&_code]:bg-secondary [&_code]:text-primary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        )}

                        {/* Message actions */}
                        {msg.role === "assistant" && (
                          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-divider">
                            <button
                              onClick={() => copyMessage(msg.content)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-text-secondary hover:text-foreground hover:bg-secondary transition-colors"
                            >
                              <Copy size={13} /> Copy
                            </button>
                            <button
                              onClick={() => handleSend(messages.find((m) => m.id === msg.id)?.content || "")}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-text-secondary hover:text-foreground hover:bg-secondary transition-colors"
                            >
                              <RotateCcw size={13} /> Regenerate
                            </button>
                          </div>
                        )}
                      </div>

                      {msg.role === "user" && (
                        <div className="w-8 h-8 rounded-lg bg-[hsl(36,100%,50%)] flex items-center justify-center text-sm font-bold text-foreground shrink-0 mt-1">
                          T
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles size={16} className="text-primary animate-pulse" />
                      </div>
                      <div className="bg-card card-boundary rounded-2xl px-5 py-4">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input (bottom pinned) */}
              <div className="border-t border-divider px-4 py-4" style={{ backgroundColor: "hsl(var(--background))" }}>
                <div className="max-w-3xl mx-auto">
                  <ChatInput
                    input={input}
                    setInput={setInput}
                    onSend={handleSend}
                    onKeyDown={handleKeyDown}
                    isLoading={isLoading}
                    selectedMode={selectedMode}
                    setSelectedMode={setSelectedMode}
                    currentMode={currentMode}
                    modeDropdownOpen={modeDropdownOpen}
                    setModeDropdownOpen={setModeDropdownOpen}
                    modeRef={modeRef}
                    inputRef={inputRef}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Chat Input Component ─────────────────────────────────────
interface ChatInputProps {
  input: string;
  setInput: (v: string) => void;
  onSend: (text?: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  selectedMode: string;
  setSelectedMode: (v: string) => void;
  currentMode: ChatMode;
  modeDropdownOpen: boolean;
  setModeDropdownOpen: (v: boolean) => void;
  modeRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

function ChatInput({
  input,
  setInput,
  onSend,
  onKeyDown,
  isLoading,
  selectedMode,
  setSelectedMode,
  currentMode,
  modeDropdownOpen,
  setModeDropdownOpen,
  modeRef,
  inputRef,
}: ChatInputProps) {
  return (
    <div className="card-boundary bg-card rounded-2xl overflow-hidden">
      {/* Textarea */}
      <div className="px-4 pt-3.5 pb-1">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask me anything about your trades…"
          rows={1}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-text-secondary resize-none outline-none leading-relaxed max-h-40"
        />
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1">
        {/* Mode selector */}
        <div ref={modeRef} className="relative">
          <button
            onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-divider text-xs font-medium text-text-secondary hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <currentMode.icon size={14} className={currentMode.color} />
            <span>{currentMode.label}</span>
            <ChevronDown size={12} className={cn("transition-transform", modeDropdownOpen && "rotate-180")} />
          </button>

          {modeDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-card card-boundary rounded-xl p-2 z-50">
              {CHAT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setSelectedMode(mode.id);
                    setModeDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    selectedMode === mode.id ? "bg-secondary" : "hover:bg-secondary/50"
                  )}
                >
                  <mode.icon size={16} className={cn("mt-0.5 shrink-0", mode.color)} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{mode.label}</p>
                    <p className="text-xs text-text-secondary">{mode.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={() => onSend()}
          disabled={!input.trim() || isLoading}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
            input.trim() && !isLoading
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              : "bg-secondary text-text-disabled cursor-not-allowed"
          )}
        >
          <Send size={14} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
