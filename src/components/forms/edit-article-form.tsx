'use client';
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
import { Textarea } from "@/components/ui/textarea";
import { ArticleSchema } from "@/schemas/article";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useTransition } from "react";
import { updateArticle } from "@/actions/article";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import Link from "next/link";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import { useRouter } from "next/navigation";

interface Article {
    title: string;
    subtitle: string | null;
    slug: string;
    published: boolean;
    author: string;
    content: string | null;
}
interface EditArticleProps {
    article: Article;
    originalSlug: string;
}

const EditArticleForm: React.FC<EditArticleProps> = ({ article, originalSlug }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof ArticleSchema>>({
        resolver: zodResolver(ArticleSchema),
        defaultValues: {
            title: article.title,
            subtitle: article.subtitle || '',
            slug: article.slug,
            published: article.published,
            author: article.author,
            content: article.content || '',
        }
    });

    useEffect(() => {
        form.reset({
            title: article.title,
            subtitle: article.subtitle || '',
            slug: article.slug,
            published: article.published,
            author: article.author,
            content: article.content || '',
        });
    }, [article, form]);

    const onSubmit = (values: z.infer<typeof ArticleSchema>) => {
        setSuccess('');
        setError('');
        startTransition(() => {
            updateArticle({ ...values, slug: values.slug }, originalSlug)
                .then((data) => {
                    if (data.success) {
                        setSuccess(data.success);
                        router.refresh(); // Atualiza a página atual para garantir que as mudanças apareçam
                        router.push("/dashboard/articles"); // Navega para a página de artigos
                        // A chamada abaixo garante que a nova página também carregue os dados atualizados
                        router.refresh();
                    }
                    else if (data.error) {
                        setError(data.error);
                    }
                })
                .catch(() => {
                    setError("Erro ao atualizar a publicação.");
                    setTimeout(() => setError(''), 2000);
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
                                Editar Publicação
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
                                                    <CardDescription>Edite os campos abaixo para atualizar a publicação</CardDescription>
                                                </div>
                                                <div>
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
                                                                <Textarea placeholder="Conteúdo da publicação" {...field} />
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

export default EditArticleForm;