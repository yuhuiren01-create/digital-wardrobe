"use client";

import { useMemo, useState } from "react";

import { ClothingDetailDialog } from "@/components/clothing-detail-dialog";
import { FashionRecommendations } from "@/components/fashion-recommendations";
import { InspirationBoard } from "@/components/inspiration-board";
import { OutfitCreator, type OutfitSlots } from "@/components/outfit-creator";
import { WardrobeGrid } from "@/components/wardrobe-grid";
import {
  ALL,
  WardrobeSidebar,
  type CategoryFilter,
  type SeasonFilter,
} from "@/components/wardrobe-sidebar";
import { WeatherWidget } from "@/components/weather-widget";
import { FASHION_TRENDS_2026_SS } from "@/lib/fashionTrends";
import type { ClothingItem } from "@/lib/types";

type WardrobeWorkspaceProps = {
  items: ClothingItem[];
};

export function WardrobeWorkspace({ items }: WardrobeWorkspaceProps) {
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>(ALL);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(ALL);
  const [openedItem, setOpenedItem] = useState<ClothingItem | null>(null);
  const [outfit, setOutfit] = useState<OutfitSlots>([null, null]);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (seasonFilter === ALL || item.season === seasonFilter) &&
          (categoryFilter === ALL || item.category === categoryFilter),
      ),
    [items, seasonFilter, categoryFilter],
  );

  function handleDialogChange(open: boolean) {
    if (!open) setOpenedItem(null);
  }

  function placeInOutfit(item: ClothingItem, slot: 0 | 1) {
    setOutfit((prev) => (slot === 0 ? [item, prev[1]] : [prev[0], item]));
    setOpenedItem(null);
  }

  function clearSlot(slot: 0 | 1) {
    setOutfit((prev) => (slot === 0 ? [null, prev[1]] : [prev[0], null]));
  }

  function clearAll() {
    setOutfit([null, null]);
  }

  return (
    <div className="flex flex-col gap-6">
      <WeatherWidget />

      <OutfitCreator
        outfit={outfit}
        onClearSlot={clearSlot}
        onClearAll={clearAll}
      />

      <FashionRecommendations trends={FASHION_TRENDS_2026_SS} />

      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <WardrobeSidebar
          seasonFilter={seasonFilter}
          categoryFilter={categoryFilter}
          onSeasonChange={setSeasonFilter}
          onCategoryChange={setCategoryFilter}
        />
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-medium">我的衣物</h2>
            <p className="text-xs text-muted-foreground">
              共 {filtered.length} 件 / {items.length} 件
            </p>
          </div>
          <WardrobeGrid items={filtered} onItemClick={setOpenedItem} />
        </div>
      </div>

      <InspirationBoard />

      <ClothingDetailDialog
        item={openedItem}
        onOpenChange={handleDialogChange}
        onPlaceInOutfit={placeInOutfit}
      />
    </div>
  );
}
