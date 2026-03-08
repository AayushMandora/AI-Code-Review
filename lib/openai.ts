import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function reviewCode(diff: string, prTitle: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `You are an expert code reviewer. Review the PR diff and provide:
1. **Summary** - What this PR does
2. **Issues Found** - Bugs, security issues, bad patterns
3. **Suggestions** - How to improve the code  
4. **Score** - Rate the PR quality from 1-10
Be concise and actionable.`,
            },
            {
                role: "user",
                content: `PR Title: ${prTitle}\n\nDiff:\n${diff.slice(0, 6000)}`, // trim to avoid token limit
            },
        ],
    })
    return response.choices[0].message.content
}