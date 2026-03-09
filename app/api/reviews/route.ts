import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Review } from "@/lib/models/Review"
import connectDB from "@/lib/db"

export async function GET() {
    const session: any = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        await connectDB()
        const reviews = await Review.find({ userId: session.user.id }).sort({ createdAt: -1 })
        return NextResponse.json(reviews)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}