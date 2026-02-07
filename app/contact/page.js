import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="py-16 bg-pink-50 text-center">
                <h1 className="text-4xl font-bold font-serif mb-4">Get in Touch</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Have a question about an order? Want to collaborate? Or just want to say hi? We'd love to hear from you.
                </p>
            </section>

            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                            <p className="text-muted-foreground mb-8">
                                Fill out the form and our team will get back to you within 24 hours.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-muted-foreground text-sm">echo.n.ember26@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Phone</p>
                                    <p className="text-muted-foreground text-sm">8463050025</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Location</p>
                                    <p className="text-muted-foreground text-sm">Raigarh, Chhattisgarh, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-8 rounded-2xl border shadow-sm">
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input id="firstName" placeholder="Tanishk" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input id="lastName" placeholder="Ag" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="tani@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
                            </div>
                            <Button className="w-full" size="lg">Send Message</Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}
