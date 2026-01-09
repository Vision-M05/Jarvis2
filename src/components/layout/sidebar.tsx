"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, CreditCard, Package, Settings, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
    { name: "Tableau de Bord", href: "/", icon: LayoutDashboard },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Devis", href: "/quotes", icon: FileText },
    { name: "À Facturer", href: "/billing", icon: CreditCard },
    { name: "Catalogue Prix", href: "/catalog", icon: Package },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-white border-r border-slate-200">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                    <span className="text-lg font-bold text-white">J</span>
                </div>
                <span className="text-xl font-bold text-slate-900">JarvisBTP</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Settings */}
            <div className="px-3 pb-3">
                <Link
                    href="/settings"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${pathname === "/settings"
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                >
                    <Settings className="h-5 w-5" />
                    Paramètres
                </Link>
            </div>

            {/* User Profile */}
            <div className="border-t border-slate-200 p-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatar.png" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">AP</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Admin Principal</p>
                        <p className="text-xs text-slate-500">JarvisBTP Pro</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
