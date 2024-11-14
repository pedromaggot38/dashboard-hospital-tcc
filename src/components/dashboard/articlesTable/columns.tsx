'use client'

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import ActionMenu from "./actionMenu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CheckCircle, XCircle } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import AvatarDashboard from "../avatarDashboard";
import { Badge } from "@/components/ui/badge";

interface User {
    name?: string;
    username: string;
    role: "root" | "admin" | "journalist";
    image?: string;
    createdAt: Date;
    articleCount: number;
}

export const articleSchema = z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string(),
    published: z.boolean().default(false),
    content: z.string().optional(),
    user: z.object({
        name: z.string().optional(),
        username: z.string(),
        role: z.enum(['root', 'admin', 'journalist']),
        image: z.string().optional(),
        createdAt: z.date()
    }),
});

const formatJoinDate = (date: Date | string): string => {
    const d = new Date(date);
    const month = d.toLocaleString('pt-BR', { month: 'long' });
    const year = d.getFullYear();
    return `Juntou-se em ${month} de ${year}`;
};

const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

export type Articles = z.infer<typeof articleSchema>;

export const columns: ColumnDef<Articles>[] = [
    {
        accessorKey: "title",
        header: "Título",
        cell: info => {
            const value = info.getValue<string>();
            return <div className="line-clamp-2">{value}</div>;
        },
    },
    {
        accessorKey: "author",
        header: "Autor",
    },
    {
        accessorKey: "user.name",
        header: "Criado por",
        cell: info => {
            const user = info.row.original.user as User;

            return (
                <HoverCard>
                    <HoverCardTrigger>
                        <span className={user.name ? "select-none" : "select-none text-blue-500"}>
                            {user.name || `@${user.username}`}
                        </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                            <AvatarDashboard user={user} />
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-semibold">@{user.username}</h4>
                                    <Badge
                                        variant={
                                            user.role === "root"
                                                ? "destructive"
                                                : user.role === "admin"
                                                    ? "default"
                                                    : "secondary"
                                        }
                                    >
                                        {user.role}
                                    </Badge>
                                </div>
                                <p className="text-sm">
                                    Total de artigos publicados do usuário: {user.articleCount}
                                </p>
                                <div className="flex items-center pt-2">
                                    <span className="text-xs text-muted-foreground">
                                        {formatJoinDate(user.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Criado em
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: info => {
            const formattedDate = formatDate(info.getValue<Date>());
            return <div className="text-center">{formattedDate}</div>;
        }
    },
    {
        accessorKey: "published",
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Publicado
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: info => {
            const isPublished = info.getValue<boolean>();
            return (
                <div className="text-center">
                    {isPublished ? (
                        <div className="flex items-center justify-center text-green-500">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center text-red-500">
                            <XCircle className="w-5 h-5" />
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const article = row.original

            return (
                <ActionMenu article={article} />
            )
        },
    },
];
