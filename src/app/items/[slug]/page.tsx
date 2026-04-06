import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ArrowLeft, CheckCircle, Bot, AlertTriangle } from "lucide-react";
import { getItemBySlug, getRelatedItems } from "@/actions/items";
import { ImpactBadge } from "@/components/items/impact-badge";
import { TagList } from "@/components/items/tag-list";
import { ConsultationTimeline } from "@/components/items/consultation-timeline";
import { ItemCard } from "@/components/items/item-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { RegulatoryItemWithRelations } from "@/types";

export default async function ItemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);

  if (!item) notFound();

  const relatedItems = await getRelatedItems(item.id, item.categoryId, item.organisationId);
  const categoryName = item.category.parent?.name ?? item.category.name;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-white transition-colors">
          <ArrowLeft className="inline h-3 w-3" /> Dashboard
        </Link>
        <span>/</span>
        <Link href={`/categories/${item.category.parent?.slug ?? item.category.slug}`} className="hover:text-white transition-colors">
          {categoryName}
        </Link>
        <span>/</span>
        <span className="text-foreground">{item.title}</span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <ImpactBadge level={item.impactLevel} />
          <Badge variant="outline">{item.organisation.abbreviation}</Badge>
          <span className="text-xs text-muted-foreground">{categoryName}</span>
          <span className="text-xs text-muted-foreground">&middot;</span>
          <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
        </div>
        <h1 className="font-heading text-2xl font-bold">{item.title}</h1>

        {/* Source URL - prominent */}
        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View Source Document
            </Button>
          </a>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-6">
          {/* Description */}
          <Card className="border-nem-border bg-nem-card p-5">
            <h3 className="mb-3 font-heading text-sm font-semibold text-muted-foreground">Description</h3>
            <p className="text-sm leading-relaxed">{item.description}</p>
          </Card>

          {/* Detailed Analysis */}
          {item.detailHtml && (
            <Card className="border-nem-border bg-nem-card p-5">
              <h3 className="mb-3 font-heading text-sm font-semibold text-muted-foreground">Detailed Analysis</h3>
              <div
                className="prose prose-sm prose-invert max-w-none [&_h3]:text-sm [&_h3]:font-heading [&_h3]:font-semibold [&_ul]:space-y-1 [&_li]:text-sm [&_li]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.detailHtml }}
              />
            </Card>
          )}

          {/* Recommended Actions */}
          {item.recommendedActions && (
            <Card className="border-l-4 border-l-nem-accent border-nem-border bg-nem-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-nem-accent" />
                <h3 className="font-heading text-sm font-semibold text-nem-accent">Recommended Actions</h3>
              </div>
              <p className="text-sm leading-relaxed">{item.recommendedActions}</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Consultation Timeline */}
          {item.timeline.length > 0 && (
            <Card className="border-nem-border bg-nem-card p-4">
              <ConsultationTimeline entries={item.timeline} />
            </Card>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <Card className="border-nem-border bg-nem-card p-4">
              <h4 className="mb-3 font-heading text-sm font-semibold text-muted-foreground">Tags</h4>
              <TagList tags={item.tags} />
            </Card>
          )}

          {/* Verification Status */}
          <Card className="border-nem-border bg-nem-card p-4 space-y-2">
            <h4 className="font-heading text-sm font-semibold text-muted-foreground">Verification</h4>
            <div className="flex items-center gap-2 text-sm">
              {item.analystReviewed ? (
                <>
                  <CheckCircle className="h-4 w-4 text-nem-accent" />
                  <span className="text-nem-accent">Analyst Reviewed</span>
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">AI Generated — Pending Review</span>
                </>
              )}
            </div>
            {item.aiGenerated && item.aiConfidenceScore != null && (
              <div className="text-xs text-muted-foreground">
                AI Confidence: {Math.round(item.aiConfidenceScore * 100)}%
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <div>
          <h3 className="mb-3 font-heading text-sm font-semibold text-muted-foreground">Related Items</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {(relatedItems as RegulatoryItemWithRelations[]).map((related) => (
              <ItemCard key={related.id} item={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
