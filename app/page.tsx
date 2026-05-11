import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClothingUploader } from "@/components/clothing-uploader";
import { WardrobeWorkspace } from "@/components/wardrobe-workspace";
import { mockClothingItems } from "@/lib/mockData";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-16">
      <header className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            欢迎来到数字衣橱
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            管理你的每一件衣物，让搭配更轻松。
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">上传衣物</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>上传衣物</DialogTitle>
              <DialogDescription>
                选择一张衣物照片，自动去除背景后用于衣橱展示。模型在浏览器本地运行，图片不会上传到任何服务器。
              </DialogDescription>
            </DialogHeader>
            <ClothingUploader />
          </DialogContent>
        </Dialog>
      </header>

      <WardrobeWorkspace items={mockClothingItems} />
    </main>
  );
}
