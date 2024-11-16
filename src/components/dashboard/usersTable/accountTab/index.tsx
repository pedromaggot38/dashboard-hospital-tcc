'use client'
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserEditSchema } from "@/schemas/auth/user";
import { useDialog } from "@/hooks/useDialog";
import { userEditUpdate } from "@/actions/auth/userEditUpdate";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

interface User {
    name: string | null;
    username: string;
    role: "root" | "admin" | "journalist";
    isBlocked: boolean;
    phone: string | null;
    email: string | null;
    image: string | null;
}
interface AccountTabProps {
    user: User;
    currentRole?: string;
}

type FormData = z.infer<typeof UserEditSchema>;

const AccountTabContent: React.FC<AccountTabProps> = ({ user, currentRole }) => {
    const router = useRouter();
    const [error, setError] = useState<string | undefined>(""); 
    const [success, setSuccess] = useState<string | undefined>(""); 
    const [isPending, startTransition] = useTransition();

    const { openDialog, handleConfirm, handleCancel } = useDialog(() => {
        form.handleSubmit(onSubmit)();
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        openDialog();
    };

    const form = useForm<FormData>({
        resolver: zodResolver(UserEditSchema),
        defaultValues: {
            name: user.name || undefined,
            role: user.role,
            isBlocked: user.isBlocked ?? false,
            phone: user.phone || undefined,
            email: user.email || undefined,
            image: user.image || undefined,
        },
    });

    const onSubmit = (values: z.infer<typeof UserEditSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            if (!user?.username) {
                setError("Usuário não encontrado.");
                return;
            }
            userEditUpdate(user.username, values)
                .then((response) => {
                    if (response.error) {
                        setError(response.error);
                    } else {
                        setSuccess(response.success);
                        router.replace('/dashboard/users'); 
                    }
                })
                .catch((error) => {
                    console.error("Error during update", error);
                    setError("Houve um erro ao atualizar os dados.");
                    setTimeout(() => setError(''), 2000);
                });
        });
    };

    return (
        <Form {...form}>
            <form
                className="grid gap-4 py-4"
                onSubmit={handleFormSubmit}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between">
                            Conta
                        </CardTitle>
                        <CardDescription>
                            Faça as mudanças do usuário <span className="text-blue-500">@{user.username}</span> aqui
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <>
                                        <FormLabel className="col-span-1 text-right">Nome</FormLabel>
                                        <FormItem className="col-span-3">
                                            <FormControl>
                                                <Input
                                                    placeholder="Nome e Sobrenome"
                                                    disabled={isPending}
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <FormLabel className="col-span-1 text-right">Cargo</FormLabel>
                            <FormItem className="col-span-3">
                                <FormControl>
                                    <Controller
                                        name="role"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value ?? ''}
                                                onValueChange={(value) => field.onChange(value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Cargos</SelectLabel>
                                                        {currentRole !== 'admin' && <SelectItem value="root">Root</SelectItem>}
                                                        <SelectItem value="admin">Administrador</SelectItem>
                                                        <SelectItem value="journalist">Jornalista</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>

                        <div className="space-y-1">
                            <FormLabel className="col-span-1 text-right">Bloqueado</FormLabel>
                            <FormItem className="col-span-3">
                                <FormControl>
                                    <Controller
                                        name="isBlocked"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value ? 'true' : 'false'}
                                                onValueChange={(value) => field.onChange(value === 'true')}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="false">Não</SelectItem>
                                                        <SelectItem value="true">Sim</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>

                        <div className="space-y-1">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <>
                                        <FormLabel className="col-span-1 text-right">Telefone</FormLabel>
                                        <FormItem className="col-span-3">
                                            <FormControl>
                                                <Input
                                                    placeholder="(99)99999-9999"
                                                    disabled={isPending}
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <>
                                        <FormLabel className="col-span-1 text-right">E-mail</FormLabel>
                                        <FormItem className="col-span-3">
                                            <FormControl>
                                                <Input
                                                    placeholder="you@example.com"
                                                    disabled={isPending}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <>
                                        <FormLabel className="col-span-1 text-right">Imagem</FormLabel>
                                        <FormItem className="col-span-3">
                                            <FormControl>
                                                <Input
                                                    placeholder="https://github.com/username.png"
                                                    disabled={isPending}
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div>
                            <FormError message={error} />
                            <FormSuccess message={success} />
                        </div>
                        <div>
                            <AlertDialog>
                                <AlertDialogTrigger className="hover:bg-primary hover:text-white" asChild>
                                    <Button className="w-min" variant="outline">Atualizar</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmar atualização</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tem certeza de que deseja atualizar os dados do usuário?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleConfirm}>Atualizar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
};

export default AccountTabContent;
