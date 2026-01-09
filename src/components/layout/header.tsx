"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/shared/global-search";
import { NotificationsPopover } from "@/components/shared/notifications-popover";
import { Plus } from "lucide-react";

interface HeaderProps {
    actionLabel?: string;
    onAction?: () => void;
    searchPlaceholder?: string;
}

export function Header({ actionLabel, onAction, searchPlaceholder }: HeaderProps) {
    const pathname = usePathname();

    // Determine the action label based on current page if not provided
    const getDefaultAction = () => {
        switch (pathname) {
            case "/quotes":
                return "Nouveau Devis";
            case "/billing":
                return "Facturation Groupée";
            case "/catalog":
                return "Ajouter Article";
            default:
                return "Nouveau Projet";
        }
    };

    const label = actionLabel || getDefaultAction();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            {/* Search */}
            <GlobalSearch placeholder={searchPlaceholder} />

            {/* Actions */}
            <div className="flex items-center gap-3">
                <NotificationsPopover />

                {onAction ? (
                    <Button onClick={onAction} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {label}
                    </Button>
                ) : (
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        {label}
                    </Button>
                )}
            </div>
        </header>
    );
}
