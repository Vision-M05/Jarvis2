// CSV Export utilities

export function exportToCSV(data: Record<string, unknown>[], filename: string, columns: { key: string; label: string }[]) {
    // Build CSV header
    const header = columns.map((col) => col.label).join(",");

    // Build CSV rows
    const rows = data.map((row) => {
        return columns.map((col) => {
            const value = row[col.key];
            // Handle different value types
            if (value === null || value === undefined) {
                return "";
            }
            if (typeof value === "string") {
                // Escape quotes and wrap in quotes if contains comma
                const escaped = value.replace(/"/g, '""');
                return escaped.includes(",") ? `"${escaped}"` : escaped;
            }
            if (typeof value === "number") {
                return value.toString();
            }
            if (value instanceof Date) {
                return value.toISOString().split("T")[0];
            }
            return String(value);
        }).join(",");
    });

    // Combine header and rows
    const csv = [header, ...rows].join("\n");

    // Create blob and download
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Quote export columns
export const quoteExportColumns = [
    { key: "reference", label: "Référence" },
    { key: "client_name", label: "Client" },
    { key: "project_name", label: "Projet" },
    { key: "status", label: "Statut" },
    { key: "total_ht", label: "Montant HT" },
    { key: "created_at", label: "Date de création" },
];

// Item export columns
export const itemExportColumns = [
    { key: "reference", label: "Référence" },
    { key: "name", label: "Désignation" },
    { key: "unit", label: "Unité" },
    { key: "price_ht", label: "Prix HT" },
    { key: "category", label: "Catégorie" },
];

// Invoice export columns
export const invoiceExportColumns = [
    { key: "reference", label: "Référence" },
    { key: "client_name", label: "Client" },
    { key: "total_ht", label: "Montant HT" },
    { key: "status", label: "Statut" },
    { key: "due_date", label: "Date d'échéance" },
];
