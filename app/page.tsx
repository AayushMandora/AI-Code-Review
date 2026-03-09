"use client"

import { signIn, useSession } from "next-auth/react"
import { Github, Zap, Shield, BarChart3, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.push("/dashboard")
        }
    }, [session, router])

    return (
        <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/30 font-sans">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[150px] animate-pulse" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-1" />

            {/* Navigation (Transparent) */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                        <Code2 className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-muted-foreground">
                        AI Reviewer
                    </span>
                </div>
                <Button
                    onClick={() => signIn("github")}
                    variant="outline"
                    className="border-border bg-muted/50 hover:bg-muted text-foreground rounded-full px-6"
                >
                    Sign In
                </Button>
            </nav>

            <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-20 text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                    <span className="text-white">Review your code</span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-success">
                        at the speed of light
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
                    Automate your PR reviews with professional AI insights.
                    Catch bugs, improve performance, and maintain a cleaner codebase without the manual overhead.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={() => signIn("github")}
                        size="lg"
                        className="bg-foreground hover:bg-muted text-background font-bold h-14 px-8 rounded-2xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        <Github className="w-5 h-5" />
                        Get Started with GitHub
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted h-14 px-8 rounded-2xl"
                    >
                        View Demo
                    </Button>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                    {[
                        { icon: Shield, title: "Secure & Private", desc: "We never store your source code. We only analyze what's needed." },
                        { icon: BarChart3, title: "Actionable Insights", desc: "Detailed feedback on performance, security, and best practices." },
                        { icon: Zap, title: "Lightning Fast", desc: "Get high-quality reviews in seconds, keeping your workflow smooth." }
                    ].map((feature, i) => (
                        <div key={i} className="p-6 rounded-3xl border border-border bg-card/50 backdrop-blur-sm group hover:border-primary/50 transition-colors">
                            <feature.icon className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border mt-20 py-12 text-center">
                <p className="text-muted-foreground text-sm font-sans">
                    © 2025 AI Code Reviewer. Crafted with ❤️ for developers.
                </p>
            </footer>
        </div>

    )
}
