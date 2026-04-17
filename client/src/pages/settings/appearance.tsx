import { Separator } from "@/components/ui/separator"
import { AppearanceTheme } from "./_components/appearance-theme"
import { useTheme } from "@/context/theme-provider"

const Appearance = () => {
  const { theme } = useTheme()
  
  const isHarryPotter = theme === "harry-potter"
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-medium ${isHarryPotter ? "text-amber-400" : "text-gray-900"}`}>
          Appearance
        </h3>
        <p className={`text-sm ${isHarryPotter ? "text-amber-300/80" : "text-gray-600"}`}>
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator className={isHarryPotter ? "bg-gradient-to-r from-amber-500/20 to-transparent" : ""} />
      <AppearanceTheme />
    </div>
  )
}

export default Appearance