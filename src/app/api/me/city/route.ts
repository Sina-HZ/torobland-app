import { NextRequest } from "next/server";
import { forward } from "@/lib/api/bff";
export async function PUT(req: NextRequest) {
  return forward(req, "/me/city", { accessToken: true });
}
