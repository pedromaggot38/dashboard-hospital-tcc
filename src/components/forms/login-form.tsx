'use client'
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/auth/user"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/auth/login";
import Link from "next/link";


export const LoginForm = () => {

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: '',
            password: '',
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError('')
        startTransition(() => {
            login(values)
                .then((data) => {
                    setError(data?.error)
                })
        })
    }


    return (
        <div className="min-h-screen flex items-center">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Entre com seu nome de usuário e senha
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome de Usuário</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Username"
                                                        disabled={isPending}
                                                        {...field}
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Senha</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="*********"
                                                        disabled={isPending}
                                                        type="password"
                                                        {...field}
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <div className="mb-3">
                                        <FormError message={error} />
                                        <FormSuccess message={success} />
                                    </div>
                                    <div className="flex gap-4">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isPending}
                                        >
                                            Login
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-sm text-center">
                                    <Link href="/password-recovery">Esqueceu sua senha?</Link>
                                </div>
                            </div>
                        </form>
                    </Form>

                </CardContent>
            </Card>
        </div>
    )
}