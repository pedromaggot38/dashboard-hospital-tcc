import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { deleteArticle } from '@/actions/article';
import { useCurrentRole } from '@/hooks/use-current-role';

interface ActionMenuProps {
    article: {
        id: number;
        slug: string;
    };
}

const ActionMenu: React.FC<ActionMenuProps> = ({ article }) => {
    const router = useRouter();
    const role = useCurrentRole();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await deleteArticle(article.slug);
            if (response.success) {
                setIsDialogOpen(false);
                router.push("/dashboard/articles");
                router.refresh();
            } else {
                console.error('Erro ao apagar a notícia:', response.message);
            }
        } catch (error) {
            console.error("Erro ao deletar a notícia:", error);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    {/* Usando onSelect para fechar o menu automaticamente */}
                    <DropdownMenuItem
                        onSelect={() => router.push(`/dashboard/articles/${article.slug}/`)}
                    >
                        Editar notícia
                    </DropdownMenuItem>
                    {role !== 'journalist' && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={() => setIsDialogOpen(true)}
                            >
                                <span className='text-red-500'>Apagar notícia</span>
                            </DropdownMenuItem>
                        </>
                    )}

                </DropdownMenuContent>
            </DropdownMenu>

            {/* AlertDialog para confirmar a exclusão */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Você tem certeza que deseja apagar esta notícia? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                        >
                            Apagar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ActionMenu;