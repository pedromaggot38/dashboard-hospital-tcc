import { AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SettingsSecurity() {
    return (
        <div className="flex flex-col gap-3">
            <Card x-chunk="dashboard-04-chunk-1">
                <CardHeader>
                    <CardTitle>Alterar Senha</CardTitle>
                    <CardDescription>
                        Digite sua senha atual:
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <form>
                        {/*
                  TODO
                  CRUD
                */}
                        <Input placeholder="********" />
                    </form>
                </CardContent>

            </Card>
            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardTitle>Nova Senha</CardTitle>
                    <CardDescription>
                        Digite e confirme a nova senha:
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4">
                        <Input
                            placeholder="********"
                        />
                        <Input
                            placeholder="********"
                        />
                    </form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                <AlertDialog>
                        <AlertDialogTrigger>
                            <Button variant="outline">Salvar</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Alteração</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Você tem certeza que deseja alterar os dados?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction>Continuar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    )
}