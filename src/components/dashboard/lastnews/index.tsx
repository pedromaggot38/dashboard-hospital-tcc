'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

interface User {
  name: string | null;
  username: string;
}

interface News {
  id: string;
  title: string;
  user: User;
  published: boolean;
  createdAt: string;
}

export function LastNews() {
  const [lastNews, setLastNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await fetch("/api/last-news");
      const data: News[] = await response.json();
      setLastNews(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <Card className="flex-1 min-h-[500px]">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="sm:text-xl text-lg text-gray-800 select-none">
            Últimos Posts
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="font-bold">
        <article>
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead>Publicado</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="relative">
                      <div className="bg-gray-200 h-6 w-full animate-pulse rounded-md"></div>
                    </TableCell>
                    <TableCell className="relative">
                      <div className="bg-gray-200 h-6 w-3/4 animate-pulse rounded-md"></div>
                    </TableCell>
                    <TableCell className="relative">
                      <div className="bg-gray-200 h-6 w-1/2 animate-pulse rounded-md"></div>
                    </TableCell>
                    <TableCell className="relative">
                      <div className="bg-gray-200 h-6 w-1/3 animate-pulse rounded-md"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                lastNews.map((news) => (
                  <TableRow key={news.id}>
                    <TableCell className="relative">
                      {news.title || "Título não informado"}
                      <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                    </TableCell>
                    <TableCell className="relative">
                      {news.user.name ? (
                        news.user.name
                      ) : (
                        <span className="text-blue-500">@{news.user.username}</span>
                      )}
                      <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                    </TableCell>
                    <TableCell className="relative">
                      {news.published ? "Sim" : "Não"}
                      <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                    </TableCell>
                    <TableCell className="relative">
                      {new Date(news.createdAt).toLocaleDateString()}
                      <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </article>
      </CardContent>
    </Card>
  );
}
