import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import { AlertTriangle, CheckCircleIcon } from "lucide-react"

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full", {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-50 text-slate-800",
        success: "bg-emerald-700 border-emerald-800 text-slate-50"
      }
    },
    defaultVariants: {
      variant: "warning",
    }
  }
)

interface BannerProps extends VariantProps<typeof bannerVariants>{
  label: string
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon
}

export const Banner = ({
  label,
  variant
}:BannerProps) => {

  const Icon = iconMap[variant || "warning"]

  return (
    <div className={cn(bannerVariants({variant}))}>
      <Icon className="h-4 w-4 mr-2" />
      <span>{label}</span>
    </div>
  )
}
