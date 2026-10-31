import Link from "next/link";
import { getQueryClient } from "@/lib/providers/query-client";
import { categoryList } from "../infra/queries";

export default async function CategoriesLink() {
  const queryClient = getQueryClient();
  const categories = await queryClient.query(categoryList());

  return categories.map((cat) => (
    <Link
      key={cat.id}
      href={cat.slug}
      className="transition-colors hover:text-white"
    >
      {cat.name}
    </Link>
  ));
}
