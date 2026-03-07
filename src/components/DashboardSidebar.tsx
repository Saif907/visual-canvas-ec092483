import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LayoutGrid,
  Monitor,
  CreditCard,
  TrendingUp,
  Pencil,
  Table2,
  BookOpen,
  BarChart3,
  Radio,
  FolderOpen,
  Lightbulb,
  Sparkles,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  badge?: string;
  hasChevron?: boolean;
}

const menuItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: LayoutGrid, label: "Custom Dashboard", path: "/custom-dashboard", badge: "NEW" },
  { icon: Monitor, label: "Accounts", hasChevron: true },
  { icon: CreditCard, label: "Plans", badge: "NEW", hasChevron: true },
  { icon: TrendingUp, label: "Live Trade" },
  { icon: Pencil, label: "Daily Journal" },
  { icon: Table2, label: "Trades", path: "/trades" },
  { icon: BookOpen, label: "Notebook" },
  { icon: BarChart3, label: "Reports" },
  { icon: CalendarDays, label: "Calendar", path: "/calendar" },
  { icon: Radio, label: "News & Sessions" },
  { icon: FolderOpen, label: "File Manager", badge: "NEW" },
  { icon: Lightbulb, label: "Strategies", path: "/strategies" },
  { icon: Sparkles, label: "AI Chat", path: "/ai-chat", badge: "NEW" },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 flex flex-col sidebar-container ${
        collapsed ? "w-[80px]" : "w-[280px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            T
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-foreground tracking-wide">TradePulse</span>
          )}
        </div>
      </div>

      {/* Menu Label */}
      {!collapsed && (
        <div className="px-6 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary opacity-60">
            Menu
          </span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.label}
            item={item}
            collapsed={collapsed}
            active={item.path ? location.pathname === item.path : false}
            onClick={() => item.path && navigate(item.path)}
          />
        ))}
      </nav>

      {/* Edge toggle button — sits at the right boundary */}
      <button
        onClick={onToggle}
        className="absolute top-1/2 -translate-y-1/2 -right-3.5 w-7 h-7 rounded-full border border-sidebar-border bg-sidebar-bg shadow-md flex items-center justify-center text-text-secondary hover:text-foreground hover:border-primary/40 transition-all duration-200 z-10"
        style={{ backgroundColor: "hsl(var(--sidebar-background))" }}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  );
}

function SidebarItem({
  item,
  collapsed,
  active,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 h-11 rounded-lg px-3 transition-colors text-sm font-normal ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-text-secondary hover:bg-sidebar-accent/50 hover:text-foreground"
      }`}
    >
      <item.icon size={20} className="shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground">
              {item.badge}
            </span>
          )}
          {item.hasChevron && <ChevronRight size={16} className="text-text-secondary" />}
        </>
      )}
    </button>
  );
}
