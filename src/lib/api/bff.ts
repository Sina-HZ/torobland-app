import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "../types/constants";

export async function forward(
  request: NextRequest,
  path: string,
  options: { accessToken?: boolean; refreshToken?: boolean } = {},
) {
  const base = process.env.BACKEND_API_URL;
  if (!base)
    return NextResponse.json(
      { code: "backend_not_configured", message: "Backend is not configured" },
      { status: 500 },
    );
  const jar = await cookies();
  const headers = new Headers({ Accept: "application/json" });
  if (request.method !== "GET") headers.set("Content-Type", "application/json");
  const token = jar.get(
    options.refreshToken ? COOKIE_REFRESH_TOKEN : COOKIE_ACCESS_TOKEN,
  )?.value;
  if (token && (options.refreshToken || options.accessToken))
    headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(
    `${base.replace(/\/$/, "")}${path}${request.nextUrl.search}`,
    {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.text(),
      cache: "no-store",
    },
  );
  const text = await response.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = text;
  }
  return NextResponse.json(body ?? {}, { status: response.status });
}
