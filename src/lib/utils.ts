import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(start: Date | string, end: Date | string): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getImpactColor(level: string): string {
  switch (level) {
    case "HIGH":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    case "MEDIUM":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "LOW":
      return "text-teal-400 bg-teal-500/10 border-teal-500/20";
    default:
      return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
}

export function getImpactDotColor(level: string): string {
  switch (level) {
    case "HIGH":
      return "bg-[#FF6B6B]";
    case "MEDIUM":
      return "bg-[#F5A623]";
    case "LOW":
      return "bg-[#4ECDC4]";
    default:
      return "bg-gray-400";
  }
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "...";
}

export function daysUntil(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
