import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { CategoryBreakdown as CategoryData } from "@/types";

export function CategoryBreakdown({ categories }: { categories: CategoryData[] }) {
  return (
    <div className="space-y-3">
      <h3 className="font-heading text-sm font-semibold text-muted-foreground">Categories</h3>
      {categories.map((cat) => (
        <Link key={cat.id} href={`/categories/${cat.slug}`}>
          <Card className="border-nem-border bg-nem-card p-3 transition-all hover:border-nem-accent/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{cat.name}</span>
              <div className="flex items-center gap-2">
                {cat.highCount > 0 && (
                  <span className="rounded-full bg-nem-high/10 px-1.5 py-0.5 text-[10px] font-bold text-nem-high">
                    {cat.highCount}
                  </span>
                )}
                <span className="font-heading text-sm font-bold text-nem-accent">{cat.itemCount}</span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
