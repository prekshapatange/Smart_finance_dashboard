import { Link } from "react-router-dom";
import TransactionTable from "@/components/transaction/transaction-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { ScrollText } from "lucide-react";
import { useTheme } from "@/context/theme-provider";
import { cn } from "@/lib/utils";

const DashboardRecentTransactions = () => {
  const { theme } = useTheme();
  const isHarryPotter = theme === "harry-potter";

  const titleColor = isHarryPotter ? "text-amber-100" : "text-gray-900";
  const descriptionColor = isHarryPotter ? "text-amber-200/70" : "text-gray-600";
  const iconColor = isHarryPotter ? "text-amber-400" : "text-indigo-600";
  const linkColor = isHarryPotter ? "!text-amber-300 hover:!text-amber-100" : "!text-indigo-600 hover:!text-indigo-700";
  const separatorColor = isHarryPotter ? "!bg-indigo-500/20" : "!bg-gray-200";

  return (
    <Card className={cn(
      "border transition-all shadow-xl relative overflow-hidden group",
      isHarryPotter 
        ? "backdrop-blur-md bg-gradient-to-br from-slate-900/40 via-indigo-900/30 to-violet-900/40 border-indigo-500/20 hover:border-indigo-400/30"
        : "bg-white border-gray-200 hover:border-gray-300"
    )}>
      {isHarryPotter && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-radial from-indigo-400/10 to-transparent rounded-full blur-3xl" />
        </>
      )}
      
      <CardHeader className="!pb-0 relative z-10">
        <div className="flex items-center gap-2">
          <ScrollText className={cn("w-5 h-5", iconColor)} />
          <CardTitle className={cn(
            "text-xl font-semibold tracking-wide",
            titleColor
          )}>
            Recent Transactions
          </CardTitle>
        </div>
        <CardDescription className={descriptionColor}>
          Showing all recent transactions
        </CardDescription>
        <CardAction>
          <Button
            asChild
            variant="link"
            className={cn(
              "!font-normal transition-colors",
              linkColor
            )}
          >
            <Link to={PROTECTED_ROUTES.TRANSACTIONS}>View all</Link>
          </Button>
        </CardAction>
        <Separator className={cn("mt-3", separatorColor)} />
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <TransactionTable pageSize={10} isShowPagination={false} />
      </CardContent>
    </Card>
  );
};

export default DashboardRecentTransactions;