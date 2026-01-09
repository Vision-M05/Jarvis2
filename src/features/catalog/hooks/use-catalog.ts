import { useQuery } from "@tanstack/react-query";
import { supabase, useMockData } from "@/lib/supabase/client";
import type { Item } from "@/lib/supabase/types";
import { mockItems } from "@/data/mock-data";

interface UseCatalogOptions {
    category?: string;
    page?: number;
    pageSize?: number;
    search?: string;
}

export function useCatalogItems({
    category = "ALL",
    page = 1,
    pageSize = 10,
    search = ""
}: UseCatalogOptions = {}) {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["catalog-items", category, page, pageSize, search],
        queryFn: async (): Promise<{ data: Item[]; count: number }> => {
            // Use mock data if Supabase not configured
            if (isMock || !supabase) {
                let filtered = mockItems;
                if (category !== "ALL") {
                    filtered = mockItems.filter(item => item.category === category);
                }
                if (search) {
                    const searchLower = search.toLowerCase();
                    filtered = filtered.filter(item =>
                        item.name.toLowerCase().includes(searchLower) ||
                        item.reference.toLowerCase().includes(searchLower)
                    );
                }
                return {
                    data: filtered.slice((page - 1) * pageSize, page * pageSize),
                    count: filtered.length,
                };
            }

            let query = supabase
                .from("items")
                .select("*", { count: "exact" })
                .order("reference", { ascending: true })
                .range((page - 1) * pageSize, page * pageSize - 1);

            if (category !== "ALL") {
                query = query.eq("category", category);
            }

            if (search) {
                query = query.or(`name.ilike.%${search}%,reference.ilike.%${search}%`);
            }

            const { data, error, count } = await query;

            if (error) {
                throw new Error(error.message);
            }

            return {
                data: data || [],
                count: count || 0,
            };
        },
    });
}

export function useCatalogCategories() {
    const isMock = useMockData();

    return useQuery({
        queryKey: ["catalog-categories"],
        queryFn: async () => {
            // Use mock data if Supabase not configured
            if (isMock || !supabase) {
                const categories = [...new Set(mockItems.map(item => item.category))];
                return categories;
            }

            const { data, error } = await supabase
                .from("items")
                .select("category")
                .order("category");

            if (error) throw new Error(error.message);

            // Get unique categories
            const categories = [...new Set(data?.map((item) => item.category) || [])];
            return categories;
        },
    });
}
