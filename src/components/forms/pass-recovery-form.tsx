'use client';

import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialog } from "@/hooks/useDialog";
import { passwordReset } from "@/actions/auth/passReset";
import { tokenVerification } from "@/actions/auth/tokenVerification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Button } from "../ui/button";
import { PasswordResetSchema, TokenVerificationSchema } from "@/schemas/auth/user";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useRouter } from "next/navigation";


export const PasswordRecoveryForm = () => {
    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [isVerified, setIsVerified] = useState(false);
    const [username, setUsername] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();

    const { openDialog, handleConfirm, handleCancel } = useDialog(() => {
        passwordForm.handleSubmit(onPasswordResetSubmit)();
    });

    const tokenForm = useForm<z.infer<typeof TokenVerificationSchema>>({
        resolver: zodResolver(TokenVerificationSchema),
        defaultValues: {
            username: '',
            token: '',
        }
    });
    const passwordForm = useForm<z.infer<typeof PasswordResetSchema>>({
        resolver: zodResolver(PasswordResetSchema),
        defaultValues: {
            newPassword: '',
            confirmNewPassword: ''
        }
    });

    const onVerificationSubmit = (values: z.infer<typeof TokenVerificationSchema>) => {
        setError('');
        setSuccess('');
        startTransition(() => {
            tokenVerification(values)
                .then((data) => {
                    if (data.success) {
                        setUsername(values.username); // Armazena o username para uso posterior
                        setSuccess('Token verificado com sucesso!');
                        tokenForm.reset();
                        setIsVerified(true);
                        setTimeout(() => {
                            setSuccess('');
                        }, 1500);
                    } else {
                        setError(data.error || "Erro ao verificar token.");
                    }
                })
                .catch((error) => {
                    console.error("Erro ao verificar token", error);
                    setError("Erro durante o processo de verificação de token.");
                });
        });
    };

    const onPasswordResetSubmit = (values: z.infer<typeof PasswordResetSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            passwordReset({ ...values, username })
                .then((data) => {
                    if (data.success) {
                        setDialogOpen(false);
                        setSuccess('Senha alterada com sucesso.');
                        setTimeout(() => {
                            setSuccess('');
                            router.push('/');
                        }, 1500);
                    }
                    else {
                        setError(data.error || 'Erro ao alterar a senha.');
                    }
                    setTimeout(() => {
                        setSuccess('');
                        setError('');
                    }, 2000);
                })
                .catch((error) => {
                    console.error("Erro ao alterar senha", error);
                    setError("Houve um erro ao alterar a senha.");
                    setTimeout(() => setError(''), 2000);
                });
        });
    };

    return (
        <div className="min-h-screen flex items-center">
            <Card className="mx-auto max-w-sm">
                <CardHeader className="p-4">
                    <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
                    <CardDescription>
                        {!isVerified
                            ? "Insira seu nome de usuário e token"
                            : "Insira sua nova senha"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isVerified ? (
                        // Formulário de verificação do token
                        <Form {...tokenForm}>
                            <form
                                onSubmit={tokenForm.handleSubmit(onVerificationSubmit)}
                            >
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <FormField
                                            control={tokenForm.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome de Usuário</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Username"
                                                            disabled={isPending}
                                                            {...field}
                                                            required
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <FormField
                                            control={tokenForm.control}
                                            name="token"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Token</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="*********"
                                                            disabled={isPending}
                                                            {...field}
                                                            required
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-3">
                                            <div className="flex flex-col gap-2">
                                                <FormError message={error} />
                                                <FormSuccess message={success} />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={isPending}
                                            >
                                                Verificar Token
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    ) : (
                        // Formulário de redefinição de senha
                        <Form {...passwordForm}>
                            <form
                                onSubmit={passwordForm.handleSubmit(onPasswordResetSubmit)}
                            >
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <FormLabel>Nova Senha</FormLabel>
                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>

                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Nova senha"
                                                            disabled={isPending}
                                                            {...field}
                                                            required
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormLabel>Confirme a Nova Senha</FormLabel>
                                    <div className="grid gap-2">
                                        <FormField
                                            control={passwordForm.control}
                                            name="confirmNewPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Confirme a nova senha"
                                                            disabled={isPending}
                                                            {...field}
                                                            required
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormError message={error} />
                                        <FormSuccess message={success} />
                                    </div>
                                    <div className="flex flex-col items-center gap-4">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className="w-full" variant="outline">Atualizar Senha</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirmar Alteração</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Você tem certeza que deseja atualizar a senha?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
