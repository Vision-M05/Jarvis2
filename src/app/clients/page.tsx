"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ClientTable } from "@/features/clients/components/client-table";
import { CreateClientModal } from "@/features/clients/components/create-client-modal";
import { useClients } from "@/features/clients/hooks/use-clients";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function ClientListSkeleton() {
    return (
        <div className="rounded-md border bg-white p-6 space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            ))}
        </div>
    );
}

export default function ClientsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingClient, setEditingClient] = useState<any>(null); // Type 'any' temporarily to avoid type mismatch with Client interface

    const { data: clients, isLoading, isError } = useClients();

    const filteredClients = clients?.filter(
        (client) =>
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.phone?.includes(searchQuery)
    ) || [];

    const handleEdit = (client: any) => {
        setEditingClient(client);
        setIsCreateModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setEditingClient(null);
    };

    return (
        <AppShell
            actionLabel="Nouveau Client"
            onAction={() => setIsCreateModalOpen(true)}
            searchPlaceholder="Rechercher (Global)..."
        >
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Références Clients</h1>
                <p className="text-slate-500">
                    Gérez votre carnet d'adresses et suivez l'historique de vos relations clients.
                </p>
            </div>

            {/* Local Search and Filters */}
            <div className="mb-6 flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filtrer par nom, email..."
                        className="pl-9 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <ClientListSkeleton />
            ) : isError ? (
                <div className="p-8 text-center text-red-600 bg-red-50 rounded-md border border-red-100">
                    Une erreur est survenue lors du chargement des clients.
                </div>
            ) : (
                <ClientTable
                    clients={filteredClients}
                    onEdit={handleEdit}
                />
            )}

            <CreateClientModal
                open={isCreateModalOpen}
                onClose={handleCloseModal}
            />
        </AppShell>
    );
}
