import { useQuery } from "@tanstack/react-query";
import { supabase, useMockData } from "@/lib/supabase/client";
import type { Invoice, Quote } from "@/lib/supabase/types";
import { mockInvoices, mockBillingKPIs } from "@/data/mock-data";

export interface InvoiceWithQuote extends Invoice {
    quote: (Quote & {
        client: {
            id: string;
            name: string;
        } | null;
    }) | null;
}

interface UseInvoicesOptions {
    page?: number;
    pageSize?: number;
    status?: "PENDING" | "LATE" | "PAID" | "ALL";
}

export function useInvoicesToBill({ page = 1, pageSize = 10 }: UseInvoicesOptions = {}) {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["invoices-to-bill", page, pageSize],
        queryFn: async (): Promise<{ data: InvoiceWithQuote[]; count: number }> => {
            // Use mock data if Supabase not configured
            if (isMock || !supabase) {
                return {
                    data: mockInvoices.slice((page - 1) * pageSize, page * pageSize) as unknown as InvoiceWithQuote[],
                    count: mockInvoices.length,
                };
            }

            const { data, error, count } = await supabase
                .from("invoices")
                .select(`
          *,
          quote:quotes(
            *,
            client:clients(id, name)
          )
        `, { count: "exact" })
                .in("status", ["PENDING", "LATE"])
                .order("created_at", { ascending: false })
                .range((page - 1) * pageSize, page * pageSize - 1);

            if (error) {
                throw new Error(error.message);
            }

            return {
                data: (data as unknown as InvoiceWithQuote[]) || [],
                count: count || 0,
            };
        },
    });
}

export function useBillingStats() {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["billing-stats"],
        queryFn: async () => {
            // Use mock data if Supabase not configured
            if (isMock || !supabase) {
                return {
                    totalToBill: mockBillingKPIs.totalToBill.value,
                    pendingCount: mockBillingKPIs.totalToBill.count,
                    totalLate: mockBillingKPIs.lateInvoices.value,
                    lateCount: mockBillingKPIs.lateInvoices.count,
                    conversionRate: mockBillingKPIs.conversionRate.value,
                };
            }

            const { data: invoices, error } = await supabase
                .from("invoices")
                .select("status, total_ht, billed_percentage");

            if (error) throw new Error(error.message);

            const pendingInvoices = invoices?.filter((i) => i.status === "PENDING" || i.status === "LATE") || [];
            const lateInvoices = invoices?.filter((i) => i.status === "LATE") || [];
            const paidInvoices = invoices?.filter((i) => i.status === "PAID") || [];

            const totalToBill = pendingInvoices.reduce((sum, i) => sum + (i.total_ht || 0), 0);
            const totalLate = lateInvoices.reduce((sum, i) => sum + (i.total_ht || 0), 0);

            const totalInvoices = invoices?.length || 0;
            const conversionRate = totalInvoices > 0
                ? Math.round((paidInvoices.length / totalInvoices) * 100)
                : 0;

            return {
                totalToBill,
                pendingCount: pendingInvoices.length,
                totalLate,
                lateCount: lateInvoices.length,
                conversionRate,
            };
        },
    });
}
