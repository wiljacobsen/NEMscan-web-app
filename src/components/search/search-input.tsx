"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";

export function SearchInput({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue ?? "");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.push(`/search?${params.toString()}`);
    },
    [query, router, searchParams]
  );

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search regulatory items... e.g. "MLF changes" or "Powerlink revenue"'
        className="h-12 w-full rounded-xl border border-nem-border bg-nem-card pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-nem-accent focus:outline-none focus:ring-1 focus:ring-nem-accent"
      />
    </form>
  );
}
