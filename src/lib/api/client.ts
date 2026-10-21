const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api").replace(
    /\/$/,
    ""
  );

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * The one place where requests to the catalog service are configured.
 * Keeping this separate from the UI makes it possible to change the API
 * host, headers, or error handling without changing components.
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `درخواست با خطای ${response.status} مواجه شد`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}
