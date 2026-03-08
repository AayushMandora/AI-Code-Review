import { getServerSession } from "next-auth"
import { getPRDiff } from "@/lib/github"
import { reviewCode } from "@/lib/openai"
import { connectDB } from "@/lib/mongoose"
import { Review } from "@/lib/models/Review"

export async function POST(req: Request) {
    const session = await getServerSession()
    const { owner, repo, prNumber, prTitle, accessToken } = await req.json()

    await connectDB()

    const diff = await getPRDiff(accessToken, owner, repo, prNumber)
    const feedback = await reviewCode(diff, prTitle)

    const review = await Review.create({
        userId: session?.user?.id,
        repoName: `${owner}/${repo}`,
        prNumber,
        prTitle,
        feedback,
    })

    return Response.json({ review })
}