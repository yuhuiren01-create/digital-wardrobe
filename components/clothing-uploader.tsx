"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Plus, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { removeImageBackground } from "@/lib/imageProcessor";
import { CLOTHING_CATEGORIES, SEASONS } from "@/lib/types";
import type { ClothingItem } from "@/lib/types";

type Status =
  | { kind: "idle" }
  | { kind: "processing"; progress: number; originalUrl: string }
  | { kind: "done"; originalUrl: string; resultUrl: string; resultBlob: Blob }
  | { kind: "error"; message: string };

type ClothingUploaderProps = {
  onAdd: (item: Omit<ClothingItem, "id">) => void;
  onSuccess?: () => void;
};

export function ClothingUploader({ onAdd, onSuccess }: ClothingUploaderProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [category, setCategory] = useState<string>("");
  const [color, setColor] = useState("");
  const [season, setSeason] = useState<string>("");
  const [material, setMaterial] = useState("棉质");
  const [brand, setBrand] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);

  function trackObjectURL(blob: Blob | File): string {
    const url = URL.createObjectURL(blob);
    objectUrlsRef.current.add(url);
    return url;
  }

  function revokeAllObjectURLs() {
    for (const url of objectUrlsRef.current) URL.revokeObjectURL(url);
    objectUrlsRef.current.clear();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    revokeAllObjectURLs();
    const originalUrl = trackObjectURL(file);
    setStatus({ kind: "processing", progress: 0, originalUrl });

    try {
      const result = await removeImageBackground(file, {
        onProgress: (_key, current, total) => {
          if (total <= 0) return;
          setStatus((prev) =>
            prev.kind === "processing"
              ? { ...prev, progress: Math.min(1, current / total) }
              : prev,
          );
        },
      });
      const resultUrl = trackObjectURL(result);
      setStatus({ kind: "done", originalUrl, resultUrl, resultBlob: result });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "处理失败，请重试。";
      setStatus({ kind: "error", message });
    }
  }

  function reset() {
    revokeAllObjectURLs();
    if (fileInputRef.current) fileInputRef.current.value = "";
    setStatus({ kind: "idle" });
    setCategory("");
    setColor("");
    setSeason("");
    setMaterial("棉质");
    setBrand("");
  }

  async function handleAdd() {
    if (status.kind !== "done") return;
    if (!category || !color || !season) return;

    try {
      const base64 = await blobToBase64(status.resultBlob);
      onAdd({
        imageUrl: base64,
        category: category as ClothingItem["category"],
        color,
        season: season as ClothingItem["season"],
        material: material || "未知",
        brand: brand || "未知",
        purchaseDate: new Date().toISOString().slice(0, 10),
        careInstructions: "常规清洗",
      });
      reset();
      onSuccess?.();
    } catch {
      setStatus({ kind: "error", message: "图片转换失败，请重试。" });
    }
  }

  const canAdd =
    status.kind === "done" && category && color && season;

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {status.kind === "idle" && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-12 transition-colors hover:bg-muted/50"
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-medium">点击选择衣物图片</p>
          <p className="text-xs text-muted-foreground">支持 JPG / PNG / WEBP</p>
        </button>
      )}

      {status.kind === "processing" && (
        <div className="flex flex-col items-center gap-3 py-6">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">正在处理...</p>
          <p className="text-xs text-muted-foreground">
            {status.progress > 0
              ? `${Math.round(status.progress * 100)}%`
              : "首次使用需下载抠图模型，请稍候"}
          </p>
          <PreviewImage src={status.originalUrl} alt="原图" muted />
        </div>
      )}

      {status.kind === "done" && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <PreviewBlock label="原图">
              <PreviewImage src={status.originalUrl} alt="原图" compact />
            </PreviewBlock>
            <PreviewBlock label="抠图后">
              <PreviewImage
                src={status.resultUrl}
                alt="抠图结果"
                checkerboard
                compact
              />
            </PreviewBlock>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">分类 *</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">选择分类</option>
                {CLOTHING_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="color">颜色 *</Label>
              <Input
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="如：白色、藏蓝"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="season">季节 *</Label>
              <select
                id="season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">选择季节</option>
                {SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="material">材质</Label>
              <Input
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="如：棉、羊毛"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="brand">品牌</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="如：UNIQLO"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {!canAdd && (
              <p className="text-center text-xs text-amber-600">
                请先填写上方带 * 的必填项
              </p>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleAdd}
                disabled={!canAdd}
                className="flex-1"
              >
                <Plus className="mr-1 h-4 w-4" />
                添加到衣橱
              </Button>
              <Button variant="outline" onClick={reset}>
                <X className="h-4 w-4" />
                重新选择
              </Button>
            </div>
          </div>
        </div>
      )}

      {status.kind === "error" && (
        <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">处理失败</p>
          <p className="text-xs text-muted-foreground">{status.message}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="self-start"
          >
            重试
          </Button>
        </div>
      )}
    </div>
  );
}

function PreviewBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

const checkerboardStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, #e5e5e5 25%, transparent 25%)," +
    "linear-gradient(-45deg, #e5e5e5 25%, transparent 25%)," +
    "linear-gradient(45deg, transparent 75%, #e5e5e5 75%)," +
    "linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
};

function PreviewImage({
  src,
  alt,
  checkerboard = false,
  muted = false,
  compact = false,
}: {
  src: string;
  alt: string;
  checkerboard?: boolean;
  muted?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md ring-1 ring-border",
        compact ? "aspect-[4/3]" : "aspect-square",
        muted && "opacity-60",
      )}
      style={checkerboard ? checkerboardStyle : undefined}
    >
      {/* Local blob: URL preview — Next.js Image optimization not applicable. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
