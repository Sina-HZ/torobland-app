import { apiFetch } from "./client";
import { asRecord, collectionFrom, stringValue } from "./shared";

export type City = {
  id: string;
  name: string;
  query: string;
};

function normalizeCity(value: unknown, index: number): City | null {
  if (typeof value === "string" || typeof value === "number") {
    const name = String(value);
    return { id: name, name, query: name };
  }

  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const name =
    stringValue(record.name) ??
    stringValue(record.title) ??
    stringValue(record.label);
  if (!name) {
    return null;
  }

  const query =
    stringValue(record.id) ??
    stringValue(record.slug) ??
    stringValue(record.code) ??
    name;

  return {
    id: stringValue(record.id) ?? query ?? String(index),
    name,
    query,
  };
}

export async function getCities(): Promise<City[]> {
  const payload = await apiFetch<unknown>("/cities");
  return collectionFrom<unknown>(payload, ["cities", "data", "results"])
    .map(normalizeCity)
    .filter((city): city is City => city !== null);
}
