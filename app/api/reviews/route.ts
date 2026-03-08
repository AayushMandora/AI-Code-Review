import { getServerSession } from "next-auth"
import { connectDB } from "@/lib/mongoose"
import { Review } from "@/lib/models/Review"

export async function GET() {
    const session = await getServerSession()
    await connectDB()

    const reviews = await Review.find({ userId: session?.user?.id })
        .sort({ createdAt: -1 })
        .limit(10)

    return Response.json({ reviews })
}