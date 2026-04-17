import {
  Card,
  CardContent,
} from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";
import { useTheme } from "@/context/theme-provider";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default function Transactions() {
  const { theme } = useTheme();
  const isHarryPotter = theme === "harry-potter";

  return (
    <PageLayout
      title="All Transactions"
      subtitle="Showing all transactions"
      addMarginTop
      rightAction={
        <div className="flex items-center gap-2">
          <ImportTransactionModal />
          <AddTransactionDrawer />
        </div>
      }
    >
      <Card className={cn(
        "border transition-all shadow-xl relative overflow-hidden group",
        isHarryPotter 
          ? "backdrop-blur-md bg-gradient-to-br from-slate-900/30 via-indigo-900/20 to-violet-900/30 border-purple-500/20 hover:border-purple-400/30"
          : "bg-white border-gray-200 shadow-sm"
      )}>
        {isHarryPotter && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-purple-400/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-4 left-4">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </>
        )}
        <CardContent className={cn(
          "pt-2 relative z-10",
          isHarryPotter && "bg-gradient-to-b from-transparent to-purple-900/5"
        )}>
          <TransactionTable pageSize={20} />
        </CardContent>
      </Card>
    </PageLayout>
  );
}