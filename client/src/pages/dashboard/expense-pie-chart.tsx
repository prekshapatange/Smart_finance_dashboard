import * as React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateRangeType } from "@/components/date-range-select";
import { formatCurrency } from "@/lib/format-currency";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercentage } from "@/lib/format-percentage";
import { EmptyState } from "@/components/empty-state";
import { useExpensePieChartBreakdownQuery } from "@/features/analytics/analyticsAPI";
import { useTheme } from "@/context/theme-provider";
import { cn } from "@/lib/utils";

const LIGHT_COLORS = [
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#f97316",
];

const HARRY_POTTER_COLORS = [
  "#fbbf24",
  "#a855f7",
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#f97316",
];

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

const ExpensePieChart = (props: { dateRange?: DateRangeType }) => {
  const { dateRange } = props;
  const { theme } = useTheme();
  const isHarryPotter = theme === "harry-potter";

  const colors = isHarryPotter ? HARRY_POTTER_COLORS : LIGHT_COLORS;

  const { data, isFetching } = useExpensePieChartBreakdownQuery({
    preset: dateRange?.value,
  });
  const categories = data?.data?.breakdown || [];
  const totalSpent = data?.data?.totalSpent || 0;

  if (isFetching) {
    return <PieChartSkeleton isHarryPotter={isHarryPotter} />;
  }

  const titleColor = isHarryPotter ? "text-amber-100" : "text-gray-900";
  const descriptionColor = isHarryPotter ? "text-amber-200/70" : "text-gray-600";
  const legendTextColor = isHarryPotter ? "text-amber-100" : "text-gray-700";
  const legendSubTextColor = isHarryPotter ? "text-amber-200/80" : "text-gray-600";

  const CustomLegend = () => {
    return (
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 mt-4">
        {categories.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full shadow-lg"
              style={{ 
                backgroundColor: colors[index % colors.length],
                boxShadow: `0 0 8px ${colors[index % colors.length]}${isHarryPotter ? '40' : '20'}`
              }}
            ></div>
            <div className="flex justify-between w-full">
              <span className={cn("text-xs font-medium truncate capitalize", legendTextColor)}>
                {entry.name}
              </span>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs whitespace-nowrap", legendSubTextColor)}>
                  {formatCurrency(entry.value)}
                </span>
                <span className={cn("text-xs", isHarryPotter ? "text-amber-200/60" : "text-gray-500")}>
                  ({formatPercentage(entry.percentage, { decimalPlaces: 0 })})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={cn(
      "border transition-all shadow-xl relative overflow-hidden group",
      isHarryPotter 
        ? "backdrop-blur-md bg-gradient-to-br from-rose-900/30 via-pink-900/20 to-fuchsia-900/30 border-rose-500/20 hover:border-rose-400/30"
        : "bg-white border-gray-200 hover:border-gray-300"
    )}>
      {isHarryPotter && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-rose-400/10 to-transparent rounded-full blur-3xl" />
        </>
      )}
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className={cn("text-lg font-semibold tracking-wide", titleColor)}>
          Expenses Breakdown
        </CardTitle>
        <CardDescription className={descriptionColor}>
          Total expenses {dateRange?.label}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[313px] relative z-10">
        <div className="w-full">
          {categories?.length === 0 ? (
            <EmptyState
              title="No expenses found"
              description="There are no expenses recorded for this period."
            />
          ) : (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />

                <Pie
                  data={categories}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  strokeWidth={2}
                  stroke={isHarryPotter ? "rgba(139, 92, 246, 0.2)" : "rgba(156, 163, 175, 0.2)"}
                >
                  {categories.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      style={{
                        filter: `drop-shadow(0 0 8px ${colors[index % colors.length]}${isHarryPotter ? '60' : '30'})`
                      }}
                    />
                  ))}

                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className={cn(
                                "text-2xl font-bold drop-shadow-lg",
                                isHarryPotter ? "fill-white" : "fill-gray-900"
                              )}
                            >
                              ${totalSpent.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className={cn(
                                "text-xs",
                                isHarryPotter ? "fill-amber-200" : "fill-gray-500"
                              )}
                            >
                              Total Spent
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <ChartLegend content={<CustomLegend />} />
              </PieChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PieChartSkeleton = ({ isHarryPotter }: { isHarryPotter: boolean }) => (
  <Card className={cn(
    "border transition-all",
    isHarryPotter 
      ? "backdrop-blur-md bg-gradient-to-br from-rose-900/30 via-pink-900/20 to-fuchsia-900/30 border-rose-500/20"
      : "bg-white border-gray-200"
  )}>
    <CardHeader className="pb-2">
      <Skeleton className={cn("h-6 w-48", isHarryPotter ? "bg-white/20" : "bg-gray-300")} />
      <Skeleton className={cn("h-4 w-32 mt-1", isHarryPotter ? "bg-white/20" : "bg-gray-300")} />
    </CardHeader>
    <CardContent className="h-[313px]">
      <div className="w-full flex items-center justify-center">
        <div className="relative w-[200px] h-[200px]">
          <Skeleton className={cn("rounded-full w-full h-full", isHarryPotter ? "bg-white/10" : "bg-gray-200/50")} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Skeleton className={cn("h-8 w-24 mb-2", isHarryPotter ? "bg-white/20" : "bg-gray-300")} />
            <Skeleton className={cn("h-4 w-16", isHarryPotter ? "bg-white/20" : "bg-gray-300")} />
          </div>
        </div>
      </div>
      <div className="mt-0 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className={cn("h-3 w-3 rounded-full", isHarryPotter ? "bg-white/20" : "bg-gray-300")} />
              <Skeleton className={cn("h-4 w-20", isHarryPotter ? "bg-white/20" : "bg-gray-300")} />
            </div>
            <Skeleton className={cn("h-4 w-12", isHarryPotter ? "bg-white/20" : "bg-gray-300")} />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default ExpensePieChart;