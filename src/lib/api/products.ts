import { apiFetch } from "./client";
import { asRecord, collectionFrom, stringValue } from "./shared";

export type Product = {
  id: string;
  image?: string;
  label?: string;
  title: string;
  subtitle?: string;
  price?: string;
  discount?: string;
  views?: string;
  createdAt?: string;
};

function formatPrice(value: unknown): string | undefined {
  if (typeof value === "number") {
    return `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;
  }

  return stringValue(value);
}

function formatCount(value: unknown): string | undefined {
  if (typeof value === "number") {
    return new Intl.NumberFormat("fa-IR").format(value);
  }

  return stringValue(value);
}

function normalizeProduct(value: unknown, index: number): Product | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const title =
    stringValue(record.title) ??
    stringValue(record.name) ??
    stringValue(record.product_name);
  if (!title) {
    return null;
  }

  const images = Array.isArray(record.images) ? record.images : [];
  const firstImage = images.find(
    (image): image is string => typeof image === "string",
  );

  return {
    id:
      stringValue(record.id) ?? stringValue(record._id) ?? `${title}-${index}`,
    image:
      stringValue(record.image) ??
      stringValue(record.image_url) ??
      stringValue(record.thumbnail) ??
      firstImage,
    label: stringValue(record.label) ?? stringValue(record.badge),
    title,
    subtitle:
      stringValue(record.subtitle) ??
      stringValue(record.description) ??
      stringValue(record.brand),
    price: formatPrice(record.price ?? record.price_value ?? record.bestPrice),
    discount: stringValue(record.discount) ?? stringValue(record.store_name),
    views: formatCount(record.views ?? record.view_count),
    createdAt:
      stringValue(record.created_at) ??
      stringValue(record.updated_at) ??
      stringValue(record.createdAt) ??
      stringValue(record.updatedAt),
  };
}

export async function getProducts(
  city?: string,
  sort?: string,
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (city) {
    params.set("city", city);
  }
  if (sort) {
    params.set("sort", sort);
  }
  const query = params.toString() ? `?${params.toString()}` : "";
  const payload = await apiFetch<unknown>(`/products${query}`);
  return collectionFrom<unknown>(payload, ["products", "data", "results"])
    .map(normalizeProduct)
    .filter((product): product is Product => product !== null);
}
