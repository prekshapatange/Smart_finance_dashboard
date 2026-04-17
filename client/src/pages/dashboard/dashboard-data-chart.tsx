import * as React from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EmptyState } from "@/components/empty-state";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { DateRangeType } from "@/components/date-range-select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format-currency";
import { useChartAnalyticsQuery } from "@/features/analytics/analyticsAPI";
import { useTheme } from "@/context/theme-provider";
import { cn } from "@/lib/utils";

interface PropsType {
  dateRange?: DateRangeType;
}

const LIGHT_COLORS = ["#10b981", "#ef4444"];
const HARRY_POTTER_COLORS = ["#22c55e", "#f43f5e"];

const TRANSACTION_TYPES = ["income", "expenses"];

const DashboardDataChart: React.FC<PropsType> = (props) => {
  const { dateRange } = props;
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isHarryPotter = theme === "harry-potter";

  const colors = isHarryPotter ? HARRY_POTTER_COLORS : LIGHT_COLORS;

  const chartConfig = {
    income: {
      label: "Income",
      color: colors[0],
    },
    expenses: {
      label: "Expenses",
      color: colors[1],
    },
  } satisfies ChartConfig;

  const { data, isFetching } = useChartAnalyticsQuery({
    preset: dateRange?.value,
  });
  const chartData = data?.data?.chartData || [];
  const totalExpenseCount = data?.data?.totalExpenseCount || 0;
  const totalIncomeCount = data?.data?.totalIncomeCount || 0;

  if (isFetching) {
    return <ChartSkeleton isHarryPotter={isHarryPotter} />;
  }

  const titleColor = isHarryPotter ? "text-amber-100" : "text-gray-900";
  const descriptionColor = isHarryPotter ? "text-amber-200/70" : "text-gray-600";
  const countTextColor = isHarryPotter ? "text-white" : "text-gray-800";
  const subTextColor = isHarryPotter ? "text-amber-200/70" : "text-gray-500";

  return (
    <Card className={cn(
      "border transition-all shadow-xl relative overflow-hidden group",
      isHarryPotter 
        ? "backdrop-blur-md bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-violet-900/30 border-purple-500/20 hover:border-purple-400/30"
        : "bg-white border-gray-200 hover:border-gray-300"
    )}>
      {isHarryPotter && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-purple-400/10 to-transparent rounded-full blur-3xl" />
        </>
      )}
      
      <CardHeader
        className={cn(
          "flex flex-col items-stretch !space-y-0 !p-0 pr-1 sm:flex-row relative z-10",
          isHarryPotter ? "border-b border-purple-500/20" : "border-b border-gray-200"
        )}
      >
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-5">
          <CardTitle className={cn("text-lg font-semibold tracking-wide", titleColor)}>
            Transaction Overview
          </CardTitle>
          <CardDescription className={descriptionColor}>
            <span>Showing total transactions {dateRange?.label}</span>
          </CardDescription>
        </div>
        <div className="flex">
          {TRANSACTION_TYPES.map((key, index) => {
            const chart = key as keyof typeof chartConfig;
            const borderColor = isHarryPotter ? "border-purple-500/20" : "border-gray-200";
            
            return (
              <div
                key={chart}
                className={cn(
                  "flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l sm:border-l sm:px-4 sm:py-6 min-w-36",
                  isHarryPotter ? "backdrop-blur-sm" : "bg-gray-50/50",
                  borderColor
                )}
              >
                <span className={cn("w-full block text-xs tracking-wide", subTextColor)}>
                  No of {chartConfig[chart].label}
                </span>
                <span className={cn("flex items-center justify-center gap-2 text-lg font-semibold leading-none sm:text-3xl", countTextColor)}>
                  {index === 0 ? (
                    <TrendingUpIcon className={cn("size-3 ml-2", isHarryPotter ? "text-emerald-400" : "text-emerald-600")} />
                  ) : (
                    <TrendingDownIcon className={cn("size-3 ml-2", isHarryPotter ? "text-rose-400" : "text-rose-600")} />
                  )}
                  {index === 0 ? totalIncomeCount : totalExpenseCount}
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-2 h-[300px] relative z-10">
        {chartData?.length === 0 ? (
          <EmptyState
            title="No transaction data"
            description="There are no transactions recorded for this period."
          />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <AreaChart data={chartData || []}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={isHarryPotter ? 0.8 : 0.6} />
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={isHarryPotter ? 0.1 : 0.05} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[1]} stopOpacity={isHarryPotter ? 0.8 : 0.6} />
                  <stop offset="95%" stopColor={colors[1]} stopOpacity={isHarryPotter ? 0.1 : 0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isHarryPotter ? "#8b5cf6" : "#e5e7eb"} 
                opacity={isHarryPotter ? 0.1 : 0.3} 
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={isMobile ? 20 : 25}
                tick={{ 
                  fill: isHarryPotter ? '#fbbf24' : '#6b7280', 
                  opacity: isHarryPotter ? 0.8 : 0.7,
                  fontSize: isMobile ? 11 : 12
                }}
                tickFormatter={(value) =>
                  format(new Date(value), isMobile ? "MMM d" : "MMMM d, yyyy")
                }
              />
              <ChartTooltip
                cursor={{
                  stroke: isHarryPotter ? "#c084fc" : "#9ca3af",
                  strokeWidth: 2,
                  strokeDasharray: "3 3",
                }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      format(new Date(value), "MMM d, yyyy")
                    }
                    indicator="line"
                    formatter={(value, name) => {
                      const isExpense = name === "expenses";
                      const color = isExpense ? colors[1] : colors[0];
                      return [
                        <span key={name} style={{ color, fontWeight: '600' }}>
                          {formatCurrency(Number(value), {
                            showSign: true,
                            compact: true,
                            isExpense,
                          })}
                        </span>,
                        isExpense ? "Expenses" : "Income",
                      ];
                    }}
                  />
                }
              />
              <Area
                dataKey="expenses"
                stackId="1"
                type="monotone"
                fill="url(#expensesGradient)"
                stroke={colors[1]}
                strokeWidth={2}
                className="drop-shadow-lg"
              />
              <Area
                dataKey="income"
                stackId="1"
                type="monotone"
                fill="url(#incomeGradient)"
                stroke={colors[0]}
                strokeWidth={2}
                className="drop-shadow-lg"
              />
              <ChartLegend
                verticalAlign="bottom"
                content={<ChartLegendContent />}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

const ChartSkeleton = ({ isHarryPotter }: { isHarryPotter: boolean }) => (
  <Card className={cn(
    "border transition-all",
    isHarryPotter 
      ? "backdrop-blur-md bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-violet-900/30 border-purple-500/20"
      : "bg-white border-gray-200"
  )}>
    <CardHeader className={cn(
      "flex flex-col items-stretch !space-y-0 !p-0 pr-1 sm:flex-row",
      isHarryPotter ? "border-b border-purple-500/20" : "border-b border-gray-200"
    )}>
      <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-5">
        <Skeleton className={cn("h-6 w-48", isHarryPotter ? "bg-white/20" : "bg-gray-300")} />
        <Skeleton className={cn("h-4 w-32 mt-1", isHarryPotter ? "bg-white/20" : "bg-gray-300")} />
      </div>
      <div className="flex">
        {[1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l sm:border-l sm:px-4 sm:py-6 min-w-36",
              isHarryPotter ? "border-purple-500/20" : "border-gray-200"
            )}
          >
            <Skeleton className={cn("h-4 w-20 mx-auto", isHarryPotter ? "bg-white/20" : "bg-gray-300")} />
            <Skeleton className={cn("h-8 w-24 mx-auto mt-1 sm:h-12", isHarryPotter ? "bg-white/20" : "bg-gray-300")} />
          </div>
        ))}
      </div>
    </CardHeader>
    <CardContent className="px-2 pt-2 sm:px-6 sm:pt-2 h-[280px]">
      <Skeleton className={cn("h-full w-full", isHarryPotter ? "bg-white/10" : "bg-gray-200/50")} />
    </CardContent>
  </Card>
);

export default DashboardDataChart;