"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/shared/toast-provider";
import { User, Building, Bell, Shield, Palette, Loader2, Save } from "lucide-react";

export default function SettingsPage() {
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    // Profile state
    const [profile, setProfile] = useState({
        firstName: "Admin",
        lastName: "Principal",
        email: "admin@jarvis-btp.fr",
    });

    // Company state
    const [company, setCompany] = useState({
        name: "JarvisBTP SARL",
        siret: "123 456 789 00012",
        tva: "FR 12 345678901",
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        quoteSigned: true,
        paymentReceived: true,
        invoiceLate: true,
        weeklyReport: false,
    });

    const handleSave = async () => {
        setIsSaving(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSaving(false);

        addToast({
            type: "success",
            title: "Paramètres sauvegardés",
            message: "Vos modifications ont été enregistrées avec succès.",
        });
    };

    const handleNotificationToggle = (key: keyof typeof notifications) => {
        setNotifications((prev) => {
            const newValue = !prev[key];
            addToast({
                type: "info",
                title: newValue ? "Notification activée" : "Notification désactivée",
            });
            return { ...prev, [key]: newValue };
        });
    };

    return (
        <AppShell
            actionLabel="Sauvegarder"
            onAction={handleSave}
            searchPlaceholder="Rechercher un paramètre..."
        >
            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
                    <p className="text-slate-500">
                        Configurez votre compte et les préférences de l&apos;application.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sauvegarde...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Sauvegarder
                        </>
                    )}
                </Button>
            </div>

            <div className="grid gap-6 max-w-3xl">
                {/* Profile Settings */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="rounded-lg bg-blue-50 p-2">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle>Profil</CardTitle>
                            <p className="text-sm text-slate-500">Informations personnelles</p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Prénom</label>
                                <Input
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Nom</label>
                                <Input
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <Input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="mt-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Company Settings */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="rounded-lg bg-emerald-50 p-2">
                            <Building className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <CardTitle>Entreprise</CardTitle>
                            <p className="text-sm text-slate-500">Informations de facturation</p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Raison sociale</label>
                            <Input
                                value={company.name}
                                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700">SIRET</label>
                                <Input
                                    value={company.siret}
                                    onChange={(e) => setCompany({ ...company, siret: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">TVA Intracommunautaire</label>
                                <Input
                                    value={company.tva}
                                    onChange={(e) => setCompany({ ...company, tva: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="rounded-lg bg-orange-50 p-2">
                            <Bell className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <CardTitle>Notifications</CardTitle>
                            <p className="text-sm text-slate-500">Préférences de notification</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between py-2 hover:bg-slate-50 rounded px-2 -mx-2 cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Nouveau devis signé</p>
                                    <p className="text-xs text-slate-500">Recevez une notification quand un client signe un devis</p>
                                </div>
                                <button
                                    onClick={() => handleNotificationToggle("quoteSigned")}
                                    className={`relative h-6 w-11 rounded-full transition-colors ${notifications.quoteSigned ? "bg-blue-600" : "bg-slate-200"
                                        }`}
                                >
                                    <span
                                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow ${notifications.quoteSigned ? "translate-x-5" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </label>

                            <label className="flex items-center justify-between py-2 hover:bg-slate-50 rounded px-2 -mx-2 cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Paiement reçu</p>
                                    <p className="text-xs text-slate-500">Notification lors de la réception d&apos;un paiement</p>
                                </div>
                                <button
                                    onClick={() => handleNotificationToggle("paymentReceived")}
                                    className={`relative h-6 w-11 rounded-full transition-colors ${notifications.paymentReceived ? "bg-blue-600" : "bg-slate-200"
                                        }`}
                                >
                                    <span
                                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow ${notifications.paymentReceived ? "translate-x-5" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </label>

                            <label className="flex items-center justify-between py-2 hover:bg-slate-50 rounded px-2 -mx-2 cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Facture en retard</p>
                                    <p className="text-xs text-slate-500">Alerte lorsqu&apos;une facture dépasse son échéance</p>
                                </div>
                                <button
                                    onClick={() => handleNotificationToggle("invoiceLate")}
                                    className={`relative h-6 w-11 rounded-full transition-colors ${notifications.invoiceLate ? "bg-blue-600" : "bg-slate-200"
                                        }`}
                                >
                                    <span
                                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow ${notifications.invoiceLate ? "translate-x-5" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </label>

                            <label className="flex items-center justify-between py-2 hover:bg-slate-50 rounded px-2 -mx-2 cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Rapport hebdomadaire</p>
                                    <p className="text-xs text-slate-500">Résumé de votre activité chaque lundi</p>
                                </div>
                                <button
                                    onClick={() => handleNotificationToggle("weeklyReport")}
                                    className={`relative h-6 w-11 rounded-full transition-colors ${notifications.weeklyReport ? "bg-blue-600" : "bg-slate-200"
                                        }`}
                                >
                                    <span
                                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow ${notifications.weeklyReport ? "translate-x-5" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="rounded-lg bg-red-50 p-2">
                            <Shield className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <CardTitle className="text-red-600">Zone Dangereuse</CardTitle>
                            <p className="text-sm text-slate-500">Actions irréversibles</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Supprimer le compte</p>
                                <p className="text-xs text-slate-500">Cette action est irréversible</p>
                            </div>
                            <Button
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
                                        addToast({
                                            type: "error",
                                            title: "Suppression annulée",
                                            message: "Cette fonctionnalité sera disponible après l'intégration Supabase.",
                                        });
                                    }
                                }}
                            >
                                Supprimer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
