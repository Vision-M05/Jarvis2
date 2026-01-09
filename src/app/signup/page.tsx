"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/shared/toast-provider";
import { Loader2, Lock, UserPlus } from "lucide-react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            addToast({
                type: "error",
                title: "Erreur",
                message: "Les mots de passe ne correspondent pas.",
            });
            return;
        }

        if (!supabase) {
            addToast({
                type: "error",
                title: "Configuration manquante",
                message: "Impossible de créer un compte : Supabase n'est pas configuré.",
            });
            return;
        }

        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                throw error;
            }

            if (data.user) {
                setIsSuccess(true);
                addToast({
                    type: "success",
                    title: "Compte créé !",
                    message: "Veuillez vérifier vos emails pour confirmer votre inscription.",
                });
            }
        } catch (error: any) {
            addToast({
                type: "error",
                title: "Erreur d'inscription",
                message: error.message || "Une erreur est survenue.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <UserPlus className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-900">Inscription réussie !</CardTitle>
                        <CardDescription>
                            Un email de confirmation a été envoyé à {email}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-center text-sm text-slate-600">
                            Veuillez cliquer sur le lien dans l'email pour activer votre compte.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link href="/login">
                            <Button variant="outline">Retour à la connexion</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Lock className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Créer un compte</CardTitle>
                    <CardDescription>
                        Rejoignez JarvisBTP pour gérer votre activité.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
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
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création en cours...
                                </>
                            ) : (
                                "S'inscrire"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-slate-600">
                        Déjà un compte ?{" "}
                        <Link href="/login" className="font-medium text-blue-600 hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
