import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Search,
  Plus,
  LayoutList,
  Star,
  Trash2,
  FileText,
  CalendarDays,
  BookOpen,
  User,
  ArrowUpDown,
  SlidersHorizontal,
  FolderPlus,
  NotebookPen,
} from "lucide-react";

type FolderKey = "all" | "daily" | "trade" | "personal" | "starred" | "trash";

interface Folder {
  key: FolderKey;
  label: string;
  icon: React.ElementType;
  count: number;
}

const folders: Folder[] = [
  { key: "all", label: "All", icon: LayoutList, count: 0 },
  { key: "daily", label: "Daily Note", icon: CalendarDays, count: 0 },
  { key: "trade", label: "Trade Note", icon: FileText, count: 0 },
  { key: "personal", label: "Personal Note", icon: User, count: 0 },
  { key: "starred", label: "Starred", icon: Star, count: 0 },
  { key: "trash", label: "Trash", icon: Trash2, count: 0 },
];

function EmptyNotes() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16">
      {/* Decorative illustration */}
      <div className="relative w-28 h-28">
        {/* Scattered dots */}
        <div className="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-border" />
        <div className="absolute top-8 right-1 w-1 h-1 rounded-full bg-border/60" />
        <div className="absolute bottom-4 left-2 w-1.5 h-1.5 rounded-full bg-border" />
        <div className="absolute bottom-10 left-0 w-1 h-1 rounded-full bg-border/60" />
        {/* Icon box */}
        <div className="absolute inset-4 rounded-2xl bg-secondary/60 border border-border flex flex-col items-center justify-center gap-1.5 shadow-inner">
          <div className="w-full h-1.5 rounded-full bg-muted-foreground/20 mx-3" />
          <div className="w-4/5 h-1.5 rounded-full bg-muted-foreground/15 mx-3" />
          <div className="w-3/5 h-1.5 rounded-full bg-muted-foreground/10 mx-3" />
        </div>
        {/* Browser-style top bar */}
        <div className="absolute top-4 left-4 right-4 h-2 rounded-t-lg bg-secondary/80 border border-b-0 border-border flex items-center gap-0.5 px-1">
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground mb-1">No Notes</p>
        <p className="text-xs text-muted-foreground">You have no notes in this folder.</p>
      </div>
    </div>
  );
}

function NoNoteSelected() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative w-36 h-28">
        {/* Scattered dots */}
        <div className="absolute top-1 right-8 w-1.5 h-1.5 rounded-full bg-border" />
        <div className="absolute top-6 right-2 w-1 h-1 rounded-full bg-border/60" />
        <div className="absolute bottom-2 left-4 w-1.5 h-1.5 rounded-full bg-border" />
        <div className="absolute bottom-8 right-0 w-1 h-1 rounded-full bg-border/50" />
        {/* Second card (offset behind) */}
        <div className="absolute top-2 right-0 w-20 h-20 rounded-2xl bg-secondary/40 border border-border" />
        {/* Main card */}
        <div className="absolute top-4 left-0 w-24 h-20 rounded-2xl bg-secondary/60 border border-border flex flex-col items-start justify-center gap-1.5 px-3 shadow-inner">
          <div className="w-full h-1.5 rounded-full bg-muted-foreground/20" />
          <div className="w-4/5 h-1.5 rounded-full bg-muted-foreground/15" />
          <div className="w-3/5 h-1.5 rounded-full bg-muted-foreground/10" />
        </div>
        {/* Top bars */}
        <div className="absolute top-4 left-0 w-24 h-2 rounded-t-lg bg-secondary/80 border border-b-0 border-border flex items-center gap-0.5 px-1">
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="absolute top-2 right-0 w-20 h-2 rounded-t-lg bg-secondary/60 border border-b-0 border-border flex items-center gap-0.5 px-1">
          <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground mb-1">No Note Selected</p>
        <p className="text-xs text-muted-foreground max-w-[180px] leading-relaxed">
          Please select a note from the list to view its details.
        </p>
      </div>
    </div>
  );
}

export default function Notebook() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeFolder, setActiveFolder] = useState<FolderKey>("all");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <DashboardHeader sidebarCollapsed={collapsed} />

      <main
        className={`transition-all duration-300 pt-16 ${collapsed ? "ml-[80px]" : "ml-[280px]"}`}
        style={{ height: "100vh", overflow: "hidden" }}
      >
        {/* Page title bar */}
        <div className="px-6 py-5 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Notebook</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <BookOpen size={13} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Notebook</span>
          </div>
        </div>

        {/* 3-column panel */}
        <div
          className="flex"
          style={{ height: "calc(100vh - 64px - 73px)" }}
        >
          {/* ── Panel 1: Folders ── */}
          <div className="w-[220px] shrink-0 border-r border-border flex flex-col bg-card/30">
            {/* Folder panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                <FolderPlus size={14} />
                <span>Add Folder</span>
              </button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <SlidersHorizontal size={13} />
              </button>
            </div>

            {/* Folder list */}
            <nav className="flex-1 py-2 overflow-y-auto">
              {folders.map((folder) => {
                const Icon = folder.icon;
                const isActive = activeFolder === folder.key;
                return (
                  <button
                    key={folder.key}
                    onClick={() => setActiveFolder(folder.key)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={15}
                        className={isActive ? "text-primary" : "text-muted-foreground/70"}
                      />
                      <span>{folder.label}</span>
                    </div>
                    <span
                      className={`text-xs tabular-nums ${
                        isActive ? "text-primary" : "text-muted-foreground/50"
                      }`}
                    >
                      {folder.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ── Panel 2: Notes list ── */}
          <div className="w-[280px] shrink-0 border-r border-border flex flex-col bg-card/20">
            {/* Search + actions */}
            <div className="flex items-center gap-2 px-3 py-3 border-b border-border/60">
              <div className="flex-1 flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-1.5 border border-border/50 focus-within:border-primary/40 transition-colors">
                <Search size={13} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 outline-none"
                />
              </div>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
                <ArrowUpDown size={13} />
              </button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
                <Plus size={14} />
              </button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
                <SlidersHorizontal size={13} />
              </button>
            </div>

            {/* Empty state */}
            <EmptyNotes />
          </div>

          {/* ── Panel 3: Note preview ── */}
          <div className="flex-1 flex flex-col bg-background/60">
            {/* Toolbar */}
            <div className="flex items-center justify-end gap-1 px-4 py-3 border-b border-border/60">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <NotebookPen size={13} />
              </button>
            </div>

            {/* Empty state */}
            <NoNoteSelected />
          </div>
        </div>
      </main>
    </div>
  );
}
