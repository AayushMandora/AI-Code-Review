import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Groq from "groq-sdk"
import { Review } from "@/lib/models/Review"
import connectDB from "@/lib/db"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
    const session: any = await getServerSession(authOptions)
    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { owner, repo, prNumber } = await request.json()

    if (!owner || !repo || !prNumber) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    try {
        await connectDB()

        // 1. Fetch PR details
        const prResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        const prData = await prResponse.json()

        // 2. Fetch PR diff
        const diffResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Accept": "application/vnd.github.v3.diff",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })
        const diffText = await diffResponse.text()

        // 3. Generate AI Review  ← CHANGED BLOCK
        const prompt = `
        You are a senior software engineer conducting a code review.
        Review the following pull request:
        Title: ${prData.title}
        Description: ${prData.body}
        
        Diff:
        ${diffText.slice(0, 5000)}
        
        Provide a structured review in Markdown format. 
        Focus on:
        - Potential bugs or edge cases
        - Security vulnerabilities
        - Performance optimizations
        - Code style and readability
        - Suggestions for improvement
        
        At the very end of your response, include a score in the format: "Score: X/10" where X is a number from 1 to 10 based on the overall quality of the code changes.
        
        Be concise and professional.
        `

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a professional AI code reviewer." },
                { role: "user", content: prompt }
            ],
        })
        const feedback = completion.choices[0].message.content || "AI failed to generate a review."

        // 4. Save to DB (no change)
        const review = await Review.create({
            userId: session.user.id,
            repoName: `${owner}/${repo}`,
            prNumber: prNumber,
            prTitle: prData.title,
            feedback: feedback,
        })

        return NextResponse.json({ reviewId: review._id, feedback })
    } catch (error: any) {
        console.error("Review error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}