import { supabase } from "./supabase";

export type InspirationItem = {
  id: string;
  imageUrl: string;
  title: string;
  source: string;
  tag: string;
  url?: string;
  createdAt: string;
};

export async function getInspirations(wardrobeId: string): Promise<InspirationItem[]> {
  const { data, error } = await supabase
    .from("inspiration_items")
    .select("*")
    .eq("wardrobe_id", wardrobeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inspirations:", error);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    imageUrl: item.image_url,
    title: item.title,
    source: item.source,
    tag: item.tag,
    url: item.url,
    createdAt: item.created_at,
  }));
}

export async function addInspiration(
  wardrobeId: string,
  item: Omit<InspirationItem, "id" | "createdAt">,
): Promise<InspirationItem> {
  const { data, error } = await supabase
    .from("inspiration_items")
    .insert({
      wardrobe_id: wardrobeId,
      image_url: item.imageUrl,
      title: item.title,
      source: item.source,
      tag: item.tag,
      url: item.url,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`添加失败: ${error?.message || "未知错误"}`);
  }

  return {
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    source: data.source,
    tag: data.tag,
    url: data.url,
    createdAt: data.created_at,
  };
}

export async function removeInspiration(id: string): Promise<void> {
  const { error } = await supabase
    .from("inspiration_items")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`删除失败: ${error.message}`);
  }
}

export const INSPIRATION_TAGS = ["街拍", "秀场", "杂志", "博主", "电影", "小红书", "其他"] as const;
