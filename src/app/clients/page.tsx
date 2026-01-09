"use client";

import { useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateClientModal } from "@/features/clients/components/create-client-modal";
import { useClients } from "@/features/clients/hooks/use-clients";

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: clients, isLoading, isError } = useClients();

    const filteredClients = clients?.filter(
        (client) =>
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.phone?.includes(searchQuery)
    ) || [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground mt-2">
                        Gérez votre base de données clients.
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Client
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par nom, email..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom / Entreprise</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Localisation</TableHead>
                            <TableHead>Date d'ajout</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Chargement des clients...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-red-500">
                                    Erreur lors du chargement des clients.
                                </TableCell>
                            </TableRow>
                        ) : filteredClients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                            <Users className="h-6 w-6 text-slate-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Aucun client trouvé</p>
                                            <p className="text-sm text-slate-500">
                                                Commencez par ajouter votre premier client.
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsCreateModalOpen(true)}
                                        >
                                            Ajouter un client
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">{client.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="text-slate-900">{client.email || "—"}</span>
                                            <span className="text-slate-500">{client.phone || "—"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {client.city ? (
                                            <span className="text-sm">
                                                {client.zip} {client.city}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-sm">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-slate-500">
                                        {new Date(client.created_at).toLocaleDateString("fr-FR")}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <CreateClientModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
