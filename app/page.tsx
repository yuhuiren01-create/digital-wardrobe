"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, LoaderCircle, Plus, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClothingUploader } from "@/components/clothing-uploader";
import { WardrobeWorkspace } from "@/components/wardrobe-workspace";
import { useWardrobeId, WardrobeLogin } from "@/components/wardrobe-login";
import {
  addWardrobeItem,
  getWardrobeItems,
  removeWardrobeItem,
} from "@/lib/wardrobe";
import type { ClothingItem } from "@/lib/types";

export default function Home() {
  const { wardrobeId, isLoading } = useWardrobeId();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadItems = useCallback(async () => {
    if (!wardrobeId) return;
    setIsSyncing(true);
    try {
      const data = await getWardrobeItems(wardrobeId);
      setItems(data);
    } catch (err) {
      console.error("加载失败:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [wardrobeId]);

  useEffect(() => {
    if (wardrobeId) {
      loadItems();
    }
  }, [wardrobeId, loadItems]);

  async function handleAddItem(item: Omit<ClothingItem, "id">) {
    if (!wardrobeId) return;
    try {
      const newItem = await addWardrobeItem(wardrobeId, item);
      setItems((prev) => [newItem, ...prev]);
      setDialogOpen(false);
    } catch (err) {
      console.error("添加失败:", err);
      alert(err instanceof Error ? err.message : "添加失败，请重试");
    }
  }

  async function handleDeleteItem(item: ClothingItem) {
    if (!confirm(`确定要删除 "${item.brand} ${item.category}" 吗？`)) return;
    try {
      await removeWardrobeItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error("删除失败:", err);
      alert("删除失败，请重试");
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("已复制衣橱链接！");
  }

  function createNewWardrobe() {
    const randomId = `wardrobe-${Math.random().toString(36).slice(2, 10)}`;
    const url = new URL(window.location.href);
    url.searchParams.set("id", randomId);
    navigator.clipboard.writeText(url.toString());
    alert("已复制新衣橱链接！发送给朋友即可。");
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!wardrobeId) {
    return (
      <main className="min-h-screen">
        <WardrobeLogin />
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-16">
      <header className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            数字衣橱
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            衣橱 ID：
            <span className="font-mono text-xs">{wardrobeId}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="mr-1 h-4 w-4" />
            复制链接
          </Button>
          <Button variant="outline" size="sm" onClick={createNewWardrobe}>
            <Share2 className="mr-1 h-4 w-4" />
            生成新衣橱
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                上传衣物
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>上传衣物</DialogTitle>
                <DialogDescription>
                  选择一张衣物照片，自动去除背景后用于衣橱展示。
                </DialogDescription>
              </DialogHeader>
              <ClothingUploader
                onAdd={handleAddItem}
                onSuccess={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {isSyncing && items.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <WardrobeWorkspace
          items={items}
          onDeleteItem={handleDeleteItem}
        />
      )}
    </main>
  );
}
