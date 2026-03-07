import { useState, useCallback, useEffect, useMemo } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AddWidgetModal from "@/components/dashboard/AddWidgetModal";
import { WIDGET_REGISTRY, renderWidget, WidgetDefinition } from "@/components/dashboard/widgetRegistry";
import { cn } from "@/lib/utils";
import {
  Plus, Settings, Trash2, GripVertical, X, ChevronDown,
  LayoutGrid, Copy, Pencil, Check, Lock, Unlock, RotateCcw,
} from "lucide-react";

import "react-grid-layout/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

// ──────────────────────────────────────────────
// Types & Storage
// ──────────────────────────────────────────────
interface DashboardWidget {
  widgetId: string;
  layout: { x: number; y: number; w: number; h: number };
}

interface Dashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  createdAt: string;
}

const STORAGE_KEY = "tradepulse-custom-dashboards";
const ACTIVE_KEY = "tradepulse-active-dashboard";

function loadDashboards(): Dashboard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveDashboards(dashboards: Dashboard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboards));
}

function getActiveDashboardId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

function setActiveDashboardId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

// ──────────────────────────────────────────────
// Default starter dashboard
// ──────────────────────────────────────────────
function createDefaultDashboard(): Dashboard {
  return {
    id: crypto.randomUUID(),
    name: "My Dashboard",
    widgets: [
      { widgetId: "win-rate", layout: { x: 0, y: 0, w: 3, h: 2 } },
      { widgetId: "net-pnl", layout: { x: 3, y: 0, w: 3, h: 2 } },
      { widgetId: "profit-factor", layout: { x: 6, y: 0, w: 3, h: 2 } },
      { widgetId: "trade-count", layout: { x: 9, y: 0, w: 3, h: 2 } },
      { widgetId: "chart-equity-curve", layout: { x: 0, y: 2, w: 6, h: 3 } },
      { widgetId: "chart-daily-pnl", layout: { x: 6, y: 2, w: 6, h: 3 } },
    ],
    createdAt: new Date().toISOString(),
  };
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
export default function CustomDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>(() => {
    const loaded = loadDashboards();
    if (loaded.length === 0) {
      const def = createDefaultDashboard();
      saveDashboards([def]);
      setActiveDashboardId(def.id);
      return [def];
    }
    return loaded;
  });
  const [activeDashId, setActiveDashId] = useState<string>(() => {
    const stored = getActiveDashboardId();
    if (stored && dashboards.find(d => d.id === stored)) return stored;
    return dashboards[0]?.id || "";
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [dashMenuOpen, setDashMenuOpen] = useState(false);

  const activeDashboard = useMemo(() => dashboards.find(d => d.id === activeDashId) || dashboards[0], [dashboards, activeDashId]);

  // Persist
  useEffect(() => { saveDashboards(dashboards); }, [dashboards]);
  useEffect(() => { if (activeDashId) setActiveDashboardId(activeDashId); }, [activeDashId]);

  // Layout from widgets
  const layouts = useMemo(() => {
    if (!activeDashboard) return { lg: [] as Layout[] };
    return {
      lg: activeDashboard.widgets.map((w) => {
        const def = WIDGET_REGISTRY.find(r => r.id === w.widgetId);
        return {
          i: w.widgetId,
          x: w.layout.x,
          y: w.layout.y,
          w: w.layout.w,
          h: w.layout.h,
          minW: def?.minW || 2,
          minH: def?.minH || 2,
          maxW: def?.maxW,
          maxH: def?.maxH,
          static: !editMode,
        };
      }),
    };
  }, [activeDashboard, editMode]);

  const handleLayoutChange = useCallback((layout: Layout[]) => {
    if (!editMode || !activeDashboard) return;
    setDashboards(prev => prev.map(d => {
      if (d.id !== activeDashboard.id) return d;
      return {
        ...d,
        widgets: d.widgets.map(w => {
          const l = layout.find(l => l.i === w.widgetId);
          if (!l) return w;
          return { ...w, layout: { x: l.x, y: l.y, w: l.w, h: l.h } };
        }),
      };
    }));
  }, [editMode, activeDashboard]);

  const handleAddWidget = useCallback((widgetDef: WidgetDefinition) => {
    if (!activeDashboard) return;
    const maxY = activeDashboard.widgets.reduce((max, w) => Math.max(max, w.layout.y + w.layout.h), 0);
    setDashboards(prev => prev.map(d => {
      if (d.id !== activeDashboard.id) return d;
      return {
        ...d,
        widgets: [...d.widgets, {
          widgetId: widgetDef.id,
          layout: { x: 0, y: maxY, w: widgetDef.defaultW, h: widgetDef.defaultH },
        }],
      };
    }));
    setAddModalOpen(false);
  }, [activeDashboard]);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    if (!activeDashboard) return;
    setDashboards(prev => prev.map(d => {
      if (d.id !== activeDashboard.id) return d;
      return { ...d, widgets: d.widgets.filter(w => w.widgetId !== widgetId) };
    }));
  }, [activeDashboard]);

  const handleCreateDashboard = useCallback(() => {
    const newDash: Dashboard = {
      id: crypto.randomUUID(),
      name: `Dashboard ${dashboards.length + 1}`,
      widgets: [],
      createdAt: new Date().toISOString(),
    };
    setDashboards(prev => [...prev, newDash]);
    setActiveDashId(newDash.id);
    setDashMenuOpen(false);
    setEditMode(true);
  }, [dashboards.length]);

  const handleDuplicateDashboard = useCallback(() => {
    if (!activeDashboard) return;
    const dup: Dashboard = {
      ...JSON.parse(JSON.stringify(activeDashboard)),
      id: crypto.randomUUID(),
      name: `${activeDashboard.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    setDashboards(prev => [...prev, dup]);
    setActiveDashId(dup.id);
    setDashMenuOpen(false);
  }, [activeDashboard]);

  const handleDeleteDashboard = useCallback(() => {
    if (dashboards.length <= 1) return;
    setDashboards(prev => {
      const next = prev.filter(d => d.id !== activeDashId);
      setActiveDashId(next[0].id);
      return next;
    });
    setDashMenuOpen(false);
  }, [activeDashId, dashboards.length]);

  const startRename = useCallback((id: string, currentName: string) => {
    setRenamingId(id);
    setRenameValue(currentName);
  }, []);

  const confirmRename = useCallback(() => {
    if (!renamingId || !renameValue.trim()) return;
    setDashboards(prev => prev.map(d => d.id === renamingId ? { ...d, name: renameValue.trim() } : d));
    setRenamingId(null);
  }, [renamingId, renameValue]);

  const handleResetDashboard = useCallback(() => {
    if (!activeDashboard) return;
    const def = createDefaultDashboard();
    setDashboards(prev => prev.map(d => d.id === activeDashboard.id ? { ...d, widgets: def.widgets } : d));
  }, [activeDashboard]);

  const existingWidgetIds = activeDashboard?.widgets.map(w => w.widgetId) || [];

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

      <main className={cn("transition-all duration-300 p-6 pb-16", sidebarCollapsed ? "ml-[80px]" : "ml-[280px]")}>
        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Dashboard Switcher */}
            <div className="relative">
              <button
                onClick={() => setDashMenuOpen(!dashMenuOpen)}
                className="flex items-center gap-2 h-10 px-4 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:border-primary/40 transition-colors"
              >
                <LayoutGrid size={16} className="text-primary" />
                {renamingId === activeDashboard?.id ? (
                  <input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                    onBlur={confirmRename}
                    autoFocus
                    className="bg-transparent border-none outline-none text-sm font-medium w-32"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span>{activeDashboard?.name}</span>
                )}
                <ChevronDown size={14} className="text-text-secondary" />
              </button>

              {dashMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDashMenuOpen(false)} />
                  <div className="absolute top-12 left-0 z-50 w-64 bg-card rounded-xl border border-border card-boundary overflow-hidden">
                    <div className="p-2 border-b border-border">
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary px-2 py-1">Dashboards</p>
                    </div>
                    <div className="p-1 max-h-48 overflow-y-auto">
                      {dashboards.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => { setActiveDashId(d.id); setDashMenuOpen(false); }}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                            d.id === activeDashId ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                          )}
                        >
                          <LayoutGrid size={14} />
                          <span className="flex-1 text-left truncate">{d.name}</span>
                          {d.id === activeDashId && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                    <div className="p-1 border-t border-border space-y-0.5">
                      <button onClick={handleCreateDashboard} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
                        <Plus size={14} /> New Dashboard
                      </button>
                      <button onClick={handleDuplicateDashboard} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
                        <Copy size={14} /> Duplicate
                      </button>
                      <button onClick={() => { startRename(activeDashboard!.id, activeDashboard!.name); setDashMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
                        <Pencil size={14} /> Rename
                      </button>
                      <button onClick={handleResetDashboard} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
                        <RotateCcw size={14} /> Reset to Default
                      </button>
                      {dashboards.length > 1 && (
                        <button onClick={handleDeleteDashboard} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-loss hover:bg-loss/10 transition-colors">
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={cn(
                "flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium transition-colors",
                editMode
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary/40"
              )}
            >
              {editMode ? <Unlock size={14} /> : <Lock size={14} />}
              {editMode ? "Editing" : "Edit Layout"}
            </button>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={14} />
              Add Widget
            </button>
          </div>
        </div>

        {/* ── Grid ── */}
        {activeDashboard && activeDashboard.widgets.length > 0 ? (
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={80}
            onLayoutChange={handleLayoutChange}
            isDraggable={editMode}
            isResizable={editMode}
            draggableHandle=".widget-drag-handle"
            containerPadding={[0, 0]}
            margin={[16, 16]}
          >
            {activeDashboard.widgets.map((widget) => {
              const def = WIDGET_REGISTRY.find(r => r.id === widget.widgetId);
              if (!def) return null;
              return (
                <div key={widget.widgetId} className="group">
                  <div className={cn(
                    "bg-card rounded-xl card-boundary h-full flex flex-col overflow-hidden transition-all",
                    editMode && "ring-1 ring-primary/20 hover:ring-primary/40"
                  )}>
                    {/* Widget Header */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-1">
                      <div className="flex items-center gap-2">
                        {editMode && (
                          <div className="widget-drag-handle cursor-grab active:cursor-grabbing text-text-secondary hover:text-foreground">
                            <GripVertical size={14} />
                          </div>
                        )}
                        <h4 className="text-xs font-semibold text-foreground">{def.name}</h4>
                      </div>
                      {editMode && (
                        <button
                          onClick={() => handleRemoveWidget(widget.widgetId)}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-text-secondary hover:text-loss hover:bg-loss/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    {/* Widget Content */}
                    <div className="flex-1 px-4 pb-3 min-h-0">
                      {renderWidget(widget.widgetId)}
                    </div>
                  </div>
                </div>
              );
            })}
          </ResponsiveGridLayout>
        ) : (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <LayoutGrid size={32} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Build Your Dashboard</h2>
            <p className="text-sm text-text-secondary mb-6 text-center max-w-md">
              Create a personalized trading dashboard by adding widgets. Choose from {WIDGET_REGISTRY.length}+ metrics, charts, and analytics widgets.
            </p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              Add Your First Widget
            </button>
            <button
              onClick={handleResetDashboard}
              className="mt-3 text-sm text-text-secondary hover:text-foreground transition-colors"
            >
              Or start with a default layout
            </button>
          </div>
        )}
      </main>

      <AddWidgetModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddWidget}
        existingWidgetIds={existingWidgetIds}
      />
    </div>
  );
}
