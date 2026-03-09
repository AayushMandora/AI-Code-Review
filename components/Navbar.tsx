"use client"

import { signOut, useSession } from "next-auth/react"
import { Code2, LogOut, LayoutDashboard, History, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-xl font-sans">
            <div className="flex h-16 items-center justify-between px-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="flex items-center gap-2 group transition-all">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Code2 className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-white">
                            AI Reviewer
                        </span>
                    </Link>
                    
                    <div className="hidden md:flex items-center gap-4 text-sm font-medium">
                        <Link href="/dashboard" className="px-3 py-2 rounded-lg bg-muted text-white flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            Dashboard
                        </Link>
                        <Link href="/history" className="px-3 py-2 rounded-lg text-muted-foreground hover:text-white hover:bg-muted flex items-center gap-2 transition-colors">
                            <History className="w-4 h-4" />
                            History
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-muted border border-border">
                        {session?.user?.image && (
                            <img 
                                src={session.user.image} 
                                alt="Avatar" 
                                className="w-6 h-6 rounded-full"
                            />
                        )}
                        <span className="text-xs font-semibold text-muted-foreground hidden sm:inline-block">
                            {session?.user?.name || "User"}
                        </span>
                    </div>
                    <Button 
                        onClick={() => signOut({ callbackUrl: "/" })}
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </nav>
    )
}
