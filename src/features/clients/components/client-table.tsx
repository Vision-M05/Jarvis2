"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal, Pencil, Trash2, Mail, Phone, MapPin } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Client } from "@/lib/supabase/types";
import { useDeleteClient } from "../hooks/use-clients";

interface ClientTableProps {
    clients: Client[];
    onEdit?: (client: Client) => void;
}

export function ClientTable({ clients, onEdit }: ClientTableProps) {
    const { mutate: deleteClient } = useDeleteClient();

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${name} ?`)) {
            deleteClient(id);
        }
    };

    if (clients.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-md border bg-white p-8 text-center animate-in fade-in-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                    <MoreHorizontal className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900">Aucun client</h3>
                <p className="text-slate-500 mt-1 max-w-sm">
                    Commencez par ajouter votre premier client pour gérer vos devis et factures.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Localisation</TableHead>
                        <TableHead>Date d'ajout</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell>
                                <div className="font-medium text-slate-900">{client.name}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col space-y-1">
                                    {client.email && (
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Mail className="mr-2 h-3.5 w-3.5 text-slate-400" />
                                            {client.email}
                                        </div>
                                    )}
                                    {client.phone && (
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Phone className="mr-2 h-3.5 w-3.5 text-slate-400" />
                                            {client.phone}
                                        </div>
                                    )}
                                    {!client.email && !client.phone && (
                                        <span className="text-sm text-slate-400">—</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center text-sm text-slate-600">
                                    {client.city ? (
                                        <>
                                            <MapPin className="mr-2 h-3.5 w-3.5 text-slate-400" />
                                            {client.zip} {client.city}
                                        </>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-500">
                                {format(new Date(client.created_at), "d MMMM yyyy", { locale: fr })}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => onEdit?.(client)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Modifier
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600"
                                            onClick={() => handleDelete(client.id, client.name)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
