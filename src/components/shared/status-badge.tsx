import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { QuoteStatus, InvoiceStatus } from "@/lib/supabase/types";

const badgeVariants = cva(
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
    {
        variants: {
            variant: {
                default: "bg-primary/10 text-primary",
                signed: "bg-emerald-100 text-emerald-700",
                sent: "bg-blue-100 text-blue-700",
                draft: "bg-slate-100 text-slate-600",
                refused: "bg-red-100 text-red-700",
                pending: "bg-orange-100 text-orange-700",
                paid: "bg-emerald-100 text-emerald-700",
                late: "bg-red-100 text-red-700",
                // Categories
                gros_oeuvre: "bg-blue-100 text-blue-700",
                electricite: "bg-amber-100 text-amber-700",
                plomberie: "bg-cyan-100 text-cyan-700",
                isolation: "bg-purple-100 text-purple-700",
                menuiserie: "bg-emerald-100 text-emerald-700",
                peinture: "bg-pink-100 text-pink-700",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
    className?: string;
    children: React.ReactNode;
    showDot?: boolean;
}

export function StatusBadge({ className, variant, children, showDot = true }: StatusBadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), className)}>
            {showDot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            {children}
        </span>
    );
}

// Helper to get badge variant from status
export function getQuoteStatusVariant(status: QuoteStatus): "signed" | "sent" | "draft" | "refused" | "pending" {
    const map: Record<QuoteStatus, "signed" | "sent" | "draft" | "refused" | "pending"> = {
        SIGNED: "signed",
        SENT: "sent",
        DRAFT: "draft",
        REFUSED: "refused",
        PENDING: "pending",
    };
    return map[status];
}

export function getQuoteStatusLabel(status: QuoteStatus): string {
    const map: Record<QuoteStatus, string> = {
        SIGNED: "Signé",
        SENT: "Envoyé",
        DRAFT: "Brouillon",
        REFUSED: "Refusé",
        PENDING: "En Attente",
    };
    return map[status];
}

export function getInvoiceStatusVariant(status: InvoiceStatus): "paid" | "pending" | "late" {
    const map: Record<InvoiceStatus, "paid" | "pending" | "late"> = {
        PAID: "paid",
        PENDING: "pending",
        LATE: "late",
    };
    return map[status];
}

export function getCategoryVariant(category: string): "gros_oeuvre" | "electricite" | "plomberie" | "isolation" | "menuiserie" | "peinture" | "default" {
    const normalized = category.toLowerCase().replace(/\s+/g, "_").replace(/é/g, "e").replace(/œ/g, "oe");
    const map: Record<string, "gros_oeuvre" | "electricite" | "plomberie" | "isolation" | "menuiserie" | "peinture"> = {
        gros_oeuvre: "gros_oeuvre",
        electricite: "electricite",
        plomberie: "plomberie",
        isolation: "isolation",
        menuiserie: "menuiserie",
        peinture: "peinture",
    };
    return map[normalized] || "default";
}
