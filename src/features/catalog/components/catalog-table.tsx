"use client";

import { formatCurrency } from "@/lib/utils";
import { StatusBadge, getCategoryVariant } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Download, MoreVertical } from "lucide-react";
import type { Item } from "@/lib/supabase/types";

interface CatalogTableProps {
    items: Item[];
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function CatalogTable({ items, totalCount, currentPage, onPageChange }: CatalogTableProps) {
    const pageSize = 6;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="rounded-xl border bg-white">
            {/* Table Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                        Catégorie: Toutes
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                        Unité: Toutes
                    </button>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                            <th className="px-6 py-3">Réf.</th>
                            <th className="px-6 py-3">Désignation</th>
                            <th className="px-6 py-3">Unité</th>
                            <th className="px-6 py-3 text-right">Prix Unitaire HT</th>
                            <th className="px-6 py-3">Catégorie</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <span className="font-medium text-slate-600">{item.reference}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-slate-900">{item.name}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {item.unit}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="font-semibold text-slate-900">
                                        {formatCurrency(item.price_ht)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge variant={getCategoryVariant(item.category)} showDot={false}>
                                        {item.category}
                                    </StatusBadge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-6 py-4">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>Affichage de {items.length} sur {totalCount} articles</span>
                    <span className="text-blue-600 hover:underline cursor-pointer">
                        Mise à jour via Import CSV le 12/10/2023
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
                    >
                        Précedent
                    </button>
                    {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
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
                    {totalPages > 3 && <span className="text-slate-400">...</span>}
                    {totalPages > 3 && (
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
    );
}
