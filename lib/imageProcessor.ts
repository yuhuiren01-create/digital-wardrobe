export type ImageProcessorOptions = {
  onProgress?: (key: string, current: number, total: number) => void;
};

export async function removeImageBackground(
  source: File | Blob,
  options: ImageProcessorOptions = {},
): Promise<Blob> {
  if (typeof window === "undefined") {
    throw new Error(
      "removeImageBackground 只能在浏览器中调用（依赖 onnxruntime-web）。",
    );
  }

  const { removeBackground } = await import("@imgly/background-removal");

  return removeBackground(source, {
    output: { format: "image/png", quality: 1 },
    progress: options.onProgress,
  });
}
