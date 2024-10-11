'use server'

import * as z from 'zod'
import { db } from "@/lib/db"
import { auth } from '../../auth';
import { ArticleSchema } from "@/schemas/article"
import { revalidatePath } from 'next/cache';


export const createArticle = async (values: z.infer<typeof ArticleSchema>) => {
    const session = await auth();
    const validatedFields = ArticleSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Erro ao validar os campos" }
    }

    const { title, subtitle, slug, author, published, content, imageUrl, imageDescription } = validatedFields.data

    const existingArticle = await db.article.findFirst({
        where: {
            OR: [
                { title: title },
                { slug: slug },
            ]
        }
    })

    if (existingArticle) {
        if (existingArticle.title === title) {
            return { error: 'Título já existe!' }
        }
        if (existingArticle.slug === slug) {
            return { error: 'Slug já existe!' }
        }
    }

    try {
        await db.article.create({
            data: {
                slug,
                title,
                subtitle,
                content,
                published,
                author,
                imageUrl,
                imageDescription,
                user: {
                    connect: {
                        id: session?.user.id
                    }
                },
            }
        })
    } catch (error) {
        console.error(error);
        return { error: "Erro ao criar o artigo" }
    }
    revalidatePath('/dashboard/articles')
    return { success: "Artigo criado!" }
}

export const updateArticle = async (values: z.infer<typeof ArticleSchema> & { slug: string }, originalSlug: string) => {
    const session = await auth();
    const validatedFields = ArticleSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Erro ao validar os campos" };
    }

    const { title, subtitle, slug, published, content, imageUrl, imageDescription } = validatedFields.data;

    const existingArticle = await db.article.findUnique({
        where: {
            slug: originalSlug
        }
    });

    if (!existingArticle) {
        return { error: "Artigo não encontrado." };
    }

    const conflictingArticle = await db.article.findFirst({
        where: {
            slug: slug,
            NOT: { id: existingArticle.id }
        }
    });

    if (conflictingArticle) {
        if (conflictingArticle.slug === slug) {
            return { error: 'Slug já existe!' };
        }
    }

    await db.article.update({
        where: {
            id: existingArticle.id,
        },
        data: {
            slug: slug,
            title,
            subtitle,
            content,
            published,
            imageUrl,
            imageDescription,
            user: {
                connect: {
                    id: session?.user.id
                }
            }
        }
    });

    return { success: "Artigo atualizado!" };
};

export const deleteArticle = async (slug: string) => {
    try {
        const article = await db.article.findUnique({
            where: { slug },
        });
        if (!article) {
            throw new Error('Artigo não encontrado');
        }
        await db.article.delete({
            where: { slug },
        });
        return { success: true, message: 'Artigo deletado com sucesso' };
    } catch (error: any) {
        console.error('Erro ao deletar o artigo:', error.message);
        return { success: false, message: error.message || 'Erro ao deletar o artigo' };
    }
};