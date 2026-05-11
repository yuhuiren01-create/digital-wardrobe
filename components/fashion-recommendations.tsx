import { Sparkles } from "lucide-react";

import { type FashionTrend } from "@/lib/fashionTrends";

type FashionRecommendationsProps = {
  trends: readonly FashionTrend[];
};

export function FashionRecommendations({
  trends,
}: FashionRecommendationsProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium">时尚灵感</h2>
        <span className="text-xs text-muted-foreground">2026 春夏趋势精选</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {trends.map((trend) => (
          <TrendCard key={trend.id} trend={trend} />
        ))}
      </div>
    </section>
  );
}

const TREND_VISUALS: Record<
  string,
  { gradient: string; swatches: string[]; emoji: string }
> = {
  "ft-001": {
    gradient: "from-stone-100 via-stone-50 to-white",
    swatches: ["#F5F5F4", "#FAFAF9", "#FFFFFF", "#E7E5E4"],
    emoji: "🤍",
  },
  "ft-002": {
    gradient: "from-teal-200 via-cyan-100 to-sky-100",
    swatches: ["#2DD4BF", "#06B6D4", "#0EA5E9", "#67E8F9"],
    emoji: "🌊",
  },
  "ft-003": {
    gradient: "from-stone-200 via-neutral-100 to-stone-50",
    swatches: ["#A8A29E", "#D6D3D1", "#F5F5F4", "#78716C"],
    emoji: "👗",
  },
  "ft-004": {
    gradient: "from-rose-200 via-pink-100 to-rose-50",
    swatches: ["#FB7185", "#F472B6", "#FDA4AF", "#FFF1F2"],
    emoji: "👚",
  },
  "ft-005": {
    gradient: "from-green-200 via-emerald-100 to-teal-50",
    swatches: ["#6EE7B7", "#34D399", "#A7F3D0", "#ECFDF5"],
    emoji: "🌿",
  },
  "ft-006": {
    gradient: "from-orange-200 via-amber-100 to-yellow-50",
    swatches: ["#F59E0B", "#FCD34D", "#FDE68A", "#78350F"],
    emoji: "🧣",
  },
  "ft-007": {
    gradient: "from-red-300 via-orange-200 to-rose-100",
    swatches: ["#EF4444", "#F97316", "#FB923C", "#FFF7ED"],
    emoji: "🍅",
  },
  "ft-008": {
    gradient: "from-amber-100 via-yellow-50 to-stone-100",
    swatches: ["#D4D4D8", "#F5F5F4", "#E7E5E4", "#FAFAF9"],
    emoji: "🧶",
  },
};

function TrendCard({ trend }: { trend: FashionTrend }) {
  const categoryColor: Record<FashionTrend["category"], string> = {
    色彩: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
    单品: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    风格: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    面料: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    配饰: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  };

  const visual = TREND_VISUALS[trend.id] ?? {
    gradient: "from-muted to-muted/50",
    swatches: ["#D4D4D8", "#A1A1AA", "#71717A", "#52525B"],
    emoji: "✨",
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-muted/20 transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Visual mood board area */}
      <div
        className={`relative flex aspect-[4/3] flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br ${visual.gradient} p-4`}
      >
        <span className="text-4xl drop-shadow-sm transition-transform group-hover:scale-110">
          {visual.emoji}
        </span>

        {/* Color swatches */}
        <div className="flex gap-2">
          {visual.swatches.map((color, i) => (
            <div
              key={i}
              className="h-6 w-6 rounded-full border-2 border-white/80 shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Subtle pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-foreground to-transparent" />
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColor[trend.category]}`}
          >
            {trend.category}
          </span>
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {trend.season}
          </span>
        </div>
        <h3 className="text-sm font-semibold leading-tight">{trend.title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {trend.description}
        </p>
        <p className="text-xs leading-relaxed text-emerald-600 dark:text-emerald-400">
          💡 {trend.tip}
        </p>
        <span className="mt-auto pt-1 text-[10px] text-muted-foreground/70">
          {trend.source}
        </span>
      </div>
    </div>
  );
}
