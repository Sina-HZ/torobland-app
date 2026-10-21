type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null
    ? (value as UnknownRecord)
    : null;
}

function collectionFrom<T>(payload: unknown, keys: string[]): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  const record = asRecord(payload);
  if (!record) {
    return [];
  }

  for (const key of keys) {
    if (Array.isArray(record[key])) {
      return record[key] as T[];
    }
  }

  return [];
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : undefined;
}

export { asRecord, collectionFrom, stringValue };
export type { UnknownRecord };
