import { LastNews } from "@/components/dashboard/lastnews";
import { LastUsers } from "@/components/dashboard/lastusers";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardData } from "@/lib/dataFetching";

const DashboardPage = async () => {
  const data = await fetchDashboardData();

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
      description: "Quantidade total de artigos que estão publicados.",
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
          <Card key={index} className="dark:bg-">
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
              {item.fetchCount}
            </CardContent>
          </Card>
        ))}
      </section>
      <Separator className="my-3" />
      <section className="grid grid-cols-1 gap-2 lg:grid-cols-2 sm:grid-cols-1 row-span-3 h-600">
        <LastNews />
        <LastUsers />
      </section>
    </div>
  );
};

export default DashboardPage;