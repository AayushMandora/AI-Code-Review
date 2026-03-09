"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { Search, Loader2, FolderGit2, Star, Clock, ArrowRight, Github, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface Repository {
    id: number
    name: string
    full_name: string
    description: string
    stargazers_count: number
    updated_at: string
    language: string
    owner: {
        avatar_url: string
        login: string
    }
}

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [repos, setRepos] = useState<Repository[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/")
        }
    }, [status, router])

    useEffect(() => {
        const fetchRepos = async () => {
            if (!session) return
            try {
                const response = await fetch("/api/repos")
                const data = await response.json()
                if (Array.isArray(data)) {
                    setRepos(data)
                }
            } catch (error) {
                console.error("Error fetching repos:", error)
            } finally {
                setLoading(false)
            }
        }

        if (session) {
            fetchRepos()
        }
    }, [session])

    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(search.toLowerCase()) ||
        repo.full_name.toLowerCase().includes(search.toLowerCase())
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
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[150px]" />
            </div>

            <Navbar />

            <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Your Repositories</h1>
                        <p className="text-muted-foreground max-w-xl">
                            Select a repository to start reviewing your open Pull Requests.
                            Connect, analyze, and ship better code.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search repositories..."
                            className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all backdrop-blur-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="p-6 rounded-3xl border border-border bg-card/20 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 rounded-xl bg-muted" />
                                    <div className="space-y-2">
                                        <Skeleton className="w-32 h-4 bg-muted" />
                                        <Skeleton className="w-20 h-3 bg-muted" />
                                    </div>
                                </div>
                                <Skeleton className="w-full h-12 rounded-xl bg-muted" />
                                <div className="flex gap-2">
                                    <Skeleton className="w-16 h-6 rounded-full bg-muted" />
                                    <Skeleton className="w-16 h-6 rounded-full bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRepos.length > 0 ? (
                            filteredRepos.map((repo) => (
                                <Card
                                    key={repo.id}
                                    onClick={() => router.push(`/dashboard/${repo.owner.login}/${repo.name}`)}
                                    className="group relative bg-card/30 border-border hover:border-primary/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] backdrop-blur-md cursor-pointer h-full flex flex-col pt-6 px-1"
                                >
                                    <CardHeader className="px-6 pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                                <FolderGit2 className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-medium border-border text-muted-foreground bg-muted/50">
                                                {repo.language || "Markdown"}
                                            </Badge>
                                        </div>
                                        <div className="pt-4 space-y-1">
                                            <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                                                {repo.name}
                                            </CardTitle>
                                            <CardDescription className="text-muted-foreground text-xs font-medium flex items-center gap-1.5 line-clamp-1 italic">
                                                <User className="w-3 h-3" />
                                                {repo.owner.login}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-6 flex-grow font-sans">
                                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 min-h-12">
                                            {repo.description || "No description provided for this repository."}
                                        </p>
                                    </CardContent>

                                    <CardFooter className="px-6 py-6 mt-auto border-t border-border flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-warning/70" />
                                                {repo.stargazers_count}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(repo.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                                <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center">
                                    <Github className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">No repositories found</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        We couldn't find any repositories matching your search criteria.
                                        Try a different name or sync your GitHub account.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setSearch("")}
                                    variant="outline"
                                    className="border-border text-muted-foreground hover:text-foreground rounded-full px-8"
                                >
                                    Clear Search
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>

    )
}
