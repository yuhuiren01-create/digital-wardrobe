"use client";

import { Fragment } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ClothingItem } from "@/lib/types";

type ClothingDetailDialogProps = {
  item: ClothingItem | null;
  onOpenChange: (open: boolean) => void;
  onPlaceInOutfit?: (item: ClothingItem, slot: 0 | 1) => void;
  onDelete?: (item: ClothingItem) => void;
};

export function ClothingDetailDialog({
  item,
  onOpenChange,
  onPlaceInOutfit,
  onDelete,
}: ClothingDetailDialogProps) {
  return (
    <Dialog open={Boolean(item)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {item ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {item.brand} · {item.category}
              </DialogTitle>
              <DialogDescription>
                {item.color} · {item.material}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
              <Image
                src={item.imageUrl}
                alt={`${item.brand} ${item.category}`}
                width={440}
                height={550}
                sizes="220px"
                className="aspect-[4/5] w-full rounded-md object-cover"
              />
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <DetailRow label="季节" value={item.season} />
                <DetailRow label="颜色" value={item.color} />
                <DetailRow label="材质" value={item.material} />
                <DetailRow label="品牌" value={item.brand} />
                <DetailRow label="购入日期" value={item.purchaseDate} />
                <DetailRow label="清洗方式" value={item.careInstructions} />
              </dl>
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              {onDelete && (
                <Button
                  variant="destructive"
                  onClick={() => onDelete(item)}
                  className="mr-auto"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  删除
                </Button>
              )}
              {onPlaceInOutfit ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => onPlaceInOutfit(item, 0)}
                  >
                    放入左侧
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onPlaceInOutfit(item, 1)}
                  >
                    放入右侧
                  </Button>
                </>
              ) : null}
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Fragment>
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </Fragment>
  );
}
