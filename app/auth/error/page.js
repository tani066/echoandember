
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AuthError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
                <p className="text-muted-foreground">
                    There was a problem signing you in. Please try again.
                </p>
                <Link href="/auth/signin">
                    <Button className="w-full">Try Again</Button>
                </Link>
                <Link href="/">
                    <Button variant="ghost" className="w-full">Back to Home</Button>
                </Link>
            </div>
        </div>
    )
}
