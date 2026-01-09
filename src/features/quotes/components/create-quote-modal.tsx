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
import { Loader2, CheckCircle } from "lucide-react";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useCreateQuote } from "../hooks/use-quotes";

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
    const [isSuccess, setIsSuccess] = useState(false);

    // Hooks for real data
    const { data: clients, isLoading: isLoadingClients } = useClients();
    const { mutate: createQuote, isPending: isSubmitting } = useCreateQuote();

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

    const onSubmit = (data: QuoteFormData) => {
        createQuote(data, {
            onSuccess: () => {
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    reset();
                    onSuccess?.(data);
                    onClose();
                }, 1500);
            }
        });
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
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Client Select */}
                        <div className="space-y-2">
                            <Label htmlFor="client">Client *</Label>
                            <Select onValueChange={(value) => setValue("clientId", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={isLoadingClients ? "Chargement..." : "Sélectionner un client"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients?.map((client) => (
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
