"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { GenerateInvoiceModal } from "./generate-invoice-modal";
import { Filter } from "lucide-react";
import type { Invoice, Quote, Client } from "@/lib/supabase/types";

export interface BillingTableProps {
    invoices: (Invoice & {
        quote?: (Quote & {
            client?: { id: string; name: string } | null;
        }) | null;
    })[];
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onGenerateInvoice: (invoiceId: string) => void;
}

export function BillingTable({
    invoices,
    totalCount,
    currentPage,
    onPageChange,
    onGenerateInvoice,
}: BillingTableProps) {
    const pageSize = 4;
    const totalPages = Math.ceil(totalCount / pageSize);
    // Explicitly reusing the type from props for the state
    const [selectedInvoice, setSelectedInvoice] = useState<BillingTableProps["invoices"][0] | null>(null);

    const getProgressColor = (percentage: number, isLate: boolean) => {
        if (isLate) return "bg-red-500";
        if (percentage === 0) return "bg-slate-300";
        if (percentage < 50) return "bg-blue-500";
        return "bg-blue-600";
    };

    const handleGenerateClick = (invoice: Invoice & {
        quote?: (Quote & {
            client?: { id: string; name: string } | null;
        }) | null;
    }) => {
        setSelectedInvoice(invoice);
    };

    const handleInvoiceSuccess = () => {
        if (selectedInvoice) {
            onGenerateInvoice(selectedInvoice.id);
        }
    };

    return (
        <>
            <div className="rounded-xl border bg-white">
                {/* Table Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h3 className="text-lg font-semibold">Chantiers prêts à la facturation</h3>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtrer
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Référence Devis</th>
                                <th className="px-6 py-3">Date de Fin</th>
                                <th className="px-6 py-3">Progression Facturation</th>
                                <th className="px-6 py-3 text-right">Montant Restant</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {invoices.map((invoice) => {
                                const isLate = invoice.status === "LATE";
                                const progressText = isLate
                                    ? "Retard de facturation"
                                    : `${invoice.billed_percentage}% facturé`;

                                return (
                                    <tr key={invoice.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {invoice.quote?.client?.name || "—"}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {invoice.quote?.project_name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {invoice.quote?.reference || "—"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {invoice.due_date ? formatDate(invoice.due_date) : "Aujourd'hui"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <span className={`text-sm font-medium ${isLate ? "text-red-600" : "text-blue-600"}`}>
                                                    {progressText}
                                                </span>
                                                <Progress
                                                    value={isLate ? 100 : invoice.billed_percentage}
                                                    className="h-1.5"
                                                    indicatorClassName={getProgressColor(invoice.billed_percentage, isLate)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-semibold text-slate-900">
                                                {formatCurrency(invoice.total_ht)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                size="sm"
                                                onClick={() => handleGenerateClick(invoice)}
                                            >
                                                Générer Facture
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t px-6 py-4">
                    <p className="text-sm text-slate-500">
                        Affichage de {invoices.length} sur {totalCount} chantiers à facturer
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
                        >
                            Précedent
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`h-8 w-8 rounded-lg text-sm font-medium ${currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </div>

            {/* Generate Invoice Modal */}
            <GenerateInvoiceModal
                open={selectedInvoice !== null}
                onClose={() => setSelectedInvoice(null)}
                onSuccess={handleInvoiceSuccess}
                clientName={selectedInvoice?.quote?.client?.name || "Client"}
                projectName={selectedInvoice?.quote?.project_name || "Projet"}
                amount={selectedInvoice?.total_ht || 0}
                quoteReference={selectedInvoice?.quote?.reference || "—"}
            />
        </>
    );
}
