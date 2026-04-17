import DashboardDataChart from "./dashboard-data-chart";
import DashboardSummary from "./dashboard-summary";
import PageLayout from "@/components/page-layout";
import ExpensePieChart from "./expense-pie-chart";
import DashboardRecentTransactions from "./dashboard-recent-transactions";
import { useState } from "react";
import { DateRangeType } from "@/components/date-range-select";
import HarryPotterBackground from "@/components/harry-potter-background";
import { useTheme } from "@/context/theme-provider";

const Dashboard = () => {
  const [dateRange, _setDateRange] = useState<DateRangeType>(null);
  const { theme } = useTheme();

  return (
    <>
      {theme === "harry-potter" && <HarryPotterBackground />}
      <div className="w-full flex flex-col relative z-10">
        <PageLayout
          className="space-y-6"
          renderPageHeader={
            <DashboardSummary
              dateRange={dateRange}
              setDateRange={_setDateRange}
            />
          }
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="lg:col-span-4">
              <DashboardDataChart dateRange={dateRange} />
            </div>
            <div className="lg:col-span-2">
              <ExpensePieChart dateRange={dateRange} />
            </div>
          </div>
          <div className="w-full mt-0">
            <DashboardRecentTransactions />
          </div>
        </PageLayout>
      </div>
    </>
  );
};

export default Dashboard;