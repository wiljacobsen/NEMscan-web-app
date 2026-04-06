import Link from "next/link";
import { ExternalLink, CheckCircle, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImpactBadge } from "./impact-badge";
import { formatDate, truncate } from "@/lib/utils";
import type { RegulatoryItemWithRelations } from "@/types";

export function ItemCard({ item }: { item: RegulatoryItemWithRelations }) {
  const categoryName = item.category.parent?.name ?? item.category.name;

  return (
    <div className="group rounded-xl border border-nem-border bg-nem-card p-4 transition-all hover:border-nem-accent/30 hover:shadow-lg hover:shadow-nem-accent/5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <ImpactBadge level={item.impactLevel} />
            <Badge variant="outline" className="text-xs">
              {item.organisation.abbreviation}
            </Badge>
            <span className="text-xs text-muted-foreground">{categoryName}</span>
          </div>

          <Link href={`/items/${item.slug}`} className="group-hover:text-nem-accent transition-colors">
            <h3 className="font-heading text-sm font-semibold leading-tight">{item.title}</h3>
          </Link>

          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {truncate(item.description, 160)}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {item.tags.slice(0, 3).map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/search?tag=${tag.slug}`}
                className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
              >
                {tag.name}
              </Link>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{item.tags.length - 3}</span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-[10px] text-muted-foreground">{formatDate(item.createdAt)}</span>
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-nem-accent transition-colors"
              title="View source document"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <div className="flex items-center gap-1">
            {item.analystReviewed && (
              <span title="Analyst reviewed"><CheckCircle className="h-3 w-3 text-nem-accent" /></span>
            )}
            {item.aiGenerated && (
              <span title="AI generated"><Bot className="h-3 w-3 text-muted-foreground" /></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
