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
import { useCurrentRole } from '@/hooks/use-current-role';
import { deleteDoctor } from '@/actions/doctor';

interface ActionMenuProps {
    doctor: {
        id: number;
        crm: string;
    };
}

const ActionMenu: React.FC<ActionMenuProps> = ({ doctor }) => {
    const router = useRouter();
    const role = useCurrentRole();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await deleteDoctor(doctor.crm);
            if (response.success) {
                setIsDialogOpen(false);
                router.push("/dashboard/doctors");
                router.refresh();
            } else {
                console.error('Erro ao apagar o médico:', response.error);
            }
        } catch (error) {
            console.error("Erro ao deletar o médico:", error);
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
                    {role !== 'journalist' && (
                        <>
                            <DropdownMenuItem
                                onSelect={() => router.push(`/dashboard/doctors/${doctor.crm}/`)}
                            >
                                Editar médico
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={() => setIsDialogOpen(true)}
                            >
                                <span className='text-red-500'>Apagar médico</span>
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
                            Você tem certeza que deseja apagar este médico? Esta ação não pode ser desfeita.
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