import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
    const session: any = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
            },
        })

        if (!response.ok) {
            throw new Error("Failed to fetch repositories")
        }

        const repos = await response.json()
        return NextResponse.json(repos)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
