import { Badge } from "@/components/ui/badge";

const variantMap = {
  HIGH: "high" as const,
  MEDIUM: "medium" as const,
  LOW: "low" as const,
};

export function ImpactBadge({ level }: { level: string }) {
  const variant = variantMap[level as keyof typeof variantMap] ?? "outline";
  return <Badge variant={variant}>{level}</Badge>;
}
