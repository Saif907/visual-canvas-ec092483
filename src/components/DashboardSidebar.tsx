import { useState } from "react";
import {
  LayoutDashboard,
  Monitor,
  CreditCard,
  TrendingUp,
  Pencil,
  Table2,
  BookOpen,
  BarChart3,
  Radio,
  FolderOpen,
  Target,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: string;
  hasChevron?: boolean;
  comingSoon?: boolean;
}

const menuItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Monitor, label: "Accounts", hasChevron: true },
  { icon: CreditCard, label: "Plans", badge: "NEW", hasChevron: true },
  { icon: TrendingUp, label: "Live Trade" },
  { icon: Pencil, label: "Daily Journal" },
  { icon: Table2, label: "Close Trade" },
  { icon: BookOpen, label: "Notebook" },
  { icon: BarChart3, label: "Reports" },
  { icon: Radio, label: "News & Sessions" },
  { icon: FolderOpen, label: "File Manager", badge: "NEW" },
];

const comingSoonItems: NavItem[] = [
  { icon: Target, label: "Goals", comingSoon: true },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-background shadow-sidebar z-50 transition-all duration-300 flex flex-col ${
        collapsed ? "w-[80px]" : "w-[280px]"
      }`}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            T
          </div>
        </div>
        <button
          onClick={onToggle}
          className="w-6 h-6 rounded-full border border-divider flex items-center justify-center text-text-secondary hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Menu Label */}
      {!collapsed && (
        <div className="px-6 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Menu
          </span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem key={item.label} item={item} collapsed={collapsed} />
        ))}

        {/* Coming Soon Section */}
        {!collapsed && (
          <div className="px-3 pt-4 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-disabled">
              Coming Soon
            </span>
          </div>
        )}
        {comingSoonItems.map((item) => (
          <SidebarItem key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User */}
      <div className="p-4 flex items-center gap-3 border-t border-divider">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-sm font-semibold text-foreground">T</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">User</span>
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 h-11 rounded-lg px-3 transition-colors text-sm font-normal ${
        item.active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : item.comingSoon
          ? "text-text-disabled cursor-default"
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
