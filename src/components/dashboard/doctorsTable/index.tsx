import { db } from "@/lib/db";
import { DataTable } from "./data-table";
import { Articles, columns } from "./columns";

async function getData(): Promise<Articles[]> {
    const doctors = await db.doctors.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    name: true,
                    username: true,
                    role: true,
                    image: true,
                    createdAt: true,
                    _count: {
                        select: { articles: true },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return articles.map((article) => ({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        content: article.content ?? undefined,
        published: article.published,
        author: article.author,
        slug: article.slug,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        user: {
            name: article.user.name ?? "",
            username: article.user.username,
            role: article.user.role,
            image: article.user.image ?? "",
            createdAt: article.user.createdAt,
            articleCount: article.user._count.articles,
        },
    }));
}
const ArticlesTable = async () => {
    const data = await getData()

    return (
        <div>
            <DataTable columns={columns} data={data} />
        </div>
    );
};

export default ArticlesTable;
