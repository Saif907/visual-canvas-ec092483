import { useState } from "react";
import { Bell, Users, Eye, Calendar, X, MessageCircle, Palette } from "lucide-react";
import ThemeSettings from "@/components/ThemeSettings";
import { useTheme } from "@/contexts/ThemeContext";

interface DashboardHeaderProps {
  sidebarCollapsed: boolean;
}

export default function DashboardHeader({ sidebarCollapsed }: DashboardHeaderProps) {
  const [themeOpen, setThemeOpen] = useState(false);
  const { skin } = useTheme();

  // Skin-specific header structural styles
  const isFloating = skin === "midnight-glass";
  const marginLeft = sidebarCollapsed ? "ml-[80px]" : "ml-[280px]";

  return (
    <>
      <header
        className={`sticky top-0 z-40 h-16 flex items-center justify-between px-6 backdrop-blur-[20px] border-b transition-all duration-300 header-bar ${marginLeft}`}
        style={{
          backgroundColor: skin === "carbon-terminal" ? "transparent" : skin === "midnight-glass" ? undefined : "hsl(var(--sidebar-background))",
          borderColor: skin === "carbon-terminal" ? undefined : "hsl(var(--sidebar-border))",
          boxShadow: skin === "carbon-terminal" || skin === "midnight-glass" ? undefined : "0 1px 0 0 hsl(var(--sidebar-border)), 0 4px 16px -4px hsl(213 22% 5% / 0.15)",
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Users size={18} />
            <span>No Accounts</span>
            <ChevronDown />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-success hover:bg-secondary transition-colors">
            <Users size={20} />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-secondary transition-colors">
            <Eye size={20} />
          </button>

          {/* Date filter */}
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-divider text-sm text-foreground">
            <Calendar size={16} className="text-text-secondary" />
            <span>All Time</span>
            <X size={14} className="text-text-secondary cursor-pointer" />
          </div>

          <button className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-secondary transition-colors relative">
            <Bell size={20} />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-secondary transition-colors relative">
            <MessageCircle size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-loss" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setThemeOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-secondary transition-colors"
            title="Theme settings"
          >
            <Palette size={20} />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-foreground" style={{ backgroundColor: "hsl(36, 100%, 50%)" }}>
            T
          </div>
        </div>
      </header>

      <ThemeSettings open={themeOpen} onClose={() => setThemeOpen(false)} />
    </>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-secondary">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
