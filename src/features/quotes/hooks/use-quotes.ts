import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, useMockData } from "@/lib/supabase/client";
import type { Quote, QuoteStatus, QuoteWithClient } from "@/lib/supabase/types";
import { mockQuotes } from "@/data/mock-data";
import { useToast } from "@/components/shared/toast-provider";

export interface QuoteFilters {
    status?: QuoteStatus | "ALL";
    page?: number;
    pageSize?: number;
}

export interface QuoteStats {
    totalActive: number;
    activeCount: number;
    signedCount: number;
    conversionRate: number;
}

export interface CreateQuotePayload {
    clientId: string;
    projectName: string;
    validUntil: string;
}

export function useQuotes(filters: QuoteFilters = {}) {
    const isMock = useMockData();
    const { status, page = 1, pageSize = 10 } = filters;

    return useQuery({
        queryKey: ["quotes", filters],
        queryFn: async () => {
            if (isMock || !supabase) {
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 800));

                let filtered = [...mockQuotes];

                if (status && status !== "ALL") {
                    filtered = filtered.filter(q => q.status === status);
                }

                const start = (page - 1) * pageSize;
                const end = start + pageSize;
                const paginated = filtered.slice(start, end);

                return {
                    data: paginated,
                    count: filtered.length,
                };
            }

            let query = supabase
                .from("quotes")
                .select(`
                    *,
                    client:clients (
                        id,
                        name,
                        email
                    )
                `, { count: "exact" });

            if (status && status !== "ALL") {
                query = query.eq("status", status);
            }

            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            const { data, error, count } = await query
                .range(from, to)
                .order("created_at", { ascending: false });

            if (error) throw new Error(error.message);

            return {
                data: (data || []) as QuoteWithClient[],
                count: count || 0,
            };
        },
    });
}

export function useQuoteStats() {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["quote-stats"],
        queryFn: async (): Promise<QuoteStats> => {
            if (isMock || !supabase) {
                const active = mockQuotes.filter(q => q.status === "SENT" || q.status === "PENDING");
                const signed = mockQuotes.filter(q => q.status === "SIGNED");
                const totalActive = active.reduce((sum, q) => sum + q.total_ht, 0);

                return {
                    totalActive,
                    activeCount: active.length,
                    signedCount: signed.length,
                    conversionRate: mockQuotes.length > 0
                        ? (signed.length / mockQuotes.length) * 100
                        : 0
                };
            }

            const { data: quotes, error } = await supabase
                .from("quotes")
                .select("status, total_ht");

            if (error) throw new Error(error.message);

            const typedQuotes = (quotes || []) as { status: QuoteStatus, total_ht: number }[];

            const active = typedQuotes.filter(q => q.status === "SENT" || q.status === "PENDING");
            const signed = typedQuotes.filter(q => q.status === "SIGNED");

            return {
                totalActive: active.reduce((sum, q) => sum + q.total_ht, 0),
                activeCount: active.length,
                signedCount: signed.length,
                conversionRate: typedQuotes.length > 0
                    ? (signed.length / typedQuotes.length) * 100
                    : 0
            };
        }
    });
}

export function useCreateQuote() {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const isMock = useMockData();

    return useMutation({
        mutationFn: async (payload: CreateQuotePayload) => {
            if (isMock || !supabase) {
                // Simulate API
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return {
                    id: "mock-quote-" + Date.now(),
                    reference: "DEV-MOCK-" + Math.floor(Math.random() * 1000),
                    status: "DRAFT" as QuoteStatus,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    client_id: payload.clientId,
                    project_name: payload.projectName,
                    valid_until: payload.validUntil,
                    total_ht: 0,
                    client: {
                        id: payload.clientId,
                        name: "Mock Client",
                        email: null
                    }
                };
            }

            // 1. Generate Reference
            const reference = `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Vous devez être connecté pour créer un devis.");

            // 2. Insert Quote
            const { data, error } = await supabase
                .from("quotes")
                .insert([{
                    client_id: payload.clientId,
                    project_name: payload.projectName,
                    valid_until: payload.validUntil,
                    status: "DRAFT" as QuoteStatus,
                    reference: reference,
                    total_ht: 0,
                    user_id: user.id
                }] as any)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotes"] });
            queryClient.invalidateQueries({ queryKey: ["quote-stats"] });
            addToast({
                type: "success",
                title: "Devis créé",
                message: "Le brouillon de devis a été généré avec succès.",
            });
        },
        onError: (error) => {
            addToast({
                type: "error",
                title: "Erreur",
                message: error.message || "Une erreur est survenue lors de la création du devis.",
            });
        }
    });
}
