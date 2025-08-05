/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {motion} from "framer-motion";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import apiServiceAdmin, {setSessionAdmin} from "@/lib/services/apiServiceAdmin";

// --------------------------------
// Types and Enums
// --------------------------------

enum AuthView {
    SIGN_IN = "sign-in",
    FORGOT_PASSWORD = "forgot-password",
    RESET_SUCCESS = "reset-success",
}

interface AuthState {
    view: AuthView;
}

interface FormState {
    isLoading: boolean;
    error: string | null;
}

// --------------------------------
// Schemas
// --------------------------------

const signInSchema = z.object({
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});



type SignInFormValues = z.infer<typeof signInSchema>;

// --------------------------------
// Main Auth Component
// --------------------------------

function Auth({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="auth"
            className={cn("mx-auto w-full max-w-md", className)}
            {...props}
        >
            <div
                className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"/>
                <div className="relative z-10">
                    <AuthSignIn onForgotPassword={() => {}} />
                </div>
            </div>
        </div>
    );
}

// --------------------------------
// Shared Components
// --------------------------------

interface AuthFormProps<T> {
    onSubmit: (data: T) => Promise<void>;
    children: React.ReactNode;
    className?: string;
}

function AuthForm<T>({onSubmit, children, className}: AuthFormProps<T>) {
    return (
        <form
            onSubmit={onSubmit}
            data-slot="auth-form"
            className={cn("space-y-6", className)}
        >
            {children}
        </form>
    );
}

interface AuthErrorProps {
    message: string | null;
}

function AuthError({message}: AuthErrorProps) {
    if (!message) return null;
    return (
        <div
            data-slot="auth-error"
            className="mb-6 animate-in rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
        >
            {message}
        </div>
    );
}

// --------------------------------
// Sign In Component
// --------------------------------

interface AuthSignInProps {
    onForgotPassword: () => void;
}

function AuthSignIn({}: AuthSignInProps) {
    const [formState, setFormState] = React.useState<FormState>({
        isLoading: false,
        error: null,
    });
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}} = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {email: "", password: ""},
    });

    const onSubmit = async (data: SignInFormValues) => {
        setFormState((prev) => ({...prev, isLoading: true, error: null}));
        try {
            const res = await apiServiceAdmin.post("/api/auth/login", data);
            const {user, accessToken, refreshToken} = res.data;
            setSessionAdmin({accessToken, refreshToken, adminId: user?.id});
            if (typeof window !== "undefined" && !document.cookie.includes('adminAccessToken=')) {
                document.cookie = `adminAccessToken=${accessToken};path=/;samesite=strict`;
            }
            router.push("/users");
        } catch (err: any) {
            if (err?.response?.status === 401 || err?.response?.status === 400) {
                setFormState((prev) => ({...prev, error: "Identifiants invalides. Veuillez réessayer."}));
            } else {
                setFormState((prev) => ({...prev, error: "Erreur de connexion. Veuillez réessayer."}));
            }
        } finally {
            setFormState((prev) => ({...prev, isLoading: false}));
        }
    };

    return (
        <motion.div
            data-slot="auth-sign-in"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.3, ease: "easeInOut"}}
            className="p-8"
        >
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-foreground">Bienvenue</h1>
                <p className="mt-2 text-sm text-muted-foreground">Connectez-vous à votre compte administrateur</p>
            </div>

            <AuthError message={formState.error}/>

            <AuthForm<SignInFormValues> onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="nom@example.com"
                        disabled={formState.isLoading}
                        className={cn(errors.email && "border-destructive")}
                        {...register("email")}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Mot de passe</Label>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        disabled={formState.isLoading}
                        className={cn(errors.password && "border-destructive")}
                        {...register("password")}
                    />
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={formState.isLoading}>
                    {formState.isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Connexion en cours...
                        </>
                    ) : (
                        "Se connecter"
                    )}
                </Button>
            </AuthForm>

            <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                    Mot de passe oublié ? Contactez votre administrateur système.
                </p>
            </div>
        </motion.div>
    );
}

// --------------------------------
// Exports
// --------------------------------

export {
    Auth,
    AuthSignIn,
    AuthForm,
    AuthError
};
