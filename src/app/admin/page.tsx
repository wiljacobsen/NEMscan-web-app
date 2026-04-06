import { getAdminStats } from "@/actions/admin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateRange } from "@/lib/utils";
import { FileText, AlertCircle, Database, Radio } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { totalItems, unreviewedCount, periods, sources } = await getAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage scan periods, items, and scraping sources</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-nem-border bg-nem-card p-5">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-nem-accent opacity-50" />
            <div>
              <p className="text-xs text-muted-foreground">Total Items</p>
              <p className="font-heading text-2xl font-bold text-nem-accent">{totalItems}</p>
            </div>
          </div>
        </Card>
        <Card className="border-nem-border bg-nem-card p-5">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-nem-medium opacity-50" />
            <div>
              <p className="text-xs text-muted-foreground">Pending Review</p>
              <p className="font-heading text-2xl font-bold text-nem-medium">{unreviewedCount}</p>
            </div>
          </div>
        </Card>
        <Card className="border-nem-border bg-nem-card p-5">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-blue-400 opacity-50" />
            <div>
              <p className="text-xs text-muted-foreground">Scan Periods</p>
              <p className="font-heading text-2xl font-bold text-blue-400">{periods.length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-nem-border bg-nem-card p-5">
          <div className="flex items-center gap-3">
            <Radio className="h-6 w-6 text-green-400 opacity-50" />
            <div>
              <p className="text-xs text-muted-foreground">Active Sources</p>
              <p className="font-heading text-2xl font-bold text-green-400">
                {sources.filter((s) => s.isActive).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Scan Periods */}
      <Card className="border-nem-border bg-nem-card">
        <CardHeader>
          <CardTitle className="text-base">Scan Periods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {periods.map((period) => (
              <div
                key={period.id}
                className="flex items-center justify-between rounded-lg border border-nem-border bg-nem-bg p-3"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={period.status === "PUBLISHED" ? "default" : "secondary"}>
                    {period.status}
                  </Badge>
                  <span className="text-sm">{formatDateRange(period.startDate, period.endDate)}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{period._count.items} items</span>
                  {period.publishedAt && <span>Published {formatDate(period.publishedAt)}</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scraping Sources */}
      <Card className="border-nem-border bg-nem-card">
        <CardHeader>
          <CardTitle className="text-base">Scraping Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between rounded-lg border border-nem-border bg-nem-bg p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${source.isActive ? "bg-green-400" : "bg-gray-500"}`}
                  />
                  <div>
                    <span className="text-sm font-medium">{source.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {source.organisation.abbreviation}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">
                    {source.scrapeFrequency}
                  </Badge>
                  {source.lastScrapedAt && (
                    <span>Last: {formatDate(source.lastScrapedAt)}</span>
                  )}
                  {!source.lastScrapedAt && <span className="text-nem-medium">Never scraped</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
