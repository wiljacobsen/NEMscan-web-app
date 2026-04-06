"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, User, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-nem-border bg-nem-bg/95 px-6 backdrop-blur-sm">
      <form onSubmit={handleSearch} className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search regulatory items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-full rounded-lg border border-nem-border bg-nem-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-nem-accent focus:outline-none focus:ring-1 focus:ring-nem-accent"
        />
      </form>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{session.user.name || session.user.email}</span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/auth/signin"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <User className="h-4 w-4" />
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
