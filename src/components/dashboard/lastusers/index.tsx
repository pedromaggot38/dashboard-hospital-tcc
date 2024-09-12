import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import AvatarDashboard from "../avatarDashboard";

export async function LastUsers() {
  const lastUsers = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

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
          <Table>
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
              {lastUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="relative">
                    <AvatarDashboard user={user} />
                    <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                  </TableCell>
                  <TableCell className="relative">
                    {user.name || 'Nome não informado'}
                    <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                  </TableCell>
                  <TableCell className="relative">
                    {user.role}
                    <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                  </TableCell>
                  <TableCell className="relative">
                    {user.isBlocked ? "Sim" : "Não"}
                    <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                  </TableCell>
                  <TableCell className="relative">
                    {user.createdAt.toLocaleDateString()}
                    <Separator orientation="vertical" className="absolute right-0 h-full top-0 my-2" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </article>
      </CardContent>
    </Card>
  );
}
