"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INSPIRATION_TAGS } from "@/lib/inspiration";

type AddInspirationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: {
    imageUrl: string;
    title: string;
    source: string;
    tag: string;
  }) => void;
};

export function AddInspirationDialog({
  open,
  onOpenChange,
  onAdd,
}: AddInspirationDialogProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [tag, setTag] = useState("街拍");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!imageUrl.trim()) {
      setError("请输入图片链接");
      return;
    }

    try {
      new URL(imageUrl);
    } catch {
      setError("请输入有效的 URL");
      return;
    }

    onAdd({
      imageUrl: imageUrl.trim(),
      title: title.trim() || "未命名灵感",
      source: source.trim() || "未知来源",
      tag,
    });

    setImageUrl("");
    setTitle("");
    setSource("");
    setTag("街拍");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>添加穿搭灵感</DialogTitle>
          <DialogDescription>
            粘贴你在小红书、Instagram、Pinterest 等平台看到的穿搭图链接。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="imageUrl">图片链接 *</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/outfit.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              placeholder="例如：米色风衣叠穿"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="source">来源</Label>
              <Input
                id="source"
                placeholder="例如：小红书 / Vogue"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tag">标签</Label>
              <select
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {INSPIRATION_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : null}

          <DialogFooter>
            <Button type="submit">添加</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
