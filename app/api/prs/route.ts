import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
    const session: any = await getServerSession(authOptions)
    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const owner = searchParams.get("owner")
    const repo = searchParams.get("repo")

    if (!owner || !repo) {
        return NextResponse.json({ error: "Missing owner or repo" }, { status: 400 })
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch PRs: ${response.statusText}`)
        }

        const prs = await response.json()
        return NextResponse.json(prs)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
