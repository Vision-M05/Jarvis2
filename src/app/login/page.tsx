"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/shared/toast-provider";
import { Loader2, Lock } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();

    // Import from client.ts which handles missing config safely
    // We'll use the imported 'supabase' which might be null if not configured
    const [clientReady] = useState(isSupabaseConfigured);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!clientReady || !supabase) {
            addToast({
                type: "error",
                title: "Configuration manquante",
                message: "Supabase n'est pas configuré. Vérifiez vos variables d'environnement.",
            });
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            addToast({
                type: "success",
                title: "Connexion réussie",
                message: "Vous allez être redirigé...",
            });

            router.push("/dashboard");
            router.refresh(); // Refresh to update middleware/server sessions
        } catch (error: any) {
            addToast({
                type: "error",
                title: "Erreur de connexion",
                message: error.message || "Identifiants incorrects",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                            <Lock className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Connexion Jarvis BTP</CardTitle>
                    <CardDescription>
                        Entrez vos identifiants pour accéder à votre espace
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nom@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
