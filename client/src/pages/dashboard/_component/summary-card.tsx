import { FC } from "react";
import CountUp from "react-countup";
import { TrendingDownIcon, TrendingUpIcon, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { formatPercentage } from "@/lib/format-percentage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DateRangeEnum, DateRangeType } from "@/components/date-range-select";
import { useTheme } from "@/context/theme-provider";

type CardType = "balance" | "income" | "expenses" | "savings";
type CardStatus = {
  label: string;
  color: string;
  Icon: LucideIcon;
  description?: string;
};

interface SummaryCardProps {
  title: string;
  value?: number;
  dateRange?: DateRangeType;
  percentageChange?: number;
  isPercentageValue?: boolean;
  isLoading?: boolean;
  expenseRatio?: number;
  cardType: CardType;
}

const getCardStatus = (
  value: number,
  cardType: CardType,
  expenseRatio?: number
): CardStatus => {
  if (cardType === "savings") {
    if (value === 0) {
      return {
        label: "No Savings Record",
        color: "text-gray-500",
        Icon: TrendingDownIcon,
      };
    }

    if (value < 10) {
      return {
        label: "Low Savings",
        color: "text-red-500",
        Icon: TrendingDownIcon,
        description: `Only ${value.toFixed(1)}% saved`,
      };
    }

    if (value < 20) {
      return {
        label: "Moderate",
        color: "text-yellow-500",
        Icon: TrendingDownIcon,
        description: `${expenseRatio?.toFixed(0)}% spent`,
      };
    }

    if (expenseRatio && expenseRatio > 75) {
      return {
        label: "High Spend",
        color: "text-red-500",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }

    if (expenseRatio && expenseRatio > 60) {
      return {
        label: "Warning: High Spend",
        color: "text-orange-500",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }

    return {
      label: "Good Savings",
      color: "text-green-500",
      Icon: TrendingUpIcon,
    };
  }

  if (value === 0) {
    const typeLabel =
      cardType === "income"
        ? "Income"
        : cardType === "expenses"
          ? "Expenses"
          : "Balance";

    return {
      label: `No ${typeLabel}`,
      color: "text-gray-500",
      Icon: TrendingDownIcon,
      description: ``,
    };
  }

  if (cardType === "balance" && value < 0) {
    return {
      label: "Overdrawn",
      color: "text-red-500",
      Icon: TrendingDownIcon,
      description: "Balance is negative",
    };
  }

  return {
    label: "",
    color: "",
    Icon: TrendingDownIcon,
  };
};

const getTrendDirection = (value: number, cardType: CardType) => {
  if (cardType === "expenses") {
    return value <= 0 ? "positive" : "negative";
  }
  return value >= 0 ? "positive" : "negative";
};

const getCardGradient = (cardType: CardType, theme: string) => {
  if (theme === "light") {
    switch (cardType) {
      case "balance":
        return "from-purple-50 to-purple-100";
      case "income":
        return "from-emerald-50 to-emerald-100";
      case "expenses":
        return "from-rose-50 to-rose-100";
      case "savings":
        return "from-amber-50 to-amber-100";
    }
  }
  
  // Harry Potter theme
  switch (cardType) {
    case "balance":
      return "from-purple-900/40 via-purple-800/30 to-indigo-900/40";
    case "income":
      return "from-emerald-900/40 via-emerald-800/30 to-teal-900/40";
    case "expenses":
      return "from-rose-900/40 via-rose-800/30 to-red-900/40";
    case "savings":
      return "from-amber-900/40 via-amber-800/30 to-yellow-900/40";
  }
};

const getCardBorder = (cardType: CardType, theme: string) => {
  if (theme === "light") {
    switch (cardType) {
      case "balance":
        return "border-purple-200 hover:border-purple-300";
      case "income":
        return "border-emerald-200 hover:border-emerald-300";
      case "expenses":
        return "border-rose-200 hover:border-rose-300";
      case "savings":
        return "border-amber-200 hover:border-amber-300";
    }
  }
  
  // Harry Potter theme
  switch (cardType) {
    case "balance":
      return "border-purple-500/20 hover:border-purple-400/30";
    case "income":
      return "border-emerald-500/20 hover:border-emerald-400/30";
    case "expenses":
      return "border-rose-500/20 hover:border-rose-400/30";
    case "savings":
      return "border-amber-500/20 hover:border-amber-400/30";
  }
};

const SummaryCard: FC<SummaryCardProps> = ({
  title,
  value = 0,
  dateRange,
  percentageChange,
  isPercentageValue,
  isLoading,
  expenseRatio,
  cardType = "balance",
}) => {
  const { theme } = useTheme();
  const status = getCardStatus(value, cardType, expenseRatio);
  const showTrend =
    percentageChange !== undefined &&
    percentageChange !== null &&
    cardType !== "savings";

  const trendDirection =
    showTrend && percentageChange !== 0
      ? getTrendDirection(percentageChange, cardType)
      : null;

  if (isLoading) {
    return (
      <Card className={cn(
        "border transition-all duration-300 relative overflow-hidden group",
        theme === "harry-potter" && "backdrop-blur-md",
        "bg-gradient-to-br",
        getCardGradient(cardType, theme),
        getCardBorder(cardType, theme)
      )}>
        {theme === "harry-potter" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 !pb-5">
          <Skeleton className={cn("h-4 w-24", theme === "harry-potter" ? "bg-white/20" : "bg-gray-300")} />
        </CardHeader>
        <CardContent className="space-y-8">
          <Skeleton className={cn("h-10.5 w-full", theme === "harry-potter" ? "bg-white/20" : "bg-gray-300")} />
          <div className="flex items-center gap-2">
            <Skeleton className={cn("h-3 w-12", theme === "harry-potter" ? "bg-white/20" : "bg-gray-300")} />
            <Skeleton className={cn("h-3 w-16", theme === "harry-potter" ? "bg-white/20" : "bg-gray-300")} />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCountupValue = (val: number) => {
    return isPercentageValue
      ? formatPercentage(val, { decimalPlaces: 1 })
      : formatCurrency(val, {
          isExpense: cardType === "expenses",
          showSign: cardType === "balance" && val < 0,
        });
  };

  const textColor = theme === "light" ? "text-gray-900" : "text-white";
  const titleColor = theme === "light" ? "text-gray-700" : "text-amber-100/90";
  const subtextColor = theme === "light" ? "text-gray-500" : "text-amber-200/70";

  return (
    <Card className={cn(
      "border transition-all duration-300 relative overflow-hidden group hover:shadow-xl",
      theme === "harry-potter" && "backdrop-blur-md",
      "bg-gradient-to-br",
      getCardGradient(cardType, theme),
      getCardBorder(cardType, theme)
    )}>
      {theme === "harry-potter" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-radial from-white/5 to-transparent rounded-full blur-2xl" />
        </>
      )}
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 !pb-5 relative z-10">
        <CardTitle className={cn("text-[15px] font-medium tracking-wide", titleColor)}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 relative z-10">
        <div
          className={cn(
            "text-4xl font-bold tracking-tight",
            cardType === "balance" && value < 0 ? "text-red-500" : textColor,
            theme === "harry-potter" && "drop-shadow-lg"
          )}
        >
          <CountUp
            start={0}
            end={value}
            preserveValue
            decimals={2}
            decimalPlaces={2}
            formattingFn={formatCountupValue}
          />
        </div>

        <div className="text-sm mt-2">
          {cardType === "savings" ? (
            <div className="flex items-center gap-1.5">
              <status.Icon className={cn("size-3.5", status.color)} />
              <span className={status.color}>
                {status.label} {value !== 0 && `(${formatPercentage(value)})`}
              </span>
              {status.description && (
                <span className={subtextColor}>
                  • {status.description}
                </span>
              )}
            </div>
          ) : dateRange?.value === DateRangeEnum.ALL_TIME ? (
            <span className={subtextColor}>Showing {dateRange?.label}</span>
          ) : value === 0 || status.label ? (
            <div className="flex items-center gap-1.5">
              <status.Icon className={cn("size-3.5", status.color)} />
              <span className={status.color}>{status.label}</span>
              {status.description && (
                <span className={subtextColor}>• {status.description}</span>
              )}
              {!status.description && (
                <span className={subtextColor}>• {dateRange?.label}</span>
              )}
            </div>
          ) : showTrend ? (
            <div className="flex items-center gap-1.5">
              {percentageChange !== 0 && (
                <div
                  className={cn(
                    "flex items-center gap-0.5",
                    trendDirection === "positive"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  )}
                >
                  {trendDirection === "positive" ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  <span>
                    {formatPercentage(percentageChange || 0, {
                      showSign: percentageChange !== 0,
                      isExpense: cardType === "expenses",
                      decimalPlaces: 1,
                    })}
                  </span>
                </div>
              )}

              {percentageChange === 0 && (
                <div className={cn("flex items-center gap-0.5", subtextColor)}>
                  <TrendingDownIcon className="size-3" />
                  <span>
                    {formatPercentage(0, {
                      showSign: false,
                      decimalPlaces: 1,
                    })}
                  </span>
                </div>
              )}
              <span className={subtextColor}>• {dateRange?.label}</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;