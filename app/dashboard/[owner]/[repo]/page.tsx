"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { GitPullRequest, Search, Loader2, ArrowLeft, Clock, MessageSquare, User, ExternalLink, Sparkles, ChevronRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PullRequest {
    id: number
    number: number
    title: string
    user: {
        login: string
    }
    updated_at: string
    html_url: string
    body: string
    labels: { name: string, color: string }[]
}

export default function PRsPage({ params }: { params: Promise<{ owner: string, repo: string }> }) {
    const { owner, repo } = use(params)
    const { data: session, status } = useSession()
    const router = useRouter()
    const [prs, setPrs] = useState<PullRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/")
        }
    }, [status, router])

    useEffect(() => {
        const fetchPRs = async () => {
            if (!session) return
            try {
                const response = await fetch(`/api/prs?owner=${owner}&repo=${repo}`)
                const data = await response.json()
                if (Array.isArray(data)) {
                    setPrs(data)
                }
            } catch (error) {
                console.error("Error fetching PRs:", error)
            } finally {
                setLoading(false)
            }
        }

        if (session) {
            fetchPRs()
        }
    }, [session, owner, repo])

    const filteredPRs = prs.filter(pr => 
        pr.title.toLowerCase().includes(search.toLowerCase()) ||
        pr.number.toString().includes(search)
    )

    if (status === "loading") {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-black">
                <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30 font-sans">
            {/* Ambient background glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px]" />
            </div>

            <Navbar />

            <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                <div className="mb-8 flex items-center gap-4 animate-fade-in">
                    <Button 
                        asChild
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-all transform hover:-translate-x-1"
                    >
                       <Link href="/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
                    </Button>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            <span>{owner}</span>
                            <span className="text-border">/</span>
                            <span>{repo}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Open Pull Requests</h1>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                        Select an open pull request to initiate an AI-powered code review. 
                        We'll analyze the changes and provide structured feedback.
                    </p>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Filter PRs by title or #id..." 
                            className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all backdrop-blur-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 rounded-3xl border border-border bg-card/20 flex gap-4 animate-pulse">
                                <div className="w-12 h-12 rounded-2xl bg-muted" />
                                <div className="flex-grow space-y-3">
                                    <div className="flex gap-4">
                                        <div className="h-6 w-1/3 bg-muted rounded-lg" />
                                        <div className="h-4 w-20 bg-muted rounded-lg" />
                                    </div>
                                    <div className="h-4 w-1/2 bg-muted rounded-lg opacity-50" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPRs.length > 0 ? (
                            filteredPRs.map((pr) => (
                                <Card 
                                    key={pr.id}
                                    className="group relative bg-card/40 border-border hover:border-blue-500/30 rounded-3xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.05)] backdrop-blur-md overflow-hidden p-6"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all shadow-inner">
                                            <GitPullRequest className="w-7 h-7 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                                        </div>

                                        <div className="flex-grow space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                                                    {pr.title}
                                                </h3>
                                                <span className="text-muted-foreground font-bold px-2 rounded-lg bg-muted text-sm">
                                                    #{pr.number}
                                                </span>
                                                {pr.labels.map(label => (
                                                    <Badge 
                                                        key={label.name} 
                                                        className="text-[10px] bg-muted/50 border-border text-muted-foreground hover:bg-muted transition-colors"
                                                    >
                                                        {label.name}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                                                <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
                                                    <User className="w-3.5 h-3.5" />
                                                    {pr.user.login}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(pr.updated_at).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-4 lg:pt-0">
                                            <Button 
                                                asChild
                                                variant="ghost" 
                                                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-2xl px-4 py-6"
                                            >
                                                <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                    <Github className="w-4 h-4" />
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </Button>

                                            <Button 
                                                onClick={() => router.push(`/review/${owner}/${repo}/${pr.number}`)}
                                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-6 rounded-2xl flex items-center gap-3 transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-blue-600/20"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                                Review PR
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in bg-card/20 rounded-[4rem] border border-border border-dashed">
                                <div className="w-20 h-20 rounded-full bg-muted border border-border flex items-center justify-center">
                                    <GitPullRequest className="w-10 h-10 text-border" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">No PRs found</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        There are no open pull requests in this repository. 
                                        Push some code to get started.
                                    </p>
                                </div>
                                <Button 
                                    asChild
                                    variant="outline" 
                                    className="border-border text-muted-foreground hover:text-foreground rounded-full px-8"
                                >
                                    <Link href="/dashboard">Back to Repos</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>

    )
}
