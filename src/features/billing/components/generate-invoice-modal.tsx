"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Loader2, CheckCircle, FileText } from "lucide-react";

interface GenerateInvoiceModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    clientName: string;
    projectName: string;
    amount: number;
    quoteReference: string;
}

export function GenerateInvoiceModal({
    open,
    onClose,
    onSuccess,
    clientName,
    projectName,
    amount,
    quoteReference,
}: GenerateInvoiceModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [invoiceRef, setInvoiceRef] = useState("");

    const handleGenerate = async () => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const newRef = `FAC-2024-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
        setInvoiceRef(newRef);

        setIsSubmitting(false);
        setIsSuccess(true);

        // Show success then close
        setTimeout(() => {
            setIsSuccess(false);
            onSuccess?.();
            onClose();
        }, 2000);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setIsSuccess(false);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Générer une Facture
                    </DialogTitle>
                    <DialogDescription>
                        Créer une facture à partir du devis {quoteReference}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                        <p className="text-lg font-medium text-green-700">Facture générée !</p>
                        <p className="text-sm text-slate-500">Référence: {invoiceRef}</p>
                        <p className="text-xs text-slate-400 mt-2">
                            Le PDF a été créé et peut être envoyé au client.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-slate-50 p-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">Client</span>
                                    <span className="text-sm font-medium">{clientName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">Projet</span>
                                    <span className="text-sm font-medium">{projectName}</span>
                                </div>
                                <div className="flex justify-between border-t pt-3">
                                    <span className="text-sm font-medium text-slate-700">Montant HT</span>
                                    <span className="text-lg font-bold text-blue-600">{formatCurrency(amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">TVA (20%)</span>
                                    <span className="text-sm font-medium">{formatCurrency(amount * 0.2)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-3">
                                    <span className="text-sm font-bold">Total TTC</span>
                                    <span className="text-lg font-bold">{formatCurrency(amount * 1.2)}</span>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                                Annuler
                            </Button>
                            <Button onClick={handleGenerate} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Génération...
                                    </>
                                ) : (
                                    "Générer la facture"
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
