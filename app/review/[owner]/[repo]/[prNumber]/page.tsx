"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { Sparkles, Loader2, ArrowLeft, MessageSquare, CheckCircle2, AlertCircle, Info, Zap, Github, Copy, ExternalLink, Bot, GitPullRequest } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ReviewPage({ params }: { params: Promise<{ owner: string, repo: string, prNumber: string }> }) {
    const { owner, repo, prNumber } = use(params)
    const { data: session, status } = useSession()
    const router = useRouter()
    const [review, setReview] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/")
        }
    }, [status, router])

    useEffect(() => {
        const startReview = async () => {
            if (!session) return

            // Artificial progress steps for better UX
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev
                    return prev + Math.random() * 15
                })
            }, 800)

            try {
                const response = await fetch(`/api/review`, {
                    method: "POST",
                    body: JSON.stringify({ owner, repo, prNumber }),
                    headers: { "Content-Type": "application/json" }
                })
                const data = await response.json()
                if (data.feedback) {
                    setReview(data.feedback)
                }
            } catch (error) {
                console.error("Error generating review:", error)
            } finally {
                clearInterval(interval)
                setProgress(100)
                setLoading(false)
            }
        }

        if (session) {
            startReview()
        }
    }, [session, owner, repo, prNumber])

    if (status === "loading") {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-black">
                <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30 pb-20 font-sans">
            {/* Ambient background glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-success/5 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[150px]" />
            </div>

            <Navbar />

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <div className="mb-10 flex items-center justify-between animate-fade-in gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-all transform hover:-translate-x-1"
                        >
                            <Link href={`/dashboard/${owner}/${repo}`}>
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </Button>
                        <div className="flex flex-col">
                            <h2 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                <GitPullRequest className="w-3.5 h-3.5" />
                                Pull Request #{prNumber}
                            </h2>
                            <h1 className="text-2xl font-bold text-white tracking-tight">AI Analysis</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex px-3 py-1.5 rounded-full bg-muted border border-success/20 text-success text-[10px] font-bold uppercase tracking-wider items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            Verified Analysis
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-10 animate-fade-in text-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
                            <div className="w-32 h-32 rounded-[2.5rem] bg-card border-2 border-border flex items-center justify-center relative transform rotate-12 hover:rotate-0 transition-transform duration-500">
                                <Bot className="w-16 h-16 text-primary animate-bounce" />
                            </div>
                        </div>

                        <div className="space-y-4 max-w-sm">
                            <h3 className="text-2xl font-bold text-white tracking-tight whitespace-nowrap">Generating specialized insights...</h3>
                            <p className="text-muted-foreground text-sm italic font-medium">
                                Analyzing your code for bugs, security risks, and optimization opportunities.
                                This takes about 10 seconds.
                            </p>
                            <div className="pt-6">
                                <Progress value={progress} className="h-1.5 bg-muted" />
                                <div className="flex items-center justify-between mt-3 px-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {progress < 40 ? "Consulting LLM Experts" : progress < 80 ? "Scanning Security Vectors" : "Formatting Insights"}
                                    </span>
                                    <span className="text-[10px] font-black text-primary">{Math.round(progress)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {/* Summary Header */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {[
                                { icon: CheckCircle2, label: "Performance", status: "Optimized", color: "success" },
                                { icon: AlertCircle, label: "Security", status: "Secure", color: "blue" },
                                { icon: Info, label: "Code Style", status: "Premium", color: "primary" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-card/40 border border-border rounded-2xl p-4 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl bg-${stat.color === 'primary' ? 'primary' : stat.color === 'success' ? 'success' : 'blue'}-500/10 border border-${stat.color === 'primary' ? 'primary' : stat.color === 'success' ? 'success' : 'blue'}-500/20 flex items-center justify-center`}>
                                        <stat.icon className={`w-5 h-5 text-${stat.color === 'primary' ? 'primary' : stat.color === 'success' ? 'success' : 'blue'}-400`} />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</h4>
                                        <p className="text-sm font-bold text-white">{stat.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Formatting the review */}
                        <Card className="bg-card/40 border-border rounded-[2rem] overflow-hidden backdrop-blur-md shadow-2xl relative group">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="sm" className="bg-muted/50 border border-border text-muted-foreground hover:text-white rounded-lg gap-2">
                                    <Copy className="w-3 h-3" />
                                    Copy MD
                                </Button>
                            </div>
                            <CardHeader className="p-8 border-b border-border/50 bg-gradient-to-br from-muted/30 to-transparent">
                                <div className="flex items-center justify-between mb-2">
                                    <CardTitle className="text-xl font-bold text-success flex items-center gap-3">
                                        <Bot className="w-6 h-6" />
                                        Professional Feedback
                                    </CardTitle>
                                    {review && (
                                        (() => {
                                            const scoreMatch = review.match(/Score:\s*(\d+)/i);
                                            if (scoreMatch) {
                                                const score = parseInt(scoreMatch[1]);
                                                const color = score >= 8 ? "bg-success text-white" : score >= 5 ? "bg-warning text-black" : "bg-destructive text-white";
                                                return (
                                                    <Badge className={`${color} px-3 py-1 rounded-full text-xs font-bold border-none`}>
                                                        Score: {score}/10
                                                    </Badge>
                                                )
                                            }
                                            return null;
                                        })()
                                    )}
                                </div>
                                {/* <CardDescription className="text-muted-foreground font-medium italic">
                                    Provided by GPT-4 Omni Analysis
                                </CardDescription> */}
                            </CardHeader>
                            <CardContent className="p-10">
                                <div className="prose prose-invert prose-emerald max-w-none text-muted-foreground font-mono">
                                    {review?.split('\n').map((line, i) => {
                                        if (line.startsWith('Score:')) return null;
                                        if (line.startsWith('###')) {
                                            return <h3 key={i} className="text-xl font-bold text-white mt-10 mb-4 flex items-center gap-3">
                                                <Zap className="w-5 h-5 text-primary" />
                                                {line.replace('###', '').trim()}
                                            </h3>
                                        }
                                        if (line.startsWith('-')) {
                                            return <div key={i} className="flex gap-4 mb-4 group/item">
                                                <div className="w-1.5 h-1.5 rounded-full bg-success/40 mt-2.5 shrink-0 transition-all group-hover/item:bg-success group-hover/item:scale-125" />
                                                <p className="text-muted-foreground leading-relaxed font-medium transition-colors group-hover/item:text-zinc-100">
                                                    {line.replace('-', '').trim()}
                                                </p>
                                            </div>
                                        }
                                        if (line.trim() === '') return <div key={i} className="h-4" />
                                        return <p key={i} className="mb-4 leading-relaxed font-medium transition-colors hover:text-zinc-100">{line}</p>
                                    })}
                                </div>
                            </CardContent>
                            <CardFooter className="px-10 py-8 bg-muted/10 border-t border-border/50 flex flex-col items-center gap-6">
                                <div className="flex gap-4 w-full font-sans">
                                    <Button
                                        asChild
                                        className="flex-grow bg-white hover:bg-muted text-background font-bold h-12 rounded-xl flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 shadow-lg"
                                    >
                                        <a href={`https://github.com/${owner}/${repo}/pull/${prNumber}`} target="_blank" rel="noopener noreferrer">
                                            Apply Suggestions in GitHub
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-12 border-border bg-muted/50 hover:bg-muted text-white font-bold rounded-xl px-6 transition-colors"
                                    >
                                        Share
                                    </Button>
                                </div>
                                <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest text-center">
                                    End of AI Report — Trusted by developers for better code
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </main>
        </div>

    )
}
