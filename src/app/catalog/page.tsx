"use client";

import { useState, useRef } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CatalogTable } from "@/features/catalog/components/catalog-table";
import { CreateArticleModal } from "@/features/catalog/components/create-article-modal";
import { Button } from "@/components/ui/button";
import { useCatalogItems } from "@/features/catalog/hooks/use-catalog";
import { useToast } from "@/components/shared/toast-provider";
import { exportToCSV, itemExportColumns } from "@/lib/export-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, RefreshCw, Download } from "lucide-react";

function TableSkeleton() {
    return (
        <div className="rounded-xl border bg-white">
            <div className="border-b px-6 py-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function CatalogPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("materiaux");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    // Map UI tab to category filter
    const getCategoryFilter = () => {
        switch (activeTab) {
            case "materiaux":
                return "ALL";
            case "main-oeuvre":
                return "MAIN OEUVRE";
            case "sous-traitance":
                return "SOUS-TRAITANCE";
            default:
                return "ALL";
        }
    };

    const { data, isLoading, isError, refetch } = useCatalogItems({
        category: getCategoryFilter(),
        page: currentPage,
        pageSize: 6,
    });

    const handleArticleCreated = () => {
        refetch();
    };

    const handleExportCSV = () => {
        if (!data?.data) return;

        const exportData = data.data.map((item) => ({
            reference: item.reference,
            name: item.name,
            unit: item.unit,
            price_ht: item.price_ht,
            category: item.category,
        }));

        exportToCSV(exportData, "catalogue_articles", itemExportColumns);

        addToast({
            type: "success",
            title: "Export réussi",
            message: `${data.data.length} articles exportés en CSV`,
        });
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith(".csv")) {
            addToast({
                type: "error",
                title: "Format invalide",
                message: "Veuillez sélectionner un fichier CSV",
            });
            return;
        }

        setIsImporting(true);

        // Simulate import processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsImporting(false);

        addToast({
            type: "success",
            title: "Import réussi",
            message: `Fichier "${file.name}" importé avec succès`,
        });

        refetch();

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <AppShell
            actionLabel="Ajouter Article"
            onAction={() => setIsCreateModalOpen(true)}
            searchPlaceholder="Rechercher une référence ou désignation..."
        >
            {/* Hidden file input for CSV import */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileImport}
                className="hidden"
            />

            {/* Page Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Catalogue Prix</h1>
                    <p className="text-slate-500">
                        Gérez votre bibliothèque d&apos;ouvrages et fournitures.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                    <button
                        onClick={() => { setActiveTab("materiaux"); setCurrentPage(1); }}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "materiaux"
                                ? "bg-blue-600 text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        Matériaux
                    </button>
                    <button
                        onClick={() => { setActiveTab("main-oeuvre"); setCurrentPage(1); }}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "main-oeuvre"
                                ? "bg-blue-600 text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        Main d&apos;œuvre
                    </button>
                    <button
                        onClick={() => { setActiveTab("sous-traitance"); setCurrentPage(1); }}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "sous-traitance"
                                ? "bg-blue-600 text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        Sous-traitance
                    </button>
                </div>
            </div>

            {/* Sync Status & Actions */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <RefreshCw className={`h-4 w-4 ${isImporting ? "animate-spin" : ""}`} />
                    {isImporting ? "Import en cours..." : "Dernière sync: Aujourd'hui, 09:41"}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleImportClick}
                        disabled={isImporting}
                    >
                        <Upload className="h-4 w-4" />
                        Import CSV
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleExportCSV}
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <TableSkeleton />
            ) : isError ? (
                <div className="rounded-xl border bg-white p-8 text-center">
                    <p className="text-red-600">Erreur lors du chargement du catalogue</p>
                </div>
            ) : (
                <CatalogTable
                    items={data?.data || []}
                    totalCount={data?.count || 0}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Create Article Modal */}
            <CreateArticleModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleArticleCreated}
            />
        </AppShell>
    );
}
