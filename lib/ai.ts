import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function reviewCode(diff: string, prTitle: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `You are an expert code reviewer.
PR Title: ${prTitle}

Review this diff and provide:
1. **Summary** - What this PR does
2. **Issues Found** - Bugs, security issues, bad patterns
3. **Suggestions** - How to improve
4. **Score** - Rate quality from 1-10

Diff:
${diff.slice(0, 6000)}`

    const result = await model.generateContent(prompt)
    return result.response.text()
}