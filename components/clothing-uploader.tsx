"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { removeImageBackground } from "@/lib/imageProcessor";

type Status =
  | { kind: "idle" }
  | { kind: "processing"; progress: number; originalUrl: string }
  | { kind: "done"; originalUrl: string; resultUrl: string }
  | { kind: "error"; message: string };

export function ClothingUploader() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
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
      setStatus({ kind: "done", originalUrl, resultUrl });
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
  }

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
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <PreviewBlock label="原图">
              <PreviewImage src={status.originalUrl} alt="原图" />
            </PreviewBlock>
            <PreviewBlock label="抠图后">
              <PreviewImage
                src={status.resultUrl}
                alt="抠图结果"
                checkerboard
              />
            </PreviewBlock>
          </div>
          <Button variant="outline" onClick={reset} className="self-start">
            <X className="h-4 w-4" />
            重新选择
          </Button>
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
}: {
  src: string;
  alt: string;
  checkerboard?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-md ring-1 ring-border",
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
