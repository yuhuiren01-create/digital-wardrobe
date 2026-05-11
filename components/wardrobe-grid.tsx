"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ClothingItem } from "@/lib/types";

type WardrobeGridProps = {
  items: ClothingItem[];
  onItemClick?: (item: ClothingItem) => void;
};

export function WardrobeGrid({ items, onItemClick }: WardrobeGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            衣橱是空的
          </p>
          <p className="text-xs text-muted-foreground">
            点击上方「上传衣物」按钮，添加你的第一件衣物
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ClothingCard
          key={item.id}
          item={item}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
        />
      ))}
    </div>
  );
}

type ClothingCardProps = {
  item: ClothingItem;
  onClick?: () => void;
};

export function ClothingCard({ item, onClick }: ClothingCardProps) {
  const interactive = Boolean(onClick);
  return (
    <Card
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={cn(
        interactive &&
          "cursor-pointer transition-all hover:ring-foreground/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
      )}
    >
      <Image
        src={item.imageUrl}
        alt={`${item.brand} ${item.category}`}
        width={600}
        height={750}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="aspect-[4/5] w-full object-cover"
      />
      <CardHeader>
        <CardTitle>
          {item.brand} · {item.category}
        </CardTitle>
        <CardDescription>
          {item.color} · {item.material}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 text-xs text-muted-foreground">
        <div>季节：{item.season}</div>
        <div>购入：{item.purchaseDate}</div>
      </CardContent>
    </Card>
  );
}
