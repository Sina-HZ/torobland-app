import { Copy, Heart, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api/catalog";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group rounded-lg border border-slate-800 bg-slate-900 p-3 transition-colors hover:border-cyan-500/50">
      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-md bg-slate-800">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            <PackageCheck className="h-12 w-12" aria-hidden="true" />
          </div>
        )}
        {product.label && (
          <span className="absolute left-2 top-2 rounded border border-yellow-500/30 bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-yellow-300">
            {product.label}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label={`افزودن ${product.title} به علاقه‌مندی‌ها`}
          className="absolute right-2 top-2 h-8 w-8 bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <h2 className="mb-1 line-clamp-1 text-sm font-medium text-slate-200">
        {product.title}
      </h2>
      <p className="mb-2 min-h-5 text-xs text-slate-500">
        {product.subtitle ?? ""}
      </p>
      <div className="mb-3 flex items-baseline gap-1">
        <span className="text-sm font-bold text-slate-300">
          {product.price ?? "قیمت نامشخص"}
        </span>
        {product.discount && (
          <span className="text-xs text-slate-500">{product.discount}</span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{product.views ?? ""}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`کپی لینک ${product.title}`}
          className="h-8 w-8 p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
}
