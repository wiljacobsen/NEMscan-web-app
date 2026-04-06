export const IMPACT_LEVELS = ["HIGH", "MEDIUM", "LOW"] as const;
export type ImpactLevel = (typeof IMPACT_LEVELS)[number];

export const IMPACT_CONFIG = {
  HIGH: { label: "High", color: "#FF6B6B", bgClass: "bg-red-500/10", textClass: "text-red-400", borderClass: "border-red-500/30" },
  MEDIUM: { label: "Medium", color: "#F5A623", bgClass: "bg-amber-500/10", textClass: "text-amber-400", borderClass: "border-amber-500/30" },
  LOW: { label: "Low", color: "#4ECDC4", bgClass: "bg-teal-500/10", textClass: "text-teal-400", borderClass: "border-teal-500/30" },
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Search", href: "/search", icon: "Search" },
  {
    label: "Categories",
    icon: "FolderOpen",
    children: [
      { label: "Policy Direction & Rule Changes", href: "/categories/policy-direction-rule-changes" },
      { label: "AEMO, NSP & Licensing", href: "/categories/aemo-nsp-licensing" },
      { label: "Network Projects", href: "/categories/network-projects" },
    ],
  },
  { label: "Admin", href: "/admin", icon: "Shield" },
] as const;

export const ORG_ABBREVIATIONS: Record<string, string> = {
  "Australian Energy Market Commission": "AEMC",
  "Australian Energy Regulator": "AER",
  "Australian Energy Market Operator": "AEMO",
  "Transgrid": "Transgrid",
  "Powerlink": "Powerlink",
  "ElectraNet": "ElectraNet",
  "EnergyCo": "EnergyCo",
  "VicGrid": "VicGrid",
  "ESCOSA": "ESCOSA",
  "DCCEEW": "DCCEEW",
  "Government": "Gov",
};
