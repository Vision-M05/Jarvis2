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
import { Loader2 } from "lucide-react";
import { useCreateClient } from "../hooks/use-clients";

const clientSchema = z.object({
    name: z.string().min(2, "Le nom est requis (min. 2 caractères)"),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface CreateClientModalProps {
    open: boolean;
    onClose: () => void;
}

export function CreateClientModal({ open, onClose }: CreateClientModalProps) {
    const { mutate: createClient, isPending } = useCreateClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            zip: "",
        },
    });

    const onSubmit = (data: ClientFormData) => {
        // Prepare data for Supabase (null instead of empty string for optional fields if needed, 
        // but Supabase usually handles empty strings fine unless constraint exists)
        // Adjusting data structure to match DB schema if needed
        createClient(
            {
                name: data.name,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || null,
                city: data.city || null,
                zip: data.zip || null,
            },
            {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nouveau Client</DialogTitle>
                    <DialogDescription>
                        Ajoutez un nouveau client à votre base de données.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom / Entreprise *</Label>
                        <Input id="name" {...register("name")} placeholder="Ex: Jean Dupont" />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} placeholder="jean@exemple.com" />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input id="phone" {...register("phone")} placeholder="06 12 34 56 78" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Input id="address" {...register("address")} placeholder="123 Rue de la Paix" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="zip">Code Postal</Label>
                            <Input id="zip" {...register("zip")} placeholder="75000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">Ville</Label>
                            <Input id="city" {...register("city")} placeholder="Paris" />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                "Créer le client"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
