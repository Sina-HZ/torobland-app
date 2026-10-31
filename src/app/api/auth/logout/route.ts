import { forward } from "@/lib/api/bff";
import { clearTokenCookies } from "@/lib/services/cookies-service";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const upstream = await forward(req, "/auth/logout", {
    accessToken: false,
    refreshToken: true,
  });
  const out = NextResponse.json(
    { authenticated: false },
    { status: upstream.ok || upstream.status === 401 ? 200 : upstream.status },
  );
  clearTokenCookies(out);
  return out;
}
