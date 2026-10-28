import { NextRequest, NextResponse } from "next/server";
import { forward } from "@/lib/api/bff";
import { setTokenCookies } from "@/lib/services/cookies-service";
export async function POST(req: NextRequest) {
  const upstream = await forward(req, "/auth/otp/verify");
  if (!upstream.ok) return upstream;
  const data = await upstream.json();
  const tokens = data?.tokens ?? data;
  if (!tokens?.accessToken || !tokens?.refreshToken)
    return NextResponse.json({ authenticated: false }, { status: 502 });
  const out = NextResponse.json({
    authenticated: true,
    accessTokenExpiresIn: tokens.accessTokenExpiresIn,
    refreshTokenExpiresIn: tokens.refreshTokenExpiresIn,
  });
  setTokenCookies(out, tokens);
  return out;
}
