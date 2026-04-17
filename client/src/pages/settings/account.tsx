import { Separator } from "@/components/ui/separator"
import { AccountForm } from "./_components/account-form"
import { useTheme } from "@/context/theme-provider"

const Account = () => {
  const { theme } = useTheme()
  
  const isHarryPotter = theme === "harry-potter"
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-medium ${isHarryPotter ? "text-amber-400" : "text-gray-900"}`}>
          Account
        </h3>
        <p className={`text-sm ${isHarryPotter ? "text-amber-300/80" : "text-gray-600"}`}>
          Update your account settings.
        </p>
      </div>
      <Separator className={isHarryPotter ? "bg-gradient-to-r from-amber-500/20 to-transparent" : ""} />
      <AccountForm />
    </div>
  )
}

export default Account