export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function timeAgo(dateString: string | null): string {
  if (!dateString) return "—";
  const date = new Date(dateString.endsWith("Z") ? dateString : `${dateString}Z`);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 0) return "just now";
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export function formatSalary(min: number | null, max: number | null, currency: string | null): string {
  const cur = currency || "USD";
  const symbol = cur === "USD" ? "$" : `${cur} `;
  if (min == null && max == null) return "Not disclosed";
  if (min != null && max != null) {
    if (min === max) return `${symbol}${min.toLocaleString()}`;
    return `${symbol}${min.toLocaleString()} – ${symbol}${max.toLocaleString()}`;
  }
  const single = min ?? max;
  return `${symbol}${single!.toLocaleString()}`;
}

export function formatJobType(jobType: string | null): string {
  if (!jobType) return "—";
  return jobType
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function sourceLabel(slug: string): string {
  const map: Record<string, string> = {
    upwork: "Upwork",
    fiverr: "Fiverr",
    khamsat: "Khamsat",
    mostaql: "Mostaql",
    remoteok: "RemoteOK",
    linkedin: "LinkedIn",
    wellfound: "Wellfound",
    indeed: "Indeed",
    reddit: "Reddit",
  };
  return map[slug] || slug;
}
