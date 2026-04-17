import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme-provider"
import { Sparkles, Wand2, Sun, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppearanceTheme() {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(theme)

  const handleThemeChange = (value: "light" | "harry-potter") => {
    setSelectedTheme(value)
  }

  const handleUpdateTheme = () => {
    setTheme(selectedTheme)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className={`text-sm font-medium ${theme === "harry-potter" ? "text-amber-300" : "text-gray-800"}`}>
          Theme
        </h4>
        <p className={`text-sm ${theme === "harry-potter" ? "text-amber-300/80" : "text-gray-600"}`}>
          Select the theme for the dashboard.
        </p>
        <RadioGroup
          value={selectedTheme}
          onValueChange={handleThemeChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl pt-4"
        >
          {/* Light Theme - IMPROVED */}
          <div>
            <Label className="flex flex-col cursor-pointer [&:has([data-state=checked])>div]:border-blue-500 [&:has([data-state=checked])>div]:shadow-blue-500/30 [&:has([data-state=checked])>div]:shadow-lg">
              <RadioGroupItem value="light" className="sr-only" />
              <div className={cn(
                "items-center rounded-xl border-2 p-1 transition-all relative overflow-hidden group",
                selectedTheme === "light" 
                  ? "border-blue-500 shadow-lg shadow-blue-500/20" 
                  : "border-gray-200 hover:border-blue-400"
              )}>
                {selectedTheme === "light" && (
                  <div className="absolute top-2 right-2 z-20">
                    <div className="bg-blue-500 rounded-full p-1 shadow-lg">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="space-y-3 rounded-lg bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm">
                  {/* Card Header */}
                  <div className="space-y-3 rounded-lg bg-white p-3 shadow-md border border-gray-200">
                    <div className="h-2.5 w-[90px] rounded-lg bg-gradient-to-r from-blue-500 to-blue-600" />
                    <div className="h-2.5 w-[120px] rounded-lg bg-gradient-to-r from-blue-400 to-blue-500" />
                  </div>
                  {/* Card Items */}
                  <div className="flex items-center space-x-2 rounded-lg bg-white p-3 shadow-sm border border-gray-100">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600" />
                    <div className="h-2.5 w-[110px] rounded-lg bg-gradient-to-r from-gray-300 to-gray-400" />
                  </div>
                  {/* <div className="flex items-center space-x-2 rounded-lg bg-white p-3 shadow-sm border border-gray-100">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600" />
                    <div className="h-2.5 w-[110px] rounded-lg bg-gradient-to-r from-gray-300 to-gray-400" />
                  </div> */}
                  {/* Button Example */}
                  <div className="rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-3 border border-blue-200">
                    <div className="h-2.5 w-full rounded-lg bg-gradient-to-r from-blue-500/40 to-blue-600/40" />
                  </div>
                </div>
              </div>
              <p className="flex items-center justify-center gap-2 w-full p-3 text-center font-medium text-gray-800">
                <Sun className="w-4 h-4 text-blue-600" />
                Light Theme
              </p>
            </Label>
          </div>

          {/* Harry Potter Theme - ENHANCED */}
          <div>
            <Label className="flex flex-col cursor-pointer [&:has([data-state=checked])>div]:border-amber-500 [&:has([data-state=checked])>div]:shadow-amber-500/40 [&:has([data-state=checked])>div]:shadow-2xl">
              <RadioGroupItem value="harry-potter" className="sr-only" />
              <div className={cn(
                "items-center rounded-xl border-2 p-1 transition-all relative overflow-hidden group",
                selectedTheme === "harry-potter"
                  ? "border-amber-500 shadow-2xl shadow-amber-500/30"
                  : "border-gray-200 hover:border-amber-500"
              )}>
                {selectedTheme === "harry-potter" && (
                  <div className="absolute top-2 right-2 z-20">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-full p-1 shadow-lg shadow-amber-500/50">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 z-10">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse drop-shadow-lg" />
                </div>
                <div className="space-y-3 rounded-lg bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2e] to-[#2d1b4e] p-4 relative">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAyMCAwIEwgMjAgMjAgTCAwIDIwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNDUsIDE1OCwgMTEsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                  {/* Card Header */}
                  <div className="space-y-3 rounded-lg bg-gradient-to-br from-purple-900/50 via-indigo-900/40 to-violet-900/50 backdrop-blur-sm p-3 shadow-2xl border border-amber-500/30 relative z-10">
                    <div className="h-2.5 w-[90px] rounded-lg bg-gradient-to-r from-amber-400/90 to-yellow-500/80 shadow-lg shadow-amber-500/50" />
                    <div className="h-2.5 w-[120px] rounded-lg bg-gradient-to-r from-amber-400/70 to-yellow-500/60 shadow-md shadow-amber-500/40" />
                  </div>
                  {/* Card Items */}
                  <div className="flex items-center space-x-2 rounded-lg bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-violet-900/40 backdrop-blur-sm p-3 shadow-lg border border-purple-500/20 relative z-10">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/50" />
                    <div className="h-2.5 w-[110px] rounded-lg bg-gradient-to-r from-amber-400/60 to-amber-600/40" />
                  </div>
                  {/* <div className="flex items-center space-x-2 rounded-lg bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-violet-900/40 backdrop-blur-sm p-3 shadow-lg border border-purple-500/20 relative z-10">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/50" />
                    <div className="h-2.5 w-[110px] rounded-lg bg-gradient-to-r from-emerald-400/60 to-emerald-600/40" />
                  </div> */}
                  {/* Button Example */}
                  <div className="rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/10 p-3 border border-amber-500/30 backdrop-blur-sm relative z-10">
                    <div className="h-2.5 w-full rounded-lg bg-gradient-to-r from-amber-400/50 to-yellow-500/40" />
                  </div>
                </div>
              </div>
              <p className="flex items-center justify-center gap-2 w-full p-3 text-center font-medium text-amber-400">
                <Wand2 className="w-4 h-4 text-amber-500" />
                Magical Theme
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Button
        type="button"
        className={cn(
          "mt-4 text-white border transition-all hover:shadow-xl",
          selectedTheme === "harry-potter"
            ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 border-amber-500/20 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-blue-500/20 shadow-sm hover:shadow-blue-500/20"
        )}
        onClick={handleUpdateTheme}
      >
        {selectedTheme === "harry-potter" ? (
          <Wand2 className="w-4 h-4 mr-2" />
        ) : (
          <Sun className="w-4 h-4 mr-2" />
        )}
        Update preferences
      </Button>
    </div>
  )
}