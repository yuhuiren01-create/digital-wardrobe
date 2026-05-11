"use client";

import Image from "next/image";
import { Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ClothingItem } from "@/lib/types";

export type OutfitSlots = [ClothingItem | null, ClothingItem | null];

type OutfitCreatorProps = {
  outfit: OutfitSlots;
  onClearSlot: (slot: 0 | 1) => void;
  onClearAll: () => void;
};

export function OutfitCreator({
  outfit,
  onClearSlot,
  onClearAll,
}: OutfitCreatorProps) {
  const hasAny = outfit.some(Boolean);

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium">每日穿搭组合</h2>
        </div>
        {hasAny ? (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            清空
          </Button>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        点击下方衣物卡片，在弹出的详情中选择「放入左侧」或「放入右侧」。
      </p>

      <div className="grid grid-cols-2 gap-3">
        <OutfitSlot
          label="左"
          item={outfit[0]}
          onClear={() => onClearSlot(0)}
        />
        <OutfitSlot
          label="右"
          item={outfit[1]}
          onClear={() => onClearSlot(1)}
        />
      </div>
    </section>
  );
}

function OutfitSlot({
  label,
  item,
  onClear,
}: {
  label: string;
  item: ClothingItem | null;
  onClear: () => void;
}) {
  if (!item) {
    return (
      <div className="flex aspect-[4/5] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/30 text-center">
        <span className="text-xs text-muted-foreground">{label}侧空位</span>
        <span className="text-[11px] text-muted-foreground">未选择衣物</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg ring-1 ring-border">
      <Image
        src={item.imageUrl}
        alt={`${item.brand} ${item.category}`}
        width={400}
        height={500}
        sizes="(max-width: 768px) 50vw, 320px"
        className="aspect-[4/5] w-full object-cover"
      />
      <button
        type="button"
        onClick={onClear}
        aria-label="移除"
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 ring-1 ring-border backdrop-blur-sm hover:bg-background"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="text-xs font-medium text-white">{item.brand}</p>
        <p className="text-[11px] text-white/80">
          {item.category} · {item.color}
        </p>
      </div>
    </div>
  );
}
