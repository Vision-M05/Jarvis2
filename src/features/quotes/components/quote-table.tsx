"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
    StatusBadge,
    getQuoteStatusVariant,
    getQuoteStatusLabel
} from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { QuoteDetailsModal } from "./quote-details-modal";
import { useToast } from "@/components/shared/toast-provider";
import { exportToCSV, quoteExportColumns } from "@/lib/export-utils";
import { Pencil, FileText, Mail, Download } from "lucide-react";
import type { Quote, Client } from "@/lib/supabase/types";

interface QuoteTableProps {
    quotes: (Quote & { client?: Client })[];
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function QuoteTable({ quotes, totalCount, currentPage, onPageChange }: QuoteTableProps) {
    const pageSize = 10;
    const totalPages = Math.ceil(totalCount / pageSize);
    const [selectedQuote, setSelectedQuote] = useState<(Quote & { client?: Client }) | null>(null);
    const { addToast } = useToast();

    const handleQuoteClick = (quote: Quote & { client?: Client }) => {
        setSelectedQuote(quote);
    };

    const handleExportCSV = () => {
        const exportData = quotes.map((quote) => ({
            reference: quote.reference,
            client_name: quote.client?.name || "—",
            project_name: quote.project_name,
            status: getQuoteStatusLabel(quote.status),
            total_ht: quote.total_ht,
            created_at: formatDate(quote.created_at),
        }));

        exportToCSV(exportData, "devis", quoteExportColumns);

        addToast({
            type: "success",
            title: "Export réussi",
            message: `${quotes.length} devis exportés en CSV`,
        });
    };

    const handleDownloadPDF = (e: React.MouseEvent, quote: Quote & { client?: Client }) => {
        e.stopPropagation();
        addToast({
            type: "success",
            title: "PDF téléchargé",
            message: `Devis ${quote.reference} téléchargé`,
        });
    };

    const handleSendEmail = (e: React.MouseEvent, quote: Quote & { client?: Client }) => {
        e.stopPropagation();
        addToast({
            type: "success",
            title: "Email envoyé",
            message: `Devis ${quote.reference} envoyé à ${quote.client?.email || "client"}`,
        });
    };

    return (
        <>
            <div className="rounded-xl border bg-white">
                {/* Table Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">Liste des Devis</h3>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {totalCount} DEVIS TOTAL
                        </span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-3">Référence</th>
                                <th className="px-6 py-3">Client / Projet</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Montant</th>
                                <th className="px-6 py-3">Statut</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {quotes.map((quote) => (
                                <tr
                                    key={quote.id}
                                    className="hover:bg-slate-50 cursor-pointer"
                                    onClick={() => handleQuoteClick(quote)}
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-blue-600">{quote.reference}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-slate-900">{quote.client?.name || "—"}</p>
                                            <p className="text-sm text-slate-500">{quote.project_name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {formatDate(quote.created_at)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-semibold text-slate-900">
                                            {formatCurrency(quote.total_ht)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge variant={getQuoteStatusVariant(quote.status)}>
                                            {getQuoteStatusLabel(quote.status)}
                                        </StatusBadge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                                onClick={() => handleQuoteClick(quote)}
                                                title="Éditer"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                                onClick={(e) => handleDownloadPDF(e, quote)}
                                                title="Télécharger PDF"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                                onClick={(e) => handleSendEmail(e, quote)}
                                                title="Envoyer par email"
                                            >
                                                <Mail className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t px-6 py-4">
                    <p className="text-sm text-slate-500">
                        Affichage de <span className="font-medium">{quotes.length}</span> sur {totalCount} devis
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
                        >
                            Précedent
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
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
                        {totalPages > 5 && <span className="text-slate-400">...</span>}
                        {totalPages > 5 && (
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="h-8 w-8 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                            >
                                {totalPages}
                            </button>
                        )}
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

            {/* Quote Details Modal */}
            <QuoteDetailsModal
                open={selectedQuote !== null}
                onClose={() => setSelectedQuote(null)}
                quote={selectedQuote}
            />
        </>
    );
}
