"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge, getQuoteStatusVariant, getQuoteStatusLabel } from "@/components/shared/status-badge";
import { FileText, Mail, Download, Printer, X } from "lucide-react";
import type { Quote, Client } from "@/lib/supabase/types";

interface QuoteDetailsModalProps {
    open: boolean;
    onClose: () => void;
    quote: (Quote & { client?: Client }) | null;
}

export function QuoteDetailsModal({ open, onClose, quote }: QuoteDetailsModalProps) {
    const [activeAction, setActiveAction] = useState<string | null>(null);

    if (!quote) return null;

    const handleAction = async (action: string) => {
        setActiveAction(action);

        // Simulate action
        await new Promise((resolve) => setTimeout(resolve, 1000));

        switch (action) {
            case "pdf":
                alert("📄 PDF du devis téléchargé !");
                break;
            case "email":
                alert("📧 Email envoyé au client !");
                break;
            case "print":
                window.print();
                break;
        }

        setActiveAction(null);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">{quote.reference}</DialogTitle>
                            <DialogDescription>{quote.project_name}</DialogDescription>
                        </div>
                        <StatusBadge variant={getQuoteStatusVariant(quote.status)}>
                            {getQuoteStatusLabel(quote.status)}
                        </StatusBadge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Client Info */}
                    <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium text-slate-500 mb-2">Client</h4>
                        <p className="font-medium text-slate-900">{quote.client?.name || "—"}</p>
                        <p className="text-sm text-slate-500">{quote.client?.email}</p>
                    </div>

                    {/* Quote Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Montant HT</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(quote.total_ht)}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Montant TTC</p>
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(quote.total_ht * 1.2)}</p>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-slate-500">Créé le:</span>
                            <span className="ml-2 font-medium">{formatDate(quote.created_at)}</span>
                        </div>
                        <div>
                            <span className="text-slate-500">Valide jusqu&apos;au:</span>
                            <span className="ml-2 font-medium">
                                {quote.valid_until ? formatDate(quote.valid_until) : "—"}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t pt-4">
                        <p className="text-sm font-medium text-slate-700 mb-3">Actions rapides</p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleAction("pdf")}
                                disabled={activeAction !== null}
                            >
                                <Download className="h-4 w-4" />
                                {activeAction === "pdf" ? "..." : "Télécharger PDF"}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleAction("email")}
                                disabled={activeAction !== null}
                            >
                                <Mail className="h-4 w-4" />
                                {activeAction === "email" ? "..." : "Envoyer par email"}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleAction("print")}
                                disabled={activeAction !== null}
                            >
                                <Printer className="h-4 w-4" />
                                {activeAction === "print" ? "..." : "Imprimer"}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Fermer
                    </Button>
                    <Button>
                        Modifier le devis
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
