'use client';

import { ChevronLeft, Edit } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DoctorSchema, WeekDay } from "@/schemas/doctor";
import { createDoctor } from "@/actions/doctor";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";

interface EditDoctorFormProps {
    doctor?: {
        id: number;
        name: string;
        specialty: string;
        state: string;
        crm: string;
        visibility: boolean;
        schedules: { dayOfWeek: string; startTime: string; endTime: string }[];
        phone?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

const EditDoctorForm: React.FC<EditDoctorFormProps> = ({ doctor }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof DoctorSchema>>({
        resolver: zodResolver(DoctorSchema),
        defaultValues: {
            name: doctor?.name || "",
            specialty: doctor?.specialty || "",
            state: doctor?.state as ("AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF" | "ES" | "GO" | "MA" | "MT" | "MS" | "MG" | "PA" | "PB" | "PR" | "PE" | "PI" | "RJ" | "RN" | "RS" | "RO" | "RR" | "SC" | "SP" | "SE" | "TO") | undefined || undefined,
            crm: doctor?.crm || "",
            visibility: doctor.visibility,
            schedules: doctor?.schedules.map(schedule => ({
                dayOfWeek: schedule.dayOfWeek as z.infer<typeof WeekDay>,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
            })) || [{ dayOfWeek: "Segunda", startTime: "08:00", endTime: "17:00" }],
            phone: doctor?.phone || "",
            email: doctor?.email || "",
            image: doctor?.image || "",
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "schedules",
    });

    const onSubmit = (values: z.infer<typeof DoctorSchema>) => {
        setSuccess('');
        setError('');
        startTransition(() => {
            createDoctor(values)
                .then((data) => {
                    if (data.success) {
                        setSuccess(data.success);
                        setTimeout(() => {
                            router.push("/dashboard/doctors");
                            form.reset();
                        }, 1500);
                    } else if (data.error) {
                        setError(data.error);
                    }
                })
                .catch(() => {
                    setError("Erro ao criar o médico.");
                });
        });
    };

    return (
        <div className="flex flex-col sm:gap-4 sm:pl-14 w-full">
            <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="w-full flex-1 flex justify-center">
                    <div className="w-[60%] max-w-[60%]">
                        <div className="flex items-center gap-4 mb-4">
                            <Link href="/dashboard/doctors">
                                <Button variant="outline" size="icon" className="h-7 w-7">
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="sr-only">Voltar</span>
                                </Button>
                            </Link>
                            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight">
                                Editar Médico
                            </h1>
                        </div>
                        <div className="grid gap-4 lg:gap-8">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex">
                                                <div className="flex-grow">
                                                    <CardTitle>Detalhes do Médico</CardTitle>
                                                    <CardDescription>Preencha os campos abaixo para criar um novo médico</CardDescription>
                                                </div>
                                                <div>
                                                    <FormField
                                                        control={form.control}
                                                        name="visibility"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Controller
                                                                        control={form.control}
                                                                        name="visibility"
                                                                        render={({ field }) => (
                                                                            <Select
                                                                                value={field.value ? 'true' : 'false'}
                                                                                onValueChange={(value) => field.onChange(value === 'true')}
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Selecione o status" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="true">Ativo</SelectItem>
                                                                                    <SelectItem value="false">Inativo</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-2">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="name"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Nome</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Nome do médico" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="specialty"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Especialidade</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Especialidade do médico" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="state"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Estado (CRM)</FormLabel>
                                                                <FormControl>
                                                                    <Select
                                                                        value={field.value || ''}
                                                                        onValueChange={field.onChange}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="UF" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((state) => (
                                                                                <SelectItem key={state} value={state}>{state}</SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="crm"
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-2">
                                                                <FormLabel>CRM</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="CRM do médico" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="phone"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Telefone</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="(99) 99999-9999" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="email"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>E-mail</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="you@example.com" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="image"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Imagem</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="URL da imagem" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Button type="submit" className="w-full">
                                        {isPending ? "Salvando..." : "Salvar Médico"}
                                    </Button>
                                    {success && <FormSuccess message={success} />}
                                    {error && <FormError message={error} />}
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditDoctorForm;
