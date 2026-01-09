import { useQuery } from "@tanstack/react-query";
import { supabase, useMockData } from "@/lib/supabase/client";
import type { Quote, QuoteStatus, QuoteWithClient } from "@/lib/supabase/types";
import { mockQuotes } from "@/data/mock-data";

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
            // Use mock data if Supabase not configured
            if (isMock || !supabase) {
                let filtered = mockQuotes;
                if (status !== "ALL") {
                    filtered = mockQuotes.filter(q => q.status === status);
                }
                return {
                    data: filtered.slice((page - 1) * pageSize, page * pageSize) as QuoteWithClient[],
                    count: filtered.length,
                };
            }

            let query = supabase
                .from("quotes")
                .select(`
          *,
          client:clients(id, name, email)
        `, { count: "exact" })
                .order("created_at", { ascending: false })
                .range((page - 1) * pageSize, page * pageSize - 1);

            if (status !== "ALL") {
                query = query.eq("status", status);
            }

            const { data, error, count } = await query;

            if (error) {
                throw new Error(error.message);
            }

            return {
                data: (data as unknown as QuoteWithClient[]) || [],
                count: count || 0,
            };
        },
    });
}

export function useQuoteStats() {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["quote-stats"],
        queryFn: async () => {
            // Use mock data if Supabase not configured
            if (isMock || !supabase) {
                const activeQuotes = mockQuotes.filter(q => q.status === "SENT" || q.status === "PENDING");
                const signedQuotes = mockQuotes.filter(q => q.status === "SIGNED");
                return {
                    totalActive: activeQuotes.reduce((sum, q) => sum + q.total_ht, 0),
                    activeCount: activeQuotes.length,
                    signedCount: signedQuotes.length,
                    conversionRate: Math.round((signedQuotes.length / mockQuotes.length) * 100),
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
