import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

    // Redirect unauthenticated users trying to access admin
    if (isAdminPage) {
        if (!isLoggedIn) {
            return Response.redirect(new URL('/auth/signin', req.nextUrl))
        }
        // Simple role check (assuming role is on session user)
        if (req.auth.user.role !== "ADMIN") {
            return Response.redirect(new URL('/', req.nextUrl))
        }
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/', req.nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
