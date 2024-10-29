'use client';

import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useDialog } from "@/hooks/useDialog";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import { useCurrentRole } from "@/hooks/use-current-role";
import { CreateDoctorSchema } from "@/schemas/doctor";
import { createDoctor } from "@/actions/doctor";

export const NewDoctorForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const currentRole = useCurrentRole();

    const { openDialog, handleConfirm, handleCancel } = useDialog(() => {
        form.handleSubmit(onSubmit)();
    });

    const form = useForm<z.infer<typeof CreateDoctorSchema>>({
        resolver: zodResolver(CreateDoctorSchema),
        defaultValues: {
            name: '',
            specialty: '',
            crm: '',
        }
    });

    const onSubmit = (values: z.infer<typeof CreateDoctorSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            createDoctor(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
                    if (data.success) {
                        form.reset();
                        setTimeout(() => {
                            setDialogOpen(false);
                        }, 1000);
                    }

                    setTimeout(() => {
                        setSuccess('');
                        setError('');
                    }, 1000);
                })
                .catch((error) => {
                    console.error("Error during registration", error);
                    setError("Houve um erro ao criar o usuário.");

                    setTimeout(() => setError(''), 2000);
                });
        });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        openDialog();
    };

    return (
        <>
            <Button
                className="hover:bg-primary hover:text-white"
                variant="outline"
                onClick={() => setDialogOpen(true)}
                disabled={currentRole === 'journalist'}
            >
                Criar Médico
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    {currentRole === 'journalist' ? (
                        <p className="text-center text-red-500">Você não tem permissão para criar usuários.</p>
                    ) : (
                        <Form {...form}>
                            <form className="grid gap-4 py-4" onSubmit={handleFormSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Criar Novo Usuário</DialogTitle>
                                    <DialogDescription>Digite as informações do novo usuário</DialogDescription>
                                </DialogHeader>

                                {/* Campo Nome */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <>
                                                <FormLabel className="col-span-1 text-right"><span className="text-red-500">*</span>Nome</FormLabel>
                                                <FormItem className="col-span-3">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Nome do Usuário"
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

                                {/* Campo Especialidade */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <FormField
                                        control={form.control}
                                        name="specialty"
                                        render={({ field }) => (
                                            <>
                                                <FormLabel className="col-span-1 text-right"><span className="text-red-500">*</span>Especialidade</FormLabel>
                                                <FormItem className="col-span-3">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Especialidade"
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

                                {/* Campos Estado e CRM */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    {/* Campo Estado */}
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <>
                                                <FormLabel className="col-span-1 text-right"><span className="text-red-500">*</span>Estado</FormLabel>
                                                <FormItem className="col-span-1">
                                                    <FormControl>
                                                        <Controller
                                                            name="state"
                                                            control={form.control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    value={field.value || ''}
                                                                    onValueChange={(value) => field.onChange(value)}
                                                                >
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="UF" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((state) => (
                                                                                <SelectItem key={state} value={state}>{state}</SelectItem>
                                                                            ))}
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            </>
                                        )}
                                    />

                                    {/* Campo CRM */}
                                    <FormField
                                        control={form.control}
                                        name="crm"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormControl>
                                                    <Input
                                                        placeholder="CRM do Médico"
                                                        disabled={isPending}
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

                                {/* Campo Telefone */}
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

                                {/* Campo E-mail */}
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
                                                            placeholder="you@example.com"
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

                                {/* Campo Imagem */}
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

                                {/* Botões de Ação */}
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-4 items-center">
                                        <FormError message={error} />
                                        <FormSuccess message={success} />
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger className="hover:bg-primary hover:text-white" asChild>
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
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};