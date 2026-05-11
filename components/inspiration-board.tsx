"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  addInspiration,
  getInspirations,
  removeInspiration,
  type InspirationItem,
} from "@/lib/inspiration";

import { AddInspirationDialog } from "./add-inspiration-dialog";

export function InspirationBoard() {
  const [items, setItems] = useState<InspirationItem[]>(() =>
    typeof window !== "undefined" ? getInspirations() : [],
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleAdd(data: {
    imageUrl: string;
    title: string;
    source: string;
    tag: string;
  }) {
    const newItem = addInspiration(data);
    setItems((prev) => [newItem, ...prev]);
  }

  function handleDelete(id: string) {
    removeInspiration(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium">我的灵感收藏</h2>
          <span className="text-xs text-muted-foreground">
            共 {items.length} 张
          </span>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          添加灵感
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center">
          <Heart className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            还没有收藏任何穿搭灵感
          </p>
          <p className="text-xs text-muted-foreground">
            点击右上角「添加灵感」，粘贴你喜欢的穿搭图片链接
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <InspirationCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddInspirationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAdd}
      />
    </section>
  );
}

function InspirationCard({
  item,
  onDelete,
}: {
  item: InspirationItem;
  onDelete: (id: string) => void;
}) {
  const [error, setError] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-muted/20 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
            <span className="text-2xl">🖼️</span>
            <span className="text-xs text-muted-foreground">图片加载失败</span>
          </div>
        ) : (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            onError={() => setError(true)}
          />
        )}

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:text-red-500"
          aria-label="删除"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        {/* Tag badge */}
        <span className="absolute bottom-2 left-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
          {item.tag}
        </span>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <h3 className="text-sm font-semibold leading-tight line-clamp-1">
          {item.title}
        </h3>
        <span className="text-[10px] text-muted-foreground">{item.source}</span>
      </div>
    </div>
  );
}
