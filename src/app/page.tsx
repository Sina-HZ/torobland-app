import CatalogPage from "./catalog-page";

// Catalog data is uncached and user/city dependent, so this route renders
// dynamically per request instead of being statically prerendered at build.
export const instant = false;

export default function Home() {
  return <CatalogPage />;
}
