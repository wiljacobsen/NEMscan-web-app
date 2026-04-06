"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { formatDateRange } from "@/lib/utils";
import type { ScanPeriodWithCount } from "@/types";

export function PeriodSelector({ periods, currentPeriodId }: { periods: ScanPeriodWithCount[]; currentPeriodId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("period", e.target.value);
    } else {
      params.delete("period");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={currentPeriodId ?? ""}
      onChange={handleChange}
      className="h-8 rounded-md border border-nem-border bg-nem-card px-3 text-xs text-foreground focus:border-nem-accent focus:outline-none focus:ring-1 focus:ring-nem-accent"
    >
      <option value="">Latest Period</option>
      {periods.map((p) => (
        <option key={p.id} value={p.id}>
          {formatDateRange(p.startDate, p.endDate)} ({p._count.items} items)
        </option>
      ))}
    </select>
  );
}
