import { NextRequest, NextResponse } from "next/server";
import { forward } from "@/lib/api/bff";
import { clearTokenCookies } from "@/lib/services/cookies-service";
export async function POST(req: NextRequest) {
  const upstream = await forward(req, "/auth/logout-all", {
    accessToken: true,
    refreshToken: false,
  });
  const out = NextResponse.json(
    { authenticated: false },
    { status: upstream.ok || upstream.status === 401 ? 200 : upstream.status },
  );
  clearTokenCookies(out);
  return out;
}
