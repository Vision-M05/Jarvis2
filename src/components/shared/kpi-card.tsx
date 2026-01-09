import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: number;
    trendLabel?: string;
    subValue?: string | number;
    subLabel?: string;
    variant?: "default" | "warning" | "danger";
    className?: string;
}

export function KPICard({
    label,
    value,
    icon,
    trend,
    trendLabel,
    subValue,
    subLabel,
    variant = "default",
    className,
}: KPICardProps) {
    const isPositiveTrend = trend && trend > 0;
    const isNegativeTrend = trend && trend < 0;

    return (
        <Card className={cn("p-6", className)}>
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    {subValue !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{subLabel || ""}</span>
                            <span className="text-xs text-blue-600 font-medium">{subValue}</span>
                        </div>
                    )}
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {label}
                    </p>
                    <p
                        className={cn(
                            "text-2xl font-bold",
                            variant === "warning" && "text-orange-600",
                            variant === "danger" && "text-red-600"
                        )}
                    >
                        {value}
                    </p>
                    {trendLabel && (
                        <p className="text-xs text-muted-foreground">{trendLabel}</p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    {icon && (
                        <div
                            className={cn(
                                "rounded-lg p-2",
                                variant === "default" && "bg-blue-50 text-blue-600",
                                variant === "warning" && "bg-orange-50 text-orange-600",
                                variant === "danger" && "bg-red-50 text-red-600"
                            )}
                        >
                            {icon}
                        </div>
                    )}
                    {trend !== undefined && (
                        <div
                            className={cn(
                                "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                                isPositiveTrend && "bg-emerald-50 text-emerald-600",
                                isNegativeTrend && "bg-red-50 text-red-600",
                                !isPositiveTrend && !isNegativeTrend && "bg-slate-50 text-slate-600"
                            )}
                        >
                            {isPositiveTrend && <TrendingUp className="h-3 w-3" />}
                            {isNegativeTrend && <TrendingDown className="h-3 w-3" />}
                            <span>{isPositiveTrend ? "+" : ""}{trend}%</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
