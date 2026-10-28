import { NextResponse } from "next/server";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "../types/constants";

export function setTokenCookies(
  response: NextResponse,
  tokens: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn?: number;
    refreshTokenExpiresIn?: number;
  },
) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(COOKIE_ACCESS_TOKEN, tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure,
    maxAge: tokens.accessTokenExpiresIn,
  });
  response.cookies.set(COOKIE_REFRESH_TOKEN, tokens.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/api/auth",
    secure,
    maxAge: tokens.refreshTokenExpiresIn,
  });
}
export function clearTokenCookies(response: NextResponse) {
  response.cookies.set(COOKIE_ACCESS_TOKEN, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set(COOKIE_REFRESH_TOKEN, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/api/auth",
  });
}
