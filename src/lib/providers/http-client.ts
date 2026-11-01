import { isBrowser, isServer } from "../utils";

export type ApiErrorShape = Error & {
  status: number;
  code?: string;
  retryAfter?: number;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  retryAfter?: number;
  constructor(
    message: string,
    status: number,
    code?: string,
    retryAfter?: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

async function readPayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function errorFromResponse(
  payload: unknown,
  status: number,
  headers?: Headers,
): ApiError {
  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const nested =
    record.error && typeof record.error === "object"
      ? (record.error as Record<string, unknown>)
      : record;
  const message =
    typeof nested.message === "string"
      ? nested.message
      : `درخواست با خطای ${status} مواجه شد`;
  return new ApiError(
    message,
    status,
    typeof nested.code === "string" ? nested.code : undefined,
    Number(headers?.get("retry-after")) || undefined,
  );
}

export async function requestJson<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const response = await fetch(url, { ...init, headers });
  const payload = await readPayload(response);
  if (!response.ok)
    throw errorFromResponse(payload, response.status, response.headers);
  return payload as T;
}

let refreshPromise: Promise<boolean> | undefined;
async function refreshOnce(): Promise<boolean> {
  refreshPromise ??= requestJson<{ authenticated?: boolean }>(
    "/api/auth/token/refresh",
    { method: "POST", credentials: "same-origin" },
  )
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      refreshPromise = undefined;
    });
  return refreshPromise;
}

const normalizePath = (path: string) => {
  const prefix = "/api";
  path = path.startsWith("/") ? path : `/${path}`;
  if (isBrowser()) {
    path = prefix + path;
  }
  return path;
};

export async function browserFetch<T>(
  path: string,
  init: RequestInit = {},
  canRefresh = true,
): Promise<T> {
  const request = { ...init, credentials: "same-origin" as RequestCredentials };
  try {
    return await requestJson<T>(normalizePath(path), request);
  } catch (error) {
    if (
      canRefresh &&
      error instanceof ApiError &&
      error.status === 401 &&
      (await refreshOnce())
    )
      return browserFetch<T>(normalizePath(path), init, false);
    throw error;
  }
}

export async function serverFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const base = process.env.BACKEND_API_URL;
  if (!base) throw new Error("BACKEND_API_URL is not configured");
  const url = `${base.replace(/\/$/, "")}${normalizePath(path)}`;
  return requestJson<T>(url, {
    ...init,
    cache: "no-store",
  });
}

export const apiFetch = (): typeof serverFetch | typeof browserFetch =>
  isServer() ? serverFetch : browserFetch;
