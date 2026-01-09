"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, RotateCcw, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { QuoteStatus } from "@/lib/supabase/types";

interface QuoteFiltersProps {
    activeStatus: QuoteStatus | "ALL";
    onStatusChange: (status: QuoteStatus | "ALL") => void;
    onReset: () => void;
    onDateChange?: (startDate: string, endDate: string) => void;
    onCollaboratorChange?: (collaboratorId: string) => void;
}

const collaborators = [
    { id: "all", name: "Tous les collaborateurs" },
    { id: "1", name: "Admin Principal" },
    { id: "2", name: "Jean Dupont" },
    { id: "3", name: "Marie Martin" },
];

export function QuoteFilters({
    activeStatus,
    onStatusChange,
    onReset,
    onDateChange,
    onCollaboratorChange,
}: QuoteFiltersProps) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [collaborator, setCollaborator] = useState("all");
    const [datePopoverOpen, setDatePopoverOpen] = useState(false);

    const handleDateApply = () => {
        onDateChange?.(startDate, endDate);
        setDatePopoverOpen(false);
    };

    const handleCollaboratorChange = (value: string) => {
        setCollaborator(value);
        onCollaboratorChange?.(value);
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setCollaborator("all");
        onReset();
    };

    const getDateLabel = () => {
        if (startDate && endDate) {
            return `${startDate} - ${endDate}`;
        }
        if (startDate) {
            return `Depuis ${startDate}`;
        }
        if (endDate) {
            return `Jusqu'à ${endDate}`;
        }
        return "Période";
    };

    return (
        <div className="mb-6 flex flex-wrap items-center gap-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">STATUT</span>
                <Tabs value={activeStatus} onValueChange={(v) => onStatusChange(v as QuoteStatus | "ALL")}>
                    <TabsList className="bg-slate-100">
                        <TabsTrigger value="ALL">Tous</TabsTrigger>
                        <TabsTrigger value="DRAFT">Brouillon</TabsTrigger>
                        <TabsTrigger value="SENT">Envoyé</TabsTrigger>
                        <TabsTrigger value="SIGNED">Signé</TabsTrigger>
                        <TabsTrigger value="REFUSED">Refusé</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Date Picker */}
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        {getDateLabel()}
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date de début</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date de fin</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setStartDate("");
                                    setEndDate("");
                                }}
                            >
                                Effacer
                            </Button>
                            <Button size="sm" onClick={handleDateApply}>
                                Appliquer
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Collaborator Select */}
            <Select value={collaborator} onValueChange={handleCollaboratorChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Collaborateur" />
                </SelectTrigger>
                <SelectContent>
                    {collaborators.map((collab) => (
                        <SelectItem key={collab.id} value={collab.id}>
                            {collab.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Reset */}
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 text-slate-500">
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
            </Button>
        </div>
    );
}
