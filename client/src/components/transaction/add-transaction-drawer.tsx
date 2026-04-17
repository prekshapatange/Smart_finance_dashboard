import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import TransactionForm from "./transaction-form";
import { useTheme } from "@/context/theme-provider";
import { cn } from "@/lib/utils";

const AddTransactionDrawer = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const isHarryPotter = theme === "harry-potter";

  const onCloseDrawer = () => {
    setOpen(false);
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className={cn(
          "!cursor-pointer !text-white transition-all shadow-lg hover:shadow-xl",
          isHarryPotter 
            ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 border border-amber-500/20 shadow-amber-500/20"
            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-blue-500/20"
        )}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </DrawerTrigger>
      <DrawerContent className={cn(
        "max-w-md overflow-hidden overflow-y-auto transition-colors",
        isHarryPotter 
          ? "bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2e] to-[#2d1b4e]"
          : "bg-white"
      )}>
        <DrawerHeader className={cn(
          "relative p-6 border-b",
          isHarryPotter 
            ? "border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-transparent"
            : "border-gray-200"
        )}>
         <div>
            <DrawerTitle className={cn(
              "text-xl font-semibold",
              isHarryPotter ? "text-amber-100" : "text-gray-900"
            )}>
              Add Transaction
            </DrawerTitle>
            <DrawerDescription className={isHarryPotter ? "text-amber-200/70" : "text-gray-600"}>
              Add a new transaction to track your finances
            </DrawerDescription>
         </div>
          <DrawerClose className="absolute top-6 right-6">
            <XIcon className={cn(
              "h-5 w-5 !cursor-pointer transition-colors",
              isHarryPotter 
                ? "text-amber-300 hover:text-amber-100" 
                : "text-gray-500 hover:text-gray-700"
            )} />
          </DrawerClose>
        </DrawerHeader>
        <TransactionForm 
          onCloseDrawer={onCloseDrawer}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default AddTransactionDrawer;