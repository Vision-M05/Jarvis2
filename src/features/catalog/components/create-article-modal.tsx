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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle } from "lucide-react";

const articleSchema = z.object({
    reference: z.string().min(2, "La référence est requise"),
    name: z.string().min(2, "La désignation est requise"),
    unit: z.string().min(1, "L'unité est requise"),
    priceHt: z.string().min(1, "Le prix est requis"),
    category: z.string().min(1, "La catégorie est requise"),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface CreateArticleModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (data: ArticleFormData) => void;
}

const categories = [
    "GROS OEUVRE",
    "ELECTRICITE",
    "PLOMBERIE",
    "ISOLATION",
    "MENUISERIE",
    "PEINTURE",
    "MAIN OEUVRE",
    "SOUS-TRAITANCE",
];

const units = [
    { value: "u", label: "Unité (u)" },
    { value: "m2", label: "Mètre carré (m²)" },
    { value: "ml", label: "Mètre linéaire (ml)" },
    { value: "kg", label: "Kilogramme (kg)" },
    { value: "h", label: "Heure (h)" },
    { value: "forfait", label: "Forfait" },
    { value: "sac", label: "Sac" },
    { value: "t", label: "Tonne (t)" },
];

export function CreateArticleModal({ open, onClose, onSuccess }: CreateArticleModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            reference: "",
            name: "",
            unit: "",
            priceHt: "",
            category: "",
        },
    });

    const onSubmit = async (data: ArticleFormData) => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("New article:", data);

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
                    <DialogTitle>Nouvel Article</DialogTitle>
                    <DialogDescription>
                        Ajoutez un nouvel article à votre catalogue.
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                        <p className="text-lg font-medium text-green-700">Article ajouté avec succès !</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Reference */}
                        <div className="space-y-2">
                            <Label htmlFor="reference">Référence *</Label>
                            <Input
                                id="reference"
                                placeholder="Ex: M013"
                                {...register("reference")}
                            />
                            {errors.reference && (
                                <p className="text-sm text-red-500">{errors.reference.message}</p>
                            )}
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Désignation *</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Parpaing creux 20x20x50"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Unit & Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="unit">Unité *</Label>
                                <Select onValueChange={(value) => setValue("unit", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((unit) => (
                                            <SelectItem key={unit.value} value={unit.value}>
                                                {unit.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.unit && (
                                    <p className="text-sm text-red-500">{errors.unit.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priceHt">Prix HT (€) *</Label>
                                <Input
                                    id="priceHt"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("priceHt")}
                                />
                                {errors.priceHt && (
                                    <p className="text-sm text-red-500">{errors.priceHt.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Catégorie *</Label>
                            <Select onValueChange={(value) => setValue("category", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category.message}</p>
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
                                        Ajout...
                                    </>
                                ) : (
                                    "Ajouter l'article"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
