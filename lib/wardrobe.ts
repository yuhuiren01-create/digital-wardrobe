import type { ClothingItem } from "./types";
import { supabase } from "./supabase";

function base64ToBlob(base64: string): Blob {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export async function getWardrobeItems(wardrobeId: string): Promise<ClothingItem[]> {
  const { data, error } = await supabase
    .from("wardrobe_items")
    .select("*")
    .eq("wardrobe_id", wardrobeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wardrobe items:", error);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    imageUrl: item.image_url,
    category: item.category,
    color: item.color,
    material: item.material,
    season: item.season,
    purchaseDate: item.purchase_date,
    brand: item.brand,
    careInstructions: item.care_instructions,
  }));
}

async function uploadImage(wardrobeId: string, base64Image: string): Promise<string> {
  const blob = base64ToBlob(base64Image);
  const filename = `${wardrobeId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;

  const { error: uploadError } = await supabase.storage
    .from("wardrobe-images")
    .upload(filename, blob, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`上传图片失败: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("wardrobe-images").getPublicUrl(filename);

  return publicUrl;
}

export async function addWardrobeItem(
  wardrobeId: string,
  item: Omit<ClothingItem, "id">,
): Promise<ClothingItem> {
  const imageUrl = item.imageUrl.startsWith("data:")
    ? await uploadImage(wardrobeId, item.imageUrl)
    : item.imageUrl;

  const { data, error } = await supabase
    .from("wardrobe_items")
    .insert({
      wardrobe_id: wardrobeId,
      image_url: imageUrl,
      category: item.category,
      color: item.color,
      material: item.material,
      season: item.season,
      purchase_date: item.purchaseDate,
      brand: item.brand,
      care_instructions: item.careInstructions,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`添加失败: ${error?.message || "未知错误"}`);
  }

  return {
    id: data.id,
    imageUrl: data.image_url,
    category: data.category,
    color: data.color,
    material: data.material,
    season: data.season,
    purchaseDate: data.purchase_date,
    brand: data.brand,
    careInstructions: data.care_instructions,
  };
}

export async function removeWardrobeItem(id: string): Promise<void> {
  const { error } = await supabase.from("wardrobe_items").delete().eq("id", id);

  if (error) {
    throw new Error(`删除失败: ${error.message}`);
  }
}
