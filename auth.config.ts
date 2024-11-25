import { getUserByUsername } from "@/data/user";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas/auth/user";
import type { NextAuthConfig } from 'next-auth';

const bcrypt = require('bcryptjs')

export const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { username, password } = validatedFields.data;

                    const user = await getUserByUsername(username);

                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password,
                    );

                    if (passwordsMatch) return user;
                }
                return null
            }
        })
    ],
    pages: {
        signIn: '/',
    },
};