import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user }) {
            try {
                if (user.email === "tanishk.agrawal2024@nst.rishihood.edu.in") {
                    await prisma.user.update({
                        where: { email: user.email },
                        data: { role: "ADMIN" }
                    });
                }
            } catch (error) {
                console.error("Error updating user role:", error);
            }
            return true;
        },
    },
})
