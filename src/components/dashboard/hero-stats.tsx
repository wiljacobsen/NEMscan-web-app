import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/types";
import { FileText, AlertTriangle, Building2, Clock } from "lucide-react";

const stats = [
  { key: "totalItems" as const, label: "Total Items", icon: FileText, color: "text-nem-accent" },
  { key: "highImpact" as const, label: "High Impact", icon: AlertTriangle, color: "text-nem-high" },
  { key: "activeOrgs" as const, label: "Active Organisations", icon: Building2, color: "text-blue-400" },
  { key: "openConsultations" as const, label: "Open Consultations", icon: Clock, color: "text-nem-medium" },
];

export function HeroStats({ data }: { data: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ key, label, icon: Icon, color }) => (
        <Card key={key} className="border-nem-border bg-nem-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`mt-1 font-heading text-3xl font-bold ${color}`}>{data[key]}</p>
            </div>
            <Icon className={`h-8 w-8 ${color} opacity-20`} />
          </div>
          {key === "highImpact" && (
            <div className="mt-2 flex gap-3 text-[10px]">
              <span className="text-nem-medium">{data.mediumImpact} medium</span>
              <span className="text-nem-low">{data.lowImpact} low</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
