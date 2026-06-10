"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "wardrobe-id";

function getWardrobeIdFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getStoredWardrobeId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveWardrobeId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, id);
}

function setUrlWardrobeId(id: string) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("id", id);
  window.location.href = url.toString();
}

export function useWardrobeId(): {
  wardrobeId: string | null;
  isLoading: boolean;
} {
  const [wardrobeId, setWardrobeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlId = getWardrobeIdFromUrl();
    const storedId = getStoredWardrobeId();

    if (urlId) {
      saveWardrobeId(urlId);
      setWardrobeId(urlId);
      setIsLoading(false);
    } else if (storedId) {
      setUrlWardrobeId(storedId);
    } else {
      setIsLoading(false);
    }
  }, []);

  return { wardrobeId, isLoading };
}

export function WardrobeLogin() {
  const [inputId, setInputId] = useState("");

  function handleJoin() {
    const id = inputId.trim();
    if (!id) return;
    saveWardrobeId(id);
    setUrlWardrobeId(id);
  }

  function handleCreate() {
    const randomId = `wardrobe-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36).slice(-4)}`;
    saveWardrobeId(randomId);
    setUrlWardrobeId(randomId);
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">数字衣橱</h1>
        <p className="text-sm text-muted-foreground">
          输入衣橱名称进入，或创建一个新衣橱
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="wardrobe-id">衣橱名称</Label>
          <Input
            id="wardrobe-id"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="如：valeria-wardrobe"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
        </div>
        <Button onClick={handleJoin} disabled={!inputId.trim()}>
          进入衣橱
        </Button>
      </div>

      <div className="flex w-full items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">或</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" onClick={handleCreate} className="w-full">
        创建新衣橱
      </Button>
    </div>
  );
}
