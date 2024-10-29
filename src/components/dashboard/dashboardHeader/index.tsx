'use client'
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Package2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { logout } from "@/actions/auth/logout";
import AvatarDashboard from "../avatarDashboard";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "../toggleButton";

const menuItems = [
    {
        title: "Dashboard",
        path: "/dashboard",
        accessibility: "Página Inicial",
    },
    {
        title: "Usuários",
        path: "/dashboard/users",
        accessibility: "Usuários",
    },
    {
        title: "Artigos",
        path: "/dashboard/articles",
        accessibility: "Artigos",
    },
    {
        title: "Médicos",
        path: "/dashboard/doctors",
        accessibility: "Doutores",
    },
];

export function DashboardHeader() {
    const user = useCurrentUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isSheetOpen, setSheetIsOpen] = useState(false);
    const pathname = usePathname();

    const closeMenu = () => {
        setIsOpen(false);
    };

    const onClick = () => {
        logout();
    };

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const handleSheetLinkClick = () => {
        setSheetIsOpen(false);
    };

    return (
        <header className="top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Logo</span>
                </Link>
                {menuItems.map((item) => {
                    const isActive =
                        (pathname === item.path) ||
                        (pathname.startsWith(item.path + '/') && item.path !== '/dashboard');

                    return (
                        <Link
                            key={item.title}
                            href={item.path}
                            className={`text-muted-foreground transition-colors hover:text-foreground ${isActive ? 'text-primary font-semibold' : ''}`}
                        >
                            <span>{item.title}</span>
                            <span className="sr-only">, {item.accessibility}</span>
                        </Link>
                    );
                })}
            </nav>
            <Sheet open={isSheetOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Alternar menu de navegação</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle></SheetTitle>
                    </SheetHeader>
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Package2 className="h-6 w-6" />
                        </Link>
                        {menuItems.map((item) => (
                            <Link
                                key={item.title}
                                href={item.path}
                                className={`text-muted-foreground transition-colors hover:text-foreground ${pathname === item.path ? 'text-primary font-semibold' : ''}`}
                                onClick={handleSheetLinkClick}
                            >
                                <span>{item.title}</span>
                                <span className="sr-only">, {item.accessibility}</span>
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative flex gap-2 items-center justify-end sm:justify-start">
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="text-sm">
                                <span>
                                    {user?.name ? `Bem-vindo, ${user.name}` : "Bem-vindo"}
                                </span>
                            </div>
                        </div>
                        <Separator orientation="vertical" className="mx-2 h-6" />
                        <div className="ml-auto sm:ml-0">
                            <Badge
                                variant={
                                    user?.role === "root"
                                        ? "destructive"
                                        : user?.role === "admin"
                                            ? "default"
                                            : "secondary"
                                }
                            >
                                {user?.role}
                            </Badge>
                        </div>
                        <Separator orientation="vertical" className="mx-2 h-6" />
                        <div>
                            <ModeToggle />
                        </div>
                    </div>
                </div>
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <AvatarDashboard user={user} />
                            <span className="sr-only">Botão do Usuário</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className={`${pathname === '/dashboard/settings' ? 'bg-primary' : ''}`} onClick={closeMenu}>
                            <Link
                                href="/dashboard/settings"
                                className={`text-muted-foreground hover:text-foreground ${pathname === '/dashboard/settings' ? 'font-semibold text-white' : 'text-primary'}`}
                            >
                                <span>Configurações</span>
                                <span className="sr-only">Configurações</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className={`${pathname === '/dashboard/help' ? 'bg-yellow-400' : ''}`} onClick={closeMenu}>
                            <Link
                                href="/dashboard/help"
                                className={`text-muted-foreground hover:text-foreground ${pathname === '/dashboard/help' ? 'text-white font-semibold' : 'text-yellow-600'}`}
                            >
                                <span>Ajuda</span>
                                <span className="sr-only">Ajuda</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onClick={() => {
                                closeMenu();
                                onClick();
                            }}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
