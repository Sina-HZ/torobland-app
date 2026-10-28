export type CategoryAttributeDefinition = {
  key: string;
  label: string;
  type: "integer" | "string";
  unit?: string;
  filterable: boolean;
  allowedValues?: Array<number | string>;
};
export type Category = {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
  attributeDefinitions: CategoryAttributeDefinition[];
};

export type ProductSummary = {
  product: ProductSummaryProduct;
  brand: ProductSummaryBrand;
  minimumPriceRial: number;
  matchingShopCount: number;
  bestShop: ProductSummaryBestShop;
  freshness: string;
  cityId: string;
  _sort: "balanced" | "price" | "trust" | "freshness";
};
export type ProductSummaryProduct = {
  id: string;
  categoryId: string;
  brandId: string;
  model: string;
  title: string;
  slug: string;
  identifiers: { model: string };
  imageUrls: string[];
  attributes: Record<string, string | number | boolean | null>;
  isActive: boolean;
};
export type ProductSummaryBrand = {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
};
export type ProductSummaryBestShop = {
  shopId: string;
  name: string;
  trustScore: number;
};
export type Product = {
  id: string;
  title: string;
  image?: string;
  label?: string;
  subtitle?: string;
  price?: string;
  discount?: string;
  views?: string;
  createdAt?: string;
  brand?: string;
  category?: string;
  updatedAt?: string;
};
export type Offer = {
  id: string;
  shopId?: string;
  shopName?: string;
  priceRial?: number;
  inStock?: boolean;
  updatedAt?: string;
  [key: string]: unknown;
};
export type Brand = { id: string; name: string };
export type CategoryFilters = {
  brands: Brand[];
  attributes: Array<{ key: string; name: string; values?: string[] }>;
};
export type ProductQuery = {
  q?: string;
  category?: string;
  brand?: string[];
  minPriceRial?: number;
  maxPriceRial?: number;
  cityId?: string;
  inStock?: boolean;
  updatedWithinMinutes?: number;
  shopId?: string;
  minTrustScore?: number;
  attributes?: Record<string, string | string[]>;
  sort?: "balanced" | "price" | "trust" | "freshness";
  page?: number;
  pageSize?: number;
};
