"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KPICard } from "@/components/shared/kpi-card";
import { BillingTable } from "@/features/billing/components/billing-table";
import { useInvoicesToBill, useBillingStats } from "@/features/billing/hooks/use-invoices";
import { useToast } from "@/components/shared/toast-provider";
import { formatCurrency } from "@/lib/utils";
import { Wallet, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function KPICardSkeleton() {
    return (
        <div className="rounded-xl border bg-white p-6">
            <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
    );
}

function TableSkeleton() {
    return (
        <div className="rounded-xl border bg-white">
            <div className="border-b px-6 py-4">
                <Skeleton className="h-6 w-64" />
            </div>
            <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-2 w-32" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function BillingPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const { addToast } = useToast();

    const { data: stats, isLoading: statsLoading } = useBillingStats();
    const { data: invoicesData, isLoading: invoicesLoading, isError, refetch } = useInvoicesToBill({
        page: currentPage,
        pageSize: 4,
    });

    const handleGenerateInvoice = (invoiceId: string) => {
        console.log("Generate invoice:", invoiceId);
        refetch();
    };

    const handleBatchInvoicing = async () => {
        setIsBatchProcessing(true);

        // Simulate batch processing
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setIsBatchProcessing(false);
        setIsBatchModalOpen(false);

        addToast({
            type: "success",
            title: "Facturation groupée terminée",
            message: `${invoicesData?.count || 0} factures générées avec succès`,
        });

        refetch();
    };

    return (
        <AppShell
            actionLabel="Facturation Groupée"
            onAction={() => setIsBatchModalOpen(true)}
            searchPlaceholder="Rechercher une facture, un client..."
        >
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Gestion de la Facturation</h1>
                <p className="text-slate-500">
                    Suivez les chantiers terminés et générez vos factures en un clic.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
                {statsLoading ? (
                    <>
                        <KPICardSkeleton />
                        <KPICardSkeleton />
                        <KPICardSkeleton />
                    </>
                ) : (
                    <>
                        <KPICard
                            label="Total à facturer"
                            value={formatCurrency(stats?.totalToBill || 0)}
                            icon={<Wallet className="h-5 w-5" />}
                            trendLabel={`${stats?.pendingCount || 0} dossiers en attente`}
                        />
                        <KPICard
                            label="Factures en retard"
                            value={formatCurrency(stats?.totalLate || 0)}
                            icon={<AlertTriangle className="h-5 w-5" />}
                            variant="danger"
                            trendLabel={`${stats?.lateCount || 0} relances nécessaires`}
                        />
                        <KPICard
                            label="Taux de Conversion"
                            value={`${stats?.conversionRate || 0}%`}
                            icon={<TrendingUp className="h-5 w-5" />}
                            trend={4}
                            trendLabel="vs. mois dernier"
                        />
                    </>
                )}
            </div>

            {/* Table */}
            {invoicesLoading ? (
                <TableSkeleton />
            ) : isError ? (
                <div className="rounded-xl border bg-white p-8 text-center">
                    <p className="text-red-600">Erreur lors du chargement des factures</p>
                </div>
            ) : (
                <BillingTable
                    invoices={invoicesData?.data || []}
                    totalCount={invoicesData?.count || 0}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onGenerateInvoice={handleGenerateInvoice}
                />
            )}

            {/* Batch Invoicing Modal */}
            <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Facturation Groupée</DialogTitle>
                        <DialogDescription>
                            Générer toutes les factures en attente en une seule opération.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="rounded-lg bg-blue-50 p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Factures à générer</span>
                                <span className="font-semibold">{invoicesData?.count || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Montant total HT</span>
                                <span className="font-semibold text-blue-600">
                                    {formatCurrency(stats?.totalToBill || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-blue-100 pt-2 mt-2">
                                <span className="text-sm font-medium">Montant total TTC</span>
                                <span className="font-bold text-lg">
                                    {formatCurrency((stats?.totalToBill || 0) * 1.2)}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 mt-4">
                            Cette action va générer un PDF pour chaque facture et les préparer pour l&apos;envoi.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsBatchModalOpen(false)}
                            disabled={isBatchProcessing}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleBatchInvoicing}
                            disabled={isBatchProcessing}
                        >
                            {isBatchProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Génération en cours...
                                </>
                            ) : (
                                "Générer toutes les factures"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppShell>
    );
}
