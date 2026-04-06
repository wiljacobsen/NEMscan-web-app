import Link from "next/link";

type TagItem = { tag: { id: string; name: string; slug: string } };

export function TagList({ tags }: { tags: TagItem[] }) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(({ tag }) => (
        <Link
          key={tag.id}
          href={`/search?tag=${tag.slug}`}
          className="rounded-full border border-nem-border bg-white/5 px-2.5 py-1 text-xs text-muted-foreground hover:border-nem-accent/30 hover:text-white transition-colors"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
