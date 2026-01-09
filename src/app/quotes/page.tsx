"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { QuoteFilters } from "@/features/quotes/components/quote-filters";
import { QuoteTable } from "@/features/quotes/components/quote-table";
import { CreateQuoteModal } from "@/features/quotes/components/create-quote-modal";
import { useQuotes } from "@/features/quotes/hooks/use-quotes";
import { Skeleton } from "@/components/ui/skeleton";
import type { QuoteStatus } from "@/lib/supabase/types";

function TableSkeleton() {
    return (
        <div className="rounded-xl border bg-white">
            <div className="border-b px-6 py-4">
                <Skeleton className="h-6 w-48" />
            </div>
            <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function QuotesPage() {
    const [activeStatus, setActiveStatus] = useState<QuoteStatus | "ALL">("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, isLoading, isError, refetch } = useQuotes({
        status: activeStatus,
        page: currentPage,
        pageSize: 10,
    });

    const handleReset = () => {
        setActiveStatus("ALL");
        setCurrentPage(1);
    };

    const handleQuoteCreated = () => {
        refetch();
    };

    return (
        <AppShell
            actionLabel="Nouveau Devis"
            onAction={() => setIsCreateModalOpen(true)}
            searchPlaceholder="Rechercher un devis, un client..."
        >
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Gestion des Devis</h1>
                <p className="text-slate-500">
                    Créez, suivez et gérez l&apos;ensemble de vos propositions commerciales.
                </p>
            </div>

            {/* Filters */}
            <QuoteFilters
                activeStatus={activeStatus}
                onStatusChange={(status) => {
                    setActiveStatus(status);
                    setCurrentPage(1);
                }}
                onReset={handleReset}
            />

            {/* Table */}
            {isLoading ? (
                <TableSkeleton />
            ) : isError ? (
                <div className="rounded-xl border bg-white p-8 text-center">
                    <p className="text-red-600">Erreur lors du chargement des devis</p>
                </div>
            ) : (
                <QuoteTable
                    quotes={data?.data || []}
                    totalCount={data?.count || 0}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Create Quote Modal */}
            <CreateQuoteModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleQuoteCreated}
            />
        </AppShell>
    );
}
