"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CLOTHING_CATEGORIES,
  SEASONS,
  type ClothingCategory,
  type Season,
} from "@/lib/types";

export const ALL = "全部" as const;

export type SeasonFilter = typeof ALL | Season;
export type CategoryFilter = typeof ALL | ClothingCategory;

const SEASON_OPTIONS: SeasonFilter[] = [ALL, ...SEASONS];
const CATEGORY_OPTIONS: CategoryFilter[] = [ALL, ...CLOTHING_CATEGORIES];

type WardrobeSidebarProps = {
  seasonFilter: SeasonFilter;
  categoryFilter: CategoryFilter;
  onSeasonChange: (value: SeasonFilter) => void;
  onCategoryChange: (value: CategoryFilter) => void;
};

export function WardrobeSidebar({
  seasonFilter,
  categoryFilter,
  onSeasonChange,
  onCategoryChange,
}: WardrobeSidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      <FilterSection
        title="季节"
        options={SEASON_OPTIONS}
        value={seasonFilter}
        onChange={onSeasonChange}
      />
      <FilterSection
        title="类别"
        options={CATEGORY_OPTIONS}
        value={categoryFilter}
        onChange={onCategoryChange}
      />
    </aside>
  );
}

type FilterSectionProps<T extends string> = {
  title: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

function FilterSection<T extends string>({
  title,
  options,
  value,
  onChange,
}: FilterSectionProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = option === value;
          return (
            <Button
              key={option}
              variant={active ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onChange(option)}
              aria-pressed={active}
              className={cn(!active && "text-muted-foreground")}
            >
              {option}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
