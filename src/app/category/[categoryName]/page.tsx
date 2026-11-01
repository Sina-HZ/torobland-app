import CatalogPage from "@/app/catalog-page";

export const instant = false;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryName: string }>;
}) {
  const { categoryName } = await params;
  return <CatalogPage categoryName={categoryName} />;
}
