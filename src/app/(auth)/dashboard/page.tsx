'use client'
import { useEffect, useState } from "react";
import { LastNews } from "@/components/dashboard/lastnews";
import { LastUsers } from "@/components/dashboard/lastusers";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardPage = () => {
  const [data, setData] = useState<{ usersCount: number; doctorsCount: number; publishedArticlesCount: number; articlesCount: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) throw new Error("Erro ao buscar dados do dashboard");

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const cardItems = [
    { title: "Usuários", description: "Quantidade total de usuários registrados.", fetchCount: data?.usersCount },
    { title: "Médicos", description: "Quantidade total de médicos cadastrados.", fetchCount: data?.doctorsCount },
    { title: "Notícias Publicadas", description: "Quantidade total de artigos que estão publicados.", fetchCount: data?.publishedArticlesCount },
    { title: "Notícias", description: "Quantidade total de notícias cadastradas.", fetchCount: data?.articlesCount },
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
            <CardDescription className="text-center">
              {item.description}
            </CardDescription>
            <CardContent className="text-center font-bold text-cyan-500">
              {isLoading ? (
                // Skeleton loader
                <div className="h-6 w-12 bg-gray-200 animate-pulse rounded-md mx-auto"></div>
              ) : (
                item.fetchCount
              )}
            </CardContent>
          </Card>
        ))}
      </section>
      <Separator className="my-3" />
      <section className="grid grid-cols-1 gap-2 lg:grid-cols-2 sm:grid-cols-1 row-span-3 h-600">
        {isLoading ? (
          <>
            <div className="h-[500px] bg-gray-700 animate-pulse rounded-md"></div>
            <div className="h-[500px] bg-gray-700 animate-pulse rounded-md"></div>
          </>
        ) : (
          <>
            <LastNews />
            <LastUsers />
          </>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
