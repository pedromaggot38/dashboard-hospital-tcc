import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import AvatarDashboard from "../avatarDashboard";

interface User {
  id: string;
  name: string | null;
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

export function LastUsers() {
  const [lastUsers, setLastUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await fetch("/api/last-users");
      const data: User[] = await response.json();
      setLastUsers(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <Card className="flex-1 min-h-[500px]">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="sm:text-xl text-lg text-gray-800 select-none">
            Últimos Usuários
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="font-bold">
        <article>
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Bloqueado</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="relative">
                      <div className="bg-gray-200 h-10 w-10 rounded-full animate-pulse"></div>
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
                    <TableCell className="relative">
                      <div className="bg-gray-200 h-6 w-1/2 animate-pulse rounded-md"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                lastUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="relative">
                      <AvatarDashboard user={user} />
                      <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                    </TableCell>
                    <TableCell className="relative">
                      <span className={user.name ? "" : "text-gray-500"}>
                        {user.name || "Não informado"}
                      </span>
                      <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                    </TableCell>
                    <TableCell className="relative">
                      {user.role}
                      <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                    </TableCell>
                    <TableCell className="relative">
                      <span className={user.isBlocked ? "text-red-500" : ""}>
                        {user.isBlocked ? "Sim" : "Não"}
                      </span>
                      <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                    </TableCell>
                    <TableCell className="relative">
                      {new Date(user.createdAt).toLocaleDateString()}
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
