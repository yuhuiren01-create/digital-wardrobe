export type InspirationItem = {
  id: string;
  imageUrl: string;
  title: string;
  source: string;
  tag: string;
  createdAt: string;
};

const STORAGE_KEY = "digital-wardrobe-inspirations";

export function getInspirations(): InspirationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InspirationItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInspirations(items: InspirationItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addInspiration(item: Omit<InspirationItem, "id" | "createdAt">): InspirationItem {
  const newItem: InspirationItem = {
    ...item,
    id: `insp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const existing = getInspirations();
  saveInspirations([newItem, ...existing]);
  return newItem;
}

export function removeInspiration(id: string): void {
  const existing = getInspirations();
  saveInspirations(existing.filter((item) => item.id !== id));
}

export const INSPIRATION_TAGS = ["街拍", "秀场", "杂志", "博主", "电影", "其他"] as const;
