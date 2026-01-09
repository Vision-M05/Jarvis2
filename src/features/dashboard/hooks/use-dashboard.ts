import { useQuery } from "@tanstack/react-query";
import { supabase, useMockData } from "@/lib/supabase/client";
import { mockDashboardKPIs, mockRevenueData, mockActivities } from "@/data/mock-data";

export function useDashboardStats() {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            // Use mock data if Supabase not configured
            if (isMock || !supabase) {
                return {
                    revenue: mockDashboardKPIs.revenue,
                    activeQuotes: mockDashboardKPIs.activeQuotes,
                    unpaidInvoices: mockDashboardKPIs.unpaidInvoices,
                    conversionRate: mockDashboardKPIs.conversionRate,
                };
            }

            // Get quotes stats
            const { data: quotes, error: quotesError } = await supabase
                .from("quotes")
                .select("status, total_ht, created_at");

            if (quotesError) throw new Error(quotesError.message);

            // Get invoices stats
            const { data: invoices, error: invoicesError } = await supabase
                .from("invoices")
                .select("status, total_ht");

            if (invoicesError) throw new Error(invoicesError.message);

            // Calculate revenue (from signed quotes)
            const signedQuotes = quotes?.filter((q) => q.status === "SIGNED") || [];
            const totalRevenue = signedQuotes.reduce((sum, q) => sum + (q.total_ht || 0), 0);

            // Active quotes (SENT, PENDING)
            const activeQuotes = quotes?.filter(
                (q) => q.status === "SENT" || q.status === "PENDING"
            ) || [];
            const activeQuotesTotal = activeQuotes.reduce((sum, q) => sum + (q.total_ht || 0), 0);

            // Unpaid invoices
            const unpaidInvoices = invoices?.filter(
                (i) => i.status === "PENDING" || i.status === "LATE"
            ) || [];
            const unpaidTotal = unpaidInvoices.reduce((sum, i) => sum + (i.total_ht || 0), 0);

            // Conversion rate
            const totalQuotes = quotes?.length || 0;
            const conversionRate = totalQuotes > 0
                ? Math.round((signedQuotes.length / totalQuotes) * 100)
                : 0;

            return {
                revenue: {
                    value: totalRevenue,
                    trend: 12,
                },
                activeQuotes: {
                    value: activeQuotesTotal,
                    count: activeQuotes.length,
                },
                unpaidInvoices: {
                    value: unpaidTotal,
                    count: unpaidInvoices.length,
                },
                conversionRate: {
                    value: conversionRate,
                    trend: 5,
                },
            };
        },
    });
}

export function useRevenueChart() {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["revenue-chart"],
        queryFn: async () => {
            // Use mock data if Supabase not configured
            if (isMock || !supabase) {
                return mockRevenueData;
            }

            // Get signed quotes from last 6 months
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const { data: quotes, error } = await supabase
                .from("quotes")
                .select("total_ht, created_at")
                .eq("status", "SIGNED")
                .gte("created_at", sixMonthsAgo.toISOString())
                .order("created_at", { ascending: true });

            if (error) throw new Error(error.message);

            // Group by month
            const monthlyRevenue: Record<string, number> = {};
            const monthNames = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEP", "OCT", "NOV", "DÉC"];

            quotes?.forEach((quote) => {
                const date = new Date(quote.created_at);
                const monthKey = monthNames[date.getMonth()];
                monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (quote.total_ht || 0);
            });

            // Get last 6 months in order
            const now = new Date();
            const result = [];
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now);
                date.setMonth(date.getMonth() - i);
                const monthKey = monthNames[date.getMonth()];
                result.push({
                    month: monthKey,
                    revenue: monthlyRevenue[monthKey] || 0,
                });
            }

            return result;
        },
    });
}

export function useRecentActivity() {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["recent-activity"],
        queryFn: async () => {
            // Use mock data if Supabase not configured
            if (isMock || !supabase) {
                return mockActivities;
            }

            // Get recent quotes
            const { data: recentQuotes, error: quotesError } = await supabase
                .from("quotes")
                .select(`
          id,
          reference,
          status,
          created_at,
          client:clients(name)
        `)
                .order("created_at", { ascending: false })
                .limit(5);

            if (quotesError) throw new Error(quotesError.message);

            // Get recent invoices (paid)
            const { data: recentPayments, error: invoicesError } = await supabase
                .from("invoices")
                .select(`
          id,
          reference,
          total_ht,
          created_at,
          quote:quotes(
            client:clients(name)
          )
        `)
                .eq("status", "PAID")
                .order("created_at", { ascending: false })
                .limit(3);

            if (invoicesError) throw new Error(invoicesError.message);

            // Combine and format activities
            const activities = [
                ...(recentQuotes?.map((q) => ({
                    id: `quote-${q.id}`,
                    type: "quote_created" as const,
                    title: "Devis créé",
                    description: q.reference,
                    detail: `Client: ${(q.client as { name: string } | null)?.name || "—"}`,
                    timestamp: q.created_at,
                })) || []),
                ...(recentPayments?.map((p) => ({
                    id: `payment-${p.id}`,
                    type: "payment_received" as const,
                    title: "Paiement reçu",
                    description: p.reference,
                    detail: `Montant: ${p.total_ht} €`,
                    timestamp: p.created_at,
                })) || []),
            ];

            // Sort by timestamp and take top 4
            return activities
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 4);
        },
    });
}
