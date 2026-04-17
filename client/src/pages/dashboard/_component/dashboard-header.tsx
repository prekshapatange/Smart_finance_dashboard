import { DateRangeSelect, DateRangeType } from "@/components/date-range-select";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import { Sparkles } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}

const DashboardHeader = ({ title, subtitle, dateRange, setDateRange }: Props) => {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between space-y-7 relative">
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-radial from-amber-400/20 to-transparent rounded-full blur-2xl animate-pulse" />
      <div className="space-y-1 relative z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent drop-shadow-lg">
            {title}
          </h2>
          <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
        </div>
        <p className="text-amber-200/70 text-sm tracking-wide">{subtitle}</p>
      </div>
      <div className="flex justify-end gap-4 mb-6 relative z-10">
        <DateRangeSelect 
          dateRange={dateRange || null} 
          setDateRange={(range) => setDateRange?.(range)} 
        />
        <AddTransactionDrawer />
      </div>
    </div>
  );
};

export default DashboardHeader;