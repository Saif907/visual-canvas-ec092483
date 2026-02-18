import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Table2 } from "lucide-react";

export default function Trades() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <DashboardHeader sidebarCollapsed={collapsed} />

      <main
        className={`transition-all duration-300 pt-6 pb-16 px-6 ${
          collapsed ? "ml-[80px]" : "ml-[280px]"
        }`}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Table2 size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Trades</h1>
            <p className="text-sm text-muted-foreground mt-0.5">View and manage your closed trades</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <Table2 size={40} className="text-muted-foreground mb-4 opacity-40" />
          <p className="text-foreground font-semibold mb-1">No trades yet</p>
          <p className="text-sm text-muted-foreground">Your closed trades will appear here.</p>
        </div>
      </main>
    </div>
  );
}
