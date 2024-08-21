'use client'
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas/auth/user";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { register } from "@/../actions/user";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useDialog } from "@/hooks/useDialog";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setDialogOpen] = useState(false); // Estado para controlar a abertura do Dialog

    const { dialogOpen, openDialog, closeDialog, handleConfirm, handleCancel } = useDialog(() => {
        form.handleSubmit(onSubmit)();
    });

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: '',
            password: '',
            role: 'journalist',
            isBlocked: "false",
        }
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        console.log("Form is being submitted", values);
        setError('');
        setSuccess('');
    
        startTransition(() => {
            register(values)
                .then((data) => {
                    console.log("Response received", data);
                    setError(data.error);
                    setSuccess(data.success);
    
                    // Limpa os campos do formulário após a criação bem-sucedida
                    if (data.success) {
                        form.reset(); // Limpa o formulário
                        setDialogOpen(false); // Fecha o Dialog
                    }
    
                    // Limpa as mensagens de sucesso ou erro após 3 segundos
                    setTimeout(() => {
                        setSuccess('');
                        setError('');
                    }, 3000);
                })
                .catch((error) => {
                    console.error("Error during registration", error);
                    setError("Houve um erro ao criar o usuário.");
    
                    // Limpa a mensagem de erro após 3 segundos
                    setTimeout(() => setError(''), 3000);
                });
        });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        openDialog();
    };

    return (
        <>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>Criar Usuário</Button>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <Form {...form}>
                        <form
                            className="grid gap-4 py-4"
                            onSubmit={handleFormSubmit}
                        >
                            <DialogHeader>
                                <DialogTitle>Criar Novo Usuário</DialogTitle>
                                <DialogDescription>
                                    Digite as informações do novo usuário
                                </DialogDescription>
                            </DialogHeader>

                            {/* Username Field */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <>
                                            <FormLabel className="col-span-1 text-right">Username</FormLabel>
                                            <FormItem className="col-span-3">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Username"
                                                        disabled={isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </>
                                    )}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <>
                                            <FormLabel className="col-span-1 text-right">Senha</FormLabel>
                                            <FormItem className="col-span-3">
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Senha"
                                                        disabled={isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </>
                                    )}
                                />
                            </div>

                            {/* isBlocked Field */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <FormLabel className="col-span-1 text-right">Bloqueado</FormLabel>
                                <FormItem className="col-span-3">
                                    <FormControl>
                                        <Controller
                                            name="isBlocked"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onValueChange={(value) => field.onChange(value)}
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

                            {/* Role Field */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <FormLabel className="col-span-1 text-right">Cargo</FormLabel>
                                <FormItem className="col-span-3">
                                    <FormControl>
                                        <Controller
                                            name="role"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onValueChange={(value) => field.onChange(value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Cargos</SelectLabel>
                                                            <SelectItem value="root">Root</SelectItem>
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

                            <Separator />
                            
                            <div className="grid grid-cols-4 items-center gap-4">
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
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <>
                                            <FormLabel className="col-span-1 text-right">E-mail</FormLabel>
                                            <FormItem className="col-span-3">
                                                <FormControl>
                                                    <Input
                                                        placeholder="E-mail"
                                                        disabled={isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <>
                                            <FormLabel className="col-span-1 text-right">Telefone</FormLabel>
                                            <FormItem className="col-span-3">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Telefone"
                                                        disabled={isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <>
                                            <FormLabel className="col-span-1 text-right">Imagem</FormLabel>
                                            <FormItem className="col-span-3">
                                                <FormControl>
                                                    <Input
                                                        placeholder="URL da imagem"
                                                        disabled={isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <AlertDialog>
                                    <AlertDialogTrigger className="hover:bg-primary" asChild>
                                        <Button className="w-min" variant="outline">Criar</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirmar Criação</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Você tem certeza que deseja criar este usuário?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleConfirm}>Continuar</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};
