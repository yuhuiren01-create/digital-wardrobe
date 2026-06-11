"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ExternalLink, Heart, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  addInspiration,
  getInspirations,
  removeInspiration,
  type InspirationItem,
} from "@/lib/inspiration";

import { AddInspirationDialog } from "./add-inspiration-dialog";

type InspirationBoardProps = {
  wardrobeId: string;
};

export function InspirationBoard({ wardrobeId }: InspirationBoardProps) {
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!wardrobeId) return;
    setLoading(true);
    getInspirations(wardrobeId)
      .then((data) => setItems(data))
      .catch((err) => console.error("加载灵感失败:", err))
      .finally(() => setLoading(false));
  }, [wardrobeId]);

  async function handleAdd(data: {
    imageUrl: string;
    title: string;
    source: string;
    tag: string;
    url?: string;
  }) {
    try {
      const newItem = await addInspiration(wardrobeId, data);
      setItems((prev) => [newItem, ...prev]);
      setDialogOpen(false);
    } catch (err) {
      console.error("添加灵感失败:", err);
      alert(err instanceof Error ? err.message : "添加失败");
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeInspiration(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("删除灵感失败:", err);
      alert("删除失败");
    }
  }

  return (
    <section className="flex flex-col gap-2 rounded-xl border border-border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-3.5 w-3.5 text-muted-foreground" />
          <h2 className="text-sm font-medium">我的灵感收藏</h2>
          <span className="text-xs text-muted-foreground">
            共 {items.length} 条
          </span>
        </div>
        <Button size="sm" className="h-7 text-xs" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-1 h-3 w-3" />
          添加灵感
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
          加载中...
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 py-6 text-center">
          <Heart className="h-6 w-6 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            还没有收藏任何穿搭灵感
          </p>
          <p className="text-xs text-muted-foreground">
            点击右上角「添加灵感」，粘贴小红书等平台的穿搭链接
          </p>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
  const hasLink = Boolean(item.url);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-muted/20 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
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
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
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

      <div className="flex flex-col gap-0.5 p-2">
        <h3 className="text-xs font-semibold leading-tight line-clamp-1">
          {item.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground">{item.source}</span>
          {hasLink && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-[9px] text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-2.5 w-2.5" />
              查看原帖
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
