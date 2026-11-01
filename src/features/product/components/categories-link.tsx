"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "../types";

export default function CategoriesLink({
  categories,
}: {
  categories: Category[];
}) {
  const pathname = usePathname();

  return categories.map((cat) => (
    <Link
      key={cat.id}
      href={`/category/${cat.slug}`}
      className={cn("transition-colors hover:text-white cursor-pointer", {
        ["text-primary"]: pathname === `/category/${cat.slug}`,
      })}
    >
      {cat.name}
    </Link>
  ));
}
