import type { ClothingItem } from "./types";

const STORAGE_KEY = "digital-wardrobe-items";

export function getWardrobeItems(): ClothingItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ClothingItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWardrobeItems(items: ClothingItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addWardrobeItem(item: Omit<ClothingItem, "id">): ClothingItem {
  const newItem: ClothingItem = {
    ...item,
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
  const existing = getWardrobeItems();
  saveWardrobeItems([newItem, ...existing]);
  return newItem;
}

export function removeWardrobeItem(id: string): void {
  const existing = getWardrobeItems();
  saveWardrobeItems(existing.filter((item) => item.id !== id));
}
