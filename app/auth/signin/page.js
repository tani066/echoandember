
import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignIn() {
    return (
        <div className="min-h-screen grid items-center justify-center bg-pink-50 relative overflow-hidden">
            {/* Background Sparkles */}
            <div className="absolute top-10 left-10 text-primary/20 animate-pulse delay-75"><Sparkles size={40} /></div>
            <div className="absolute bottom-10 right-10 text-secondary/40 animate-pulse delay-150"><Sparkles size={60} /></div>

            <div className="text-center space-y-8 p-8 md:p-12 bg-white rounded-3xl shadow-xl max-w-md w-full mx-4 border border-pink-100 z-10">
                <div className="space-y-2">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to manage your orders and wishlist</p>
                </div>

                <form
                    action={async () => {
                        "use server"
                        await signIn("google", { redirectTo: "/" })
                    }}
                >
                    <Button variant="outline" size="lg" className="w-full text-lg h-14 rounded-xl border-2 hover:border-primary/50 hover:bg-pink-50 gap-3 transition-all group">
                        <svg className="h-6 w-6" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="group-hover:text-primary transition-colors">Sign in with Google</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
