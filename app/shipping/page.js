
import { Navbar } from "@/components/navbar"

export default function ShippingPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="py-16 bg-pink-50 text-center">
                <h1 className="text-4xl font-bold font-serif mb-4 text-gray-900">Shipping & Returns</h1>
                <p className="text-muted-foreground max-w-xl mx-auto px-4">
                    Everything you need to know about how your special gifts reach you.
                </p>
            </section>

            {/* Content */}
            <section className="py-16 container mx-auto px-4 max-w-4xl">
                <div className="space-y-12">

                    {/* Shipping Policy */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-primary border-b border-pink-100 pb-2">Shipping Policy</h2>

                        <div className="space-y-4 text-muted-foreground">
                            <h3 className="font-semibold text-gray-900">Processing Time</h3>
                            <p>
                                Since many of our items are custom-made (like polaroids and frames), please allow 2-4 business days for us to create and package your order with care.
                                <br />
                                Since all gifts (except Polaroids) require at least 10–15 days for shipping, we recommend placing your order in advance to avoid any inconvenience and ensure your special moments aren’t missed.
                            </p>    

                            <h3 className="font-semibold text-gray-900 mt-4">Shipping Rates & Delivery Estimates</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Standard Shipping:</strong> 5-7 business days. calculated at checkout.</li>
                            </ul>
                            <p className="text-sm italic mt-2">
                                *Delivery times are estimates and commence from the date of shipping, rather than the date of order.
                            </p>

                            <h3 className="font-semibold text-gray-900 mt-4">International Shipping</h3>
                            <p>
                                Currently, we ship within India. We are working on bringing our gifts to the rest of the world soon!
                            </p>
                        </div>
                    </div>

                    {/* Returns Policy */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-primary border-b border-pink-100 pb-2">Returns & Refunds</h2>

                        <div className="space-y-4 text-muted-foreground">
                            <h3 className="font-semibold text-gray-900">Return Policy</h3>
                            <p>
                                As the products are customized according to your preferences, we do not accept returns. Once an order is placed, it cannot be returned.
                            </p>
                            <p>
                                <strong>Please Note:</strong> Customized or personalized items (such as photo frames with your pictures) cannot be returned unless they arrive damaged or defective.
                            </p>

                            <h3 className="font-semibold text-gray-900 mt-4">Damaged or Defective Items</h3>
                            <p>
                                We take great care in packaging your gifts. However, if your order arrives damaged, please contact us immediately at <a href="mailto:echo.n.ember26@gmail.com" className="text-primary hover:underline">echo.n.ember26@gmail.com</a> with photos of the damaged item and packaging. We will send a replacement or issue a refund right away.
                            </p>

                        
                        </div>
                    </div>

                </div>
            </section>
        </main>
    )
}
