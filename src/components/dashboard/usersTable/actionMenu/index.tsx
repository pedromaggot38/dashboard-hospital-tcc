import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';

interface ActionMenuProps {
    user: {
        username: string;
        email?: string;
        role: string;
    };
}

const ActionMenu: React.FC<ActionMenuProps> = ({ user }) => {
    const currentUser = useCurrentUser();
    const role = useCurrentRole();
    const router = useRouter();

    const canEditUser = currentUser?.username !== user.username && !(role === 'admin' && user.role === 'root');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(user.email || "")}
                >
                    Copiar E-mail
                </DropdownMenuItem>

                {role !== 'journalist' && canEditUser && (
                    <div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                router.push(`/dashboard/users/${user.username}`);
                            }}
                        >
                            <span className='text-red-500'>Editar usuário</span>
                        </DropdownMenuItem>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionMenu;