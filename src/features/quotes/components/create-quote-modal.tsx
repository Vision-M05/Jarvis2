"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mockClients } from "@/data/mock-data";
import { Loader2, CheckCircle } from "lucide-react";

const quoteSchema = z.object({
    clientId: z.string().min(1, "Veuillez sélectionner un client"),
    projectName: z.string().min(2, "Le nom du projet est requis"),
    description: z.string().optional(),
    validUntil: z.string().min(1, "La date de validité est requise"),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface CreateQuoteModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (data: QuoteFormData) => void;
}

export function CreateQuoteModal({ open, onClose, onSuccess }: CreateQuoteModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<QuoteFormData>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            clientId: "",
            projectName: "",
            description: "",
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
        },
    });

    const onSubmit = async (data: QuoteFormData) => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("New quote:", data);

        setIsSubmitting(false);
        setIsSuccess(true);

        // Show success then close
        setTimeout(() => {
            setIsSuccess(false);
            reset();
            onSuccess?.(data);
            onClose();
        }, 1500);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            setIsSuccess(false);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nouveau Devis</DialogTitle>
                    <DialogDescription>
                        Créez un nouveau devis pour votre client.
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                        <p className="text-lg font-medium text-green-700">Devis créé avec succès !</p>
                        <p className="text-sm text-slate-500">Référence: DEV-2024-{String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Client Select */}
                        <div className="space-y-2">
                            <Label htmlFor="client">Client *</Label>
                            <Select onValueChange={(value) => setValue("clientId", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockClients.map((client) => (
                                        <SelectItem key={client.id} value={client.id}>
                                            {client.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.clientId && (
                                <p className="text-sm text-red-500">{errors.clientId.message}</p>
                            )}
                        </div>

                        {/* Project Name */}
                        <div className="space-y-2">
                            <Label htmlFor="projectName">Nom du projet *</Label>
                            <Input
                                id="projectName"
                                placeholder="Ex: Rénovation cuisine"
                                {...register("projectName")}
                            />
                            {errors.projectName && (
                                <p className="text-sm text-red-500">{errors.projectName.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Description détaillée du projet..."
                                rows={3}
                                {...register("description")}
                            />
                        </div>

                        {/* Valid Until */}
                        <div className="space-y-2">
                            <Label htmlFor="validUntil">Valide jusqu&apos;au *</Label>
                            <Input
                                id="validUntil"
                                type="date"
                                {...register("validUntil")}
                            />
                            {errors.validUntil && (
                                <p className="text-sm text-red-500">{errors.validUntil.message}</p>
                            )}
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Création...
                                    </>
                                ) : (
                                    "Créer le devis"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
