import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, useMockData } from "@/lib/supabase/client";
import type { Client } from "@/lib/supabase/types";
import { mockClients } from "@/data/mock-data";
import { useToast } from "@/components/shared/toast-provider";

export function useClients() {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["clients"],
        queryFn: async (): Promise<Client[]> => {
            if (isMock || !supabase) {
                return mockClients;
            }

            const { data, error } = await supabase
                .from("clients")
                .select("*")
                .order("name");

            if (error) throw new Error(error.message);
            return data || [];
        },
    });
}

export function useCreateClient() {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const isMock = useMockData();

    return useMutation({
        mutationFn: async (newClient: Omit<Client, "id" | "created_at">) => {
            if (isMock || !supabase) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("Mock create client:", newClient);
                return { id: "mock-id-" + Date.now(), ...newClient, created_at: new Date().toISOString() };
            }

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Vous devez être connecté pour créer un client.");

            const { data, error } = await supabase
                .from("clients")
                .insert([{ ...newClient, user_id: user.id }] as any)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            addToast({
                type: "success",
                title: "Client créé",
                message: "Le client a été ajouté avec succès.",
            });
        },
        onError: (error) => {
            addToast({
                type: "error",
                title: "Erreur",
                message: error.message || "Une erreur est survenue lors de la création du client.",
            });
        },
    });
}

export function useUpdateClient() {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const isMock = useMockData();

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
            if (isMock || !supabase) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return { id, ...updates, created_at: new Date().toISOString() };
            }

            const { data, error } = await supabase
                .from("clients")
                .update(updates as any)
                .eq("id", id)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            addToast({
                type: "success",
                title: "Client mis à jour",
                message: "Les modifications ont été enregistrées.",
            });
        },
        onError: (error) => {
            addToast({
                type: "error",
                title: "Erreur",
                message: error.message || "Impossible de mettre à jour le client.",
            });
        },
    });
}

export function useDeleteClient() {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const isMock = useMockData();

    return useMutation({
        mutationFn: async (id: string) => {
            if (isMock || !supabase) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return id;
            }

            const { error } = await supabase
                .from("clients")
                .delete()
                .eq("id", id);

            if (error) throw new Error(error.message);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            addToast({
                type: "success",
                title: "Client supprimé",
                message: "Le client a été retiré de la base de données.",
            });
        },
        onError: (error) => {
            addToast({
                type: "error",
                title: "Erreur",
                message: error.message || "Impossible de supprimer le client.",
            });
        },
    });
}
