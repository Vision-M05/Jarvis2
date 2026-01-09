"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AppShellProps {
    children: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    searchPlaceholder?: string;
}

export function AppShell({
    children,
    actionLabel,
    onAction,
    searchPlaceholder,
}: AppShellProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <div className="pl-64">
                <Header
                    actionLabel={actionLabel}
                    onAction={onAction}
                    searchPlaceholder={searchPlaceholder}
                />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
