"use client"

import Image from "next/image"

const REVIEWS = [
    { image: "/user1.jpeg" },
    { image: "/user2.jpeg" },
    { image: "/user3.jpeg" },
    { image: "/user4.jpeg" },
    { image: "/user5.jpeg" },
    { image: "/user6.jpeg" },
    { image: "/user7.jpeg" },
    { image: "/user8.jpeg" },
    { image: "/user9.jpeg" },
    { image: "/user10.jpeg" }

]

export function CustomerReviews() {
    // Duplicate the array to create the infinite loop effect
    const extendedReviews = [...REVIEWS, ...REVIEWS, ...REVIEWS]

    return (
        <section className="py-16 bg-pink-50/30 border-t border-b border-pink-100/50 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-serif mb-4">
                    Love from our Customers
                </h2>
                <div className="w-20 h-1 bg-pink-300 mx-auto rounded-full"></div>
            </div>

            <div className="relative w-full overflow-hidden pause-on-hover">
                <div className="flex w-max animate-scroll">
                    {extendedReviews.map((review, index) => (
                        <div
                            key={index}
                            className="relative w-[300px] h-[300px] md:w-[450px] md:h-[350px] mx-4 rounded-2xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <Image
                                src={review.image}
                                alt="Customer Review"
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}