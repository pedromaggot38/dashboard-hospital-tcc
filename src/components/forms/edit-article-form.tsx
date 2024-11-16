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
import { ArticleSchema } from "@/schemas/article";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useTransition } from "react";
import { deleteArticle, updateArticle } from "@/actions/article";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import Link from "next/link";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import 'quill/dist/quill.snow.css';
import { useQuill } from 'react-quilljs';
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useCurrentRole } from "@/hooks/use-current-role";
import Uploader from "../uploader";

interface Article {
    title: string;
    subtitle: string | null;
    slug: string;
    published: boolean;
    author: string;
    content: string | null;
    imageUrl: string | null;
    imageDescription: string | null;
}
interface EditArticleProps {
    article: Article;
    originalSlug: string;
}

const EditArticleForm: React.FC<EditArticleProps> = ({ article, originalSlug }) => {
    const router = useRouter();
    const role = useCurrentRole();
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
            imageUrl: article.imageUrl || '',
            imageDescription: article.imageDescription || '',
        }
    });

    const { quill, quillRef } = useQuill();

    useEffect(() => {
        if (quill) {
            quill.root.innerHTML = article.content || '';
            quill.on('text-change', () => {
                const updatedContent = quill.root.innerHTML;
                form.setValue("content", updatedContent);
            });
        }
    }, [quill, article.content, form]);
    {/***************** Quill Editor**************** */ }

    const onUploadSuccess = (url: string) => {
        form.setValue('imageUrl', url);
    };

    const onSubmit = (values: z.infer<typeof ArticleSchema>) => {
        setSuccess('');
        setError('');
        startTransition(() => {
            updateArticle({ ...values, slug: values.slug }, originalSlug)
                .then((data) => {
                    if (data.success) {
                        setSuccess(data.success);
                        setTimeout(() => setSuccess(''), 2000);
                        router.push("/dashboard/articles");
                        router.refresh();
                    } else if (data.error) {
                        setError(data.error);
                    }
                })
                .catch(() => {
                    setError("Erro ao atualizar a notícia.");
                    setTimeout(() => setError(''), 2000);
                });
        });
    };
    const handleDelete = async () => {
        const response = await deleteArticle(originalSlug);
        if (response.success) {
            setSuccess(response.message);
            setTimeout(() => {
                setSuccess('');
                router.push("/dashboard/articles");
                router.refresh();
            }, 2000);
        } else {
            setError(response.message);
            setTimeout(() => setError(''), 2000);
        }
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
                                Editar Notícia
                            </h1>
                        </div>
                        <div className="grid gap-4 lg:gap-8">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex">
                                                <div className="flex-grow">
                                                    <CardTitle>Detalhes da Notícia</CardTitle>
                                                    <CardDescription>Edite os campos abaixo para atualizar a notícia</CardDescription>
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
                                                    <Uploader onUploadSuccess={onUploadSuccess} />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-2">
                                                <div className="grid grid-cols-2 gap-4 w-full">
                                                    <FormField
                                                        control={form.control}
                                                        name="title"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Título</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Título da notícia" {...field} />
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
                                                                    <Input placeholder="Sub-título da notícia" {...field} />
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
                                                                    <Input placeholder="Slug da notícia" {...field} />
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
                                                                    <Input placeholder="Autor da notícia" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="imageUrl"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Capa da notícia</FormLabel>
                                                                <FormControl>
                                                                    <Input type="text" placeholder="URL" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="imageDescription"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Descrição da Imagem</FormLabel>
                                                                <FormControl>
                                                                    <Input type="text" placeholder="Sobre a imagem..." {...field} />
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
                                                    )} />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            {success && <FormSuccess message={success} />}
                                            {error && <FormError message={error} />}
                                        </div>
                                        <div className="flex gap-2">
                                            {role !== 'journalist' && (
                                                <>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive">Apagar</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Você tem certeza que deseja apagar esta notícia? Esta ação não pode ser desfeita.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={handleDelete}>Apagar</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )}
                                            <Button type="submit" disabled={isPending}>Salvar Notícia</Button>
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