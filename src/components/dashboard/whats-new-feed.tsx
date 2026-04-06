import { ItemCard } from "@/components/items/item-card";
import type { RegulatoryItemWithRelations } from "@/types";

export function WhatsNewFeed({ items }: { items: RegulatoryItemWithRelations[] }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-nem-border bg-nem-card p-8 text-center">
        <p className="text-sm text-muted-foreground">No items match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
