"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { KPICard } from "@/components/shared/kpi-card";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { useDashboardStats, useRevenueChart, useRecentActivity } from "@/features/dashboard/hooks/use-dashboard";
import { formatCurrency } from "@/lib/utils";
import { Wallet, FileText, AlertCircle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function KPICardSkeleton() {
    return (
        <div className="rounded-xl border bg-white p-6">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: revenueData, isLoading: revenueLoading } = useRevenueChart();
    const { data: activities, isLoading: activitiesLoading } = useRecentActivity();

    return (
        <AppShell
            actionLabel="Nouveau Projet"
            onAction={() => router.push("/quotes")}
            searchPlaceholder="Rechercher..."
        >
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Tableau de Bord</h1>
                <p className="text-slate-500">
                    Bienvenue, voici un aperçu de votre activité aujourd&apos;hui.
                </p>
            </div>

            {/* KPI Cards - Now clickable */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {statsLoading ? (
                    <>
                        <KPICardSkeleton />
                        <KPICardSkeleton />
                        <KPICardSkeleton />
                        <KPICardSkeleton />
                    </>
                ) : (
                    <>
                        <div
                            onClick={() => router.push("/billing")}
                            className="cursor-pointer transition-transform hover:scale-[1.02]"
                        >
                            <KPICard
                                label="CHIFFRE D'AFFAIRES"
                                value={formatCurrency(stats?.revenue.value || 0)}
                                icon={<Wallet className="h-5 w-5" />}
                                trend={stats?.revenue.trend}
                            />
                        </div>

                        <div
                            onClick={() => router.push("/quotes?status=SENT")}
                            className="cursor-pointer transition-transform hover:scale-[1.02]"
                        >
                            <KPICard
                                label="DEVIS EN COURS"
                                value={formatCurrency(stats?.activeQuotes.value || 0)}
                                icon={<FileText className="h-5 w-5" />}
                                subValue={`${stats?.activeQuotes.count || 0} actifs`}
                            />
                        </div>

                        <div
                            onClick={() => router.push("/billing?status=LATE")}
                            className="cursor-pointer transition-transform hover:scale-[1.02]"
                        >
                            <KPICard
                                label="FACTURES IMPAYÉES"
                                value={formatCurrency(stats?.unpaidInvoices.value || 0)}
                                icon={<AlertCircle className="h-5 w-5" />}
                                variant="danger"
                                subValue={`${stats?.unpaidInvoices.count || 0} factures`}
                            />
                        </div>

                        <div
                            onClick={() => router.push("/quotes")}
                            className="cursor-pointer transition-transform hover:scale-[1.02]"
                        >
                            <KPICard
                                label="TAUX DE CONVERSION"
                                value={`${stats?.conversionRate.value || 0}%`}
                                icon={<TrendingUp className="h-5 w-5" />}
                                trend={stats?.conversionRate.trend}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {revenueLoading ? (
                    <div className="col-span-2 rounded-xl border bg-white p-6">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                ) : (
                    <RevenueChart data={revenueData || []} />
                )}

                {activitiesLoading ? (
                    <div className="rounded-xl border bg-white p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <RecentActivity activities={activities || []} />
                )}
            </div>
        </AppShell>
    );
}
