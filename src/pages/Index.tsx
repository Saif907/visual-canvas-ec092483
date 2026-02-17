import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  WinRateCard,
  PnLCard,
  AccountBalanceCard,
  TradeCountCard,
  ProfitFactorCard,
  VolumeCard,
  AvgHoldingTimeCard,
  StreakCard,
} from "@/components/MetricCard";
import AccountBalancesChart from "@/components/AccountBalancesChart";
import DailyPnLChart from "@/components/DailyPnLChart";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

      <main
        className={`transition-all duration-300 p-6 pb-16 ${
          sidebarCollapsed ? "ml-[80px]" : "ml-[280px]"
        }`}
      >
        {/* Row 1: 4 metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <WinRateCard />
          <PnLCard />
          <AccountBalanceCard />
          <TradeCountCard />
        </div>

        {/* Row 2: 4 metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <ProfitFactorCard />
          <VolumeCard />
          <AvgHoldingTimeCard />
          <StreakCard />
        </div>

        {/* Row 3: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccountBalancesChart />
          <DailyPnLChart />
        </div>
      </main>
    </div>
  );
};

export default Index;
