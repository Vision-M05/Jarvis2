import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, useMockData } from "@/lib/supabase/client";
import type { Quote, QuoteStatus, QuoteWithClient } from "@/lib/supabase/types";
import { mockQuotes } from "@/data/mock-data";
import { useToast } from "@/components/shared/toast-provider";

interface UseQuotesOptions {
    status?: QuoteStatus | "ALL";
    page?: number;
    pageSize?: number;
}

export function useQuotes({ status = "ALL", page = 1, pageSize = 10 }: UseQuotesOptions = {}) {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["quotes", status, page, pageSize],
        queryFn: async (): Promise<{ data: QuoteWithClient[]; count: number }> => {
            if (isMock || !supabase) {
                let filtered = mockQuotes;
                if (status !== "ALL") {
                    filtered = mockQuotes.filter((q) => q.status === status);
                }
                const start = (page - 1) * pageSize;
                const end = start + pageSize;
                return {
                    data: filtered.slice(start, end) as QuoteWithClient[],
                    count: filtered.length,
                };
            }

            let query = supabase
                .from("quotes")
                .select(`
          *,
          client:clients(id, name, email)
        `, { count: "exact" });

            if (status !== "ALL") {
                query = query.eq("status", status);
            }

            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            const { data, error, count } = await query
                .order("created_at", { ascending: false })
                .range(from, to);

            if (error) {
                console.error("Supabase error:", error);
                throw new Error(error.message);
            }

            return {
                data: (data as QuoteWithClient[]) || [],
                count: count || 0,
            };
        },
    });
}

export function useQuote(id: string) {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["quote", id],
        queryFn: async (): Promise<QuoteWithClient | null> => {
            if (isMock || !supabase) {
                return mockQuotes.find((q) => q.id === id) as QuoteWithClient || null;
            }

            const { data, error } = await supabase
                .from("quotes")
                .select(`
          *,
          client:clients(id, name, email)
        `)
                .eq("id", id)
                .single();

            if (error) throw new Error(error.message);
            return data as QuoteWithClient;
        },
        enabled: !!id,
    });
}

export function useQuoteStats() {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["quote-stats"],
        queryFn: async () => {
            if (isMock || !supabase) {
                const totalActive = mockQuotes
                    .filter((q) => q.status === "SENT" || q.status === "PENDING")
                    .reduce((sum, q) => sum + (q.total_ht || 0), 0);

                const activeCount = mockQuotes.filter(
                    (q) => q.status === "SENT" || q.status === "PENDING"
                ).length;

                const signedCount = mockQuotes.filter((q) => q.status === "SIGNED").length;
                const totalCount = mockQuotes.length;
                const conversionRate = totalCount > 0 ? Math.round((signedCount / totalCount) * 100) : 0;

                return {
                    totalActive,
                    activeCount,
                    signedCount,
                    conversionRate,
                };
            }

            const { data, error } = await supabase
                .from("quotes")
                .select("status, total_ht");

            const quotes = (data as unknown as Pick<Quote, "status" | "total_ht">[]) || [];

            if (error) throw new Error(error.message);

            const totalActive = quotes
                ?.filter((q) => q.status === "SENT" || q.status === "PENDING")
                .reduce((sum, q) => sum + (q.total_ht || 0), 0) || 0;

            const activeCount = quotes?.filter(
                (q) => q.status === "SENT" || q.status === "PENDING"
            ).length || 0;

            const signedCount = quotes?.filter((q) => q.status === "SIGNED").length || 0;
            const totalCount = quotes?.length || 0;
            const conversionRate = totalCount > 0 ? Math.round((signedCount / totalCount) * 100) : 0;

            return {
                totalActive,
                activeCount,
                signedCount,
                conversionRate,
            };
        },
    });
}

// Interface matching the Form Data from CreateQuoteModal
export interface CreateQuotePayload {
    clientId: string;
    projectName: string;
    description?: string; // Optional in form
    validUntil: string;
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

            // 2. Insert Quote
            // description is ignored if not in DB schema
            const { data, error } = await supabase
                .from("quotes")
                .insert([{
                    client_id: payload.clientId,
                    project_name: payload.projectName,
                    valid_until: payload.validUntil,
                    status: "DRAFT" as QuoteStatus,
                    reference: reference,
                    total_ht: 0,
                }])
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotes"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            addToast({
                type: "success",
                title: "Devis créé",
                message: "Le devis a été créé avec succès.",
            });
        },
        onError: (error) => {
            addToast({
                type: "error",
                title: "Erreur",
                message: error.message || "Impossible de créer le devis.",
            });
        }
    });
}
