export type ClothingCategory =
  | "上装"
  | "下装"
  | "连衣裙"
  | "套装"
  | "鞋"
  | "包包"
  | "饰品";

export type Season = "春" | "夏" | "秋" | "冬" | "四季";

export type ClothingItem = {
  id: string;
  imageUrl: string;
  category: ClothingCategory;
  color: string;
  material: string;
  season: Season;
  purchaseDate: string;
  brand: string;
  careInstructions: string;
};

export const CLOTHING_CATEGORIES = [
  "上装",
  "下装",
  "连衣裙",
  "套装",
  "鞋",
  "包包",
  "饰品",
] as const satisfies readonly ClothingCategory[];

export const SEASONS = [
  "春",
  "夏",
  "秋",
  "冬",
  "四季",
] as const satisfies readonly Season[];
