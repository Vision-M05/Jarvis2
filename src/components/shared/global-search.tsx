"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, FileText, User, Package, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockQuotes, mockClients, mockItems } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface SearchResult {
    id: string;
    type: "quote" | "client" | "item" | "invoice";
    title: string;
    subtitle: string;
    href: string;
}

const getResultIcon = (type: SearchResult["type"]) => {
    switch (type) {
        case "quote":
            return <FileText className="h-4 w-4 text-blue-500" />;
        case "client":
            return <User className="h-4 w-4 text-green-500" />;
        case "item":
            return <Package className="h-4 w-4 text-purple-500" />;
        case "invoice":
            return <CreditCard className="h-4 w-4 text-orange-500" />;
    }
};

interface GlobalSearchProps {
    placeholder?: string;
}

export function GlobalSearch({ placeholder = "Rechercher..." }: GlobalSearchProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Search logic
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const searchQuery = query.toLowerCase();
        const searchResults: SearchResult[] = [];

        // Search quotes
        mockQuotes.forEach((quote) => {
            if (
                quote.reference.toLowerCase().includes(searchQuery) ||
                quote.project_name.toLowerCase().includes(searchQuery) ||
                quote.client?.name.toLowerCase().includes(searchQuery)
            ) {
                searchResults.push({
                    id: quote.id,
                    type: "quote",
                    title: quote.reference,
                    subtitle: `${quote.client?.name} - ${quote.project_name}`,
                    href: `/quotes?id=${quote.id}`,
                });
            }
        });

        // Search clients
        mockClients.forEach((client) => {
            if (
                client.name.toLowerCase().includes(searchQuery) ||
                client.email?.toLowerCase().includes(searchQuery)
            ) {
                searchResults.push({
                    id: client.id,
                    type: "client",
                    title: client.name,
                    subtitle: client.email || "Aucun email",
                    href: `/quotes`,
                });
            }
        });

        // Search items
        mockItems.forEach((item) => {
            if (
                item.reference.toLowerCase().includes(searchQuery) ||
                item.name.toLowerCase().includes(searchQuery)
            ) {
                searchResults.push({
                    id: item.id,
                    type: "item",
                    title: item.name,
                    subtitle: `${item.reference} - ${formatCurrency(item.price_ht)}`,
                    href: `/catalog?id=${item.id}`,
                });
            }
        });

        setResults(searchResults.slice(0, 8));
    }, [query]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (event.key === "Escape") {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleResultClick = () => {
        setQuery("");
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="pl-9 pr-12 bg-slate-50 border-slate-200"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="p-0.5 rounded hover:bg-slate-200"
                        >
                            <X className="h-3 w-3 text-slate-400" />
                        </button>
                    )}
                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {/* Results dropdown */}
            {isOpen && (query.length >= 2 || results.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border bg-white shadow-lg z-50">
                    {results.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-500">
                            Aucun résultat pour &quot;{query}&quot;
                        </div>
                    ) : (
                        <div className="py-2">
                            <div className="px-3 py-1.5 text-xs font-medium text-slate-500 uppercase">
                                Résultats ({results.length})
                            </div>
                            {results.map((result) => (
                                <Link
                                    key={`${result.type}-${result.id}`}
                                    href={result.href}
                                    onClick={handleResultClick}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50"
                                >
                                    {getResultIcon(result.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            {result.title}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {result.subtitle}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
