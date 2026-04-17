import PageLayout from "@/components/page-layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@/context/theme-provider";

interface ItemPropsType {
  items: {
    title: string;
    href: string;
  }[];
}

const Settings = () => {
  const { theme } = useTheme()
  const isHarryPotter = theme === "harry-potter"
  
  const sidebarNavItems = [
    { title: "Account", href: PROTECTED_ROUTES.SETTINGS },
    { title: "Appearance", href: PROTECTED_ROUTES.SETTINGS_APPEARANCE },
  ];
  
  return (
    <PageLayout
      title="Settings"
      subtitle="Manage your account settings and customize your experience."
      addMarginTop
    >
      <Card className={`border shadow-none backdrop-blur-sm ${
        isHarryPotter 
          ? "bg-gradient-to-br from-[#0a0a1a]/90 via-[#1a0a2e]/80 to-[#2d1b4e]/90 border-amber-500/20" 
          : "bg-white border-gray-200"
      }`}>
        <CardContent>
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 pb-10 pt-2">
            <aside className="mr-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">
              <Outlet />
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

function SidebarNav({ items }: ItemPropsType) {
  const { pathname } = useLocation();
  const { theme } = useTheme()
  const isHarryPotter = theme === "harry-potter"
  
  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? isHarryPotter
                ? "bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10"
                : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
              : isHarryPotter
                ? "hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-purple-500/5 hover:text-amber-300 text-gray-300"
                : "hover:bg-gray-50 hover:text-gray-900 text-gray-700",
            "justify-start transition-all duration-300"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export default Settings;