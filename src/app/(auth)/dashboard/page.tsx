import React from "react";
import { getDashboardCounts } from "@/lib/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardCounts();

  const cardItems = [
    {
      title: "Usuários",
      description: "Quantidade total de usuários registrados.",
      fetchCount: data.usersCount,
    },
    {
      title: "Médicos",
      description: "Quantidade total de médicos cadastrados.",
      fetchCount: data.doctorsCount,
    },
    {
      title: "Notícias Publicadas",
      description: "Quantidade total de notícias que estão publicadas.",
      fetchCount: data.publishedArticlesCount,
    },
    {
      title: "Notícias",
      description: "Quantidade total de notícias cadastradas.",
      fetchCount: data.articlesCount,
    },
  ];

  return (
    <div>
      <section className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {cardItems.map((item, index) => (
          <Card key={index} className="dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="sm:text-xl text-lg text-gray-800 select-none dark:text-gray-300">
                  {item.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardDescription className="text-center">{item.description}</CardDescription>
            <CardContent className="text-center font-bold text-cyan-500">
              {item.fetchCount}
            </CardContent>
          </Card>
        ))}
      </section>
      <Separator className="my-3" />
    </div>
  );
}
