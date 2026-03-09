"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { History, Search, Loader2, GitPullRequest, FolderGit2, Star, Clock, ArrowRight, Github, Trash2, Calendar, FileText, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Review {
    _id: string
    repoName: string
    prNumber: number
    prTitle: string
    feedback: string
    createdAt: string
}

export default function HistoryPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/")
        }
    }, [status, router])

    useEffect(() => {
        const fetchHistory = async () => {
            if (!session) return
            try {
                const response = await fetch("/api/reviews")
                const data = await response.json()
                if (Array.isArray(data)) {
                    setReviews(data)
                }
            } catch (error) {
                console.error("Error fetching history:", error)
            } finally {
                setLoading(false)
            }
        }

        if (session) {
            fetchHistory()
        }
    }, [session])

    const filteredReviews = reviews.filter(review => 
        review.prTitle.toLowerCase().includes(search.toLowerCase()) ||
        review.repoName.toLowerCase().includes(search.toLowerCase()) ||
        review.prNumber.toString().includes(search)
    )

    if (status === "loading") {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30 font-sans">
            {/* Ambient background glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-success/5 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px]" />
            </div>

            <Navbar />

            <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2 underline-offset-8 decoration-primary decoration-2 underline">
                            <History className="w-6 h-6 text-primary" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Archive</h4>
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Review History</h1>
                        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed font-medium">
                            Explore your past AI reviews. Monitor improvements over time and maintain high-quality code.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Filter by title, repo, or #id..." 
                            className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all backdrop-blur-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-8 rounded-[2rem] border border-border bg-card/20 flex gap-6 animate-pulse">
                                <div className="w-16 h-16 rounded-2xl bg-muted" />
                                <div className="flex-grow space-y-4">
                                    <div className="h-8 w-1/4 bg-muted rounded-xl" />
                                    <div className="h-5 w-1/3 bg-muted rounded-lg opacity-50" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => (
                                <div key={review._id} className="group relative bg-card/40 border border-border hover:border-primary/30 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl overflow-hidden backdrop-blur-md">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-8 p-10">
                                        <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shadow-inner">
                                            <GitPullRequest className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>

                                        <div className="flex-grow space-y-3">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-2xl font-extrabold text-white group-hover:text-primary transition-colors line-clamp-1">
                                                    {review.prTitle}
                                                </h3>
                                                <Badge className="bg-muted/50 border-border text-muted-foreground hover:bg-muted text-xs font-black uppercase tracking-wider py-1 px-3">
                                                    #{review.prNumber}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                                                <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                                                    <FolderGit2 className="w-4 h-4" />
                                                    {review.repoName}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pt-4 lg:pt-0">
                                            <Button 
                                                asChild
                                                className="bg-white hover:bg-muted text-background font-extrabold h-14 px-8 rounded-2xl flex items-center gap-3 transition-transform hover:scale-[1.03] active:scale-95 shadow-xl"
                                            >
                                                <Link href={`/review/${review.repoName}/${review.prNumber}`} className="flex items-center gap-2">
                                                    View Report
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                className="h-14 w-14 border-border bg-muted/30 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-2xl transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))
                        ) : (
                            <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in bg-card/30 rounded-[4rem] border border-border border-dashed border-2">
                                <div className="w-24 h-24 rounded-[2rem] bg-card border border-border flex items-center justify-center group hover:border-primary/30 transition-colors">
                                    <FileText className="w-12 h-12 text-muted-foreground group-hover:text-primary/50 transition-colors" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black text-white tracking-tight">No records found</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                                        Your history is currently empty. Start a new code review to begin archives.
                                    </p>
                                </div>
                                <Button 
                                    asChild
                                    className="bg-primary hover:bg-primary-hover text-white font-bold h-14 px-10 rounded-2xl shadow-lg shadow-primary/20"
                                >
                                    <Link href="/dashboard">Initiate First Review</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
