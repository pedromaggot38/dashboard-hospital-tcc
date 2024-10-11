'use client'
import { ChevronLeft } from "lucide-react";
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
import { ArticleSchema } from "@/schemas/article";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect } from "react";
import { createArticle } from "@/actions/article";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import Link from "next/link";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import { useRouter } from "next/navigation";
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { toolbarOptions } from "@/lib/vars";
import Uploader from "../uploader";

const createSlug = (title: string) => {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const NewArticle = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof ArticleSchema>>({
        resolver: zodResolver(ArticleSchema),
        defaultValues: {
            title: '',
            subtitle: '',
            slug: '',
            published: false,
            author: '',
            content: ''
        }
    });
    const title = useWatch({ control: form.control, name: 'title' });

    useEffect(() => {
        if (title) {
            form.setValue('slug', createSlug(title));
        }
    }, [title, form]);

    {/***************** Quill Editor**************** */ }
    const moduleType = {
        toolbar: toolbarOptions,
    }
    const { quill, quillRef } = useQuill({ modules: moduleType });
    useEffect(() => {
        if (quill) {
            const handleTextChange = () => {
                const content = quill.root.innerHTML;
                form.setValue("content", content);
            };

            quill.on("text-change", handleTextChange);

            return () => {
                quill.off("text-change", handleTextChange);
            };
        }
    }, [quill, form]);
    {/***************** Quill Editor**************** */ }


    const onSubmit = (values: z.infer<typeof ArticleSchema>) => {
        setSuccess('');
        setError('');
        startTransition(() => {
            createArticle(values)
                .then(async (data) => {
                    if (data.success) {
                        await uploader.uploadImage(values.slug);
                        
                        setSuccess(data.success);
                        router.push("/dashboard/articles");
                        form.reset();
                    } else if (data.error) {
                        setError(data.error);
                    }
                })
                .catch(() => {
                    setError("Erro ao criar a publicação.");
                });
        });
    };

    return (
        <div className="flex flex-col sm:gap-4 sm:pl-14 w-full">
            <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="w-full flex-1 flex justify-center">
                    <div className="w-[60%] max-w-[60%]">
                        <div className="flex items-center gap-4 mb-4">
                            <Link href="/dashboard/articles">
                                <Button variant="outline" size="icon" className="h-7 w-7">
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="sr-only">Voltar</span>
                                </Button>
                            </Link>
                            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight">
                                Nova Publicação
                            </h1>
                        </div>
                        <div className="grid gap-4 lg:gap-8">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                                    <Card>
                                        <CardHeader>

                                            <div className="flex">
                                                <div className="flex-grow">
                                                    <CardTitle>Detalhes da Publicação</CardTitle>
                                                    <CardDescription>Preencha os campos abaixo para criar uma nova publicação</CardDescription>
                                                </div>
                                                <div className="flex gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="published"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Controller
                                                                        control={form.control}
                                                                        name="published"
                                                                        render={({ field }) => (
                                                                            <Select
                                                                                value={field.value ? 'true' : 'false'}
                                                                                onValueChange={(value) => field.onChange(value === 'true')}
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Selecione o status" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="true">Publicado</SelectItem>
                                                                                    <SelectItem value="false">Rascunho</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Uploader slug={form.watch('slug')} />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name="title"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Título</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Título da publicação" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="subtitle"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Sub-título</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Sub-título da publicação" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="slug"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Slug</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Slug da publicação" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="author"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Autor</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Autor da publicação" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="content"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Conteúdo</FormLabel>
                                                            <FormControl>
                                                                <div className="editor-container">
                                                                    <div ref={quillRef} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            {success && <FormSuccess message={success} />}
                                            {error && <FormError message={error} />}
                                        </div>
                                        <div>
                                            <Button type="submit" disabled={isPending}>Salvar Publicação</Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default NewArticle;
