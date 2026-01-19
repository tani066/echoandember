"use client"

import { useState } from "react"
import { Star, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { addReview } from "@/app/actions"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export function ReviewSection({ productId, reviews }) {
    const { data: session } = useSession()
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!session) {
            toast.error("Please sign in to leave a review")
            return
        }
        setIsSubmitting(true)
        try {
            await addReview(productId, rating, comment)
            toast.success("Review submitted! ✨")
            setComment("")
            setRating(5)
        } catch (error) {
            toast.error("Failed to submit review")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold font-serif">Customer Reviews</h3>

            {/* List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-muted-foreground italic">No reviews yet. Be the first to share your thoughts!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="flex gap-4 p-4 rounded-xl bg-gray-50">
                            <Avatar>
                                <AvatarImage src={review.user.image} />
                                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{review.user.name || "Customer"}</span>
                                    <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-current" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <p className="text-gray-700 mt-2">{review.comment}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Form */}
            <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100">
                <h4 className="font-bold mb-4">Write a Review</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                type="button"
                                key={s}
                                onClick={() => setRating(s)}
                                className={`transition-transform hover:scale-110 focus:outline-none`}
                            >
                                <Star
                                    className={`w-6 h-6 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                            </button>
                        ))}
                    </div>
                    <Textarea
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        className="bg-white"
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Post Review"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
