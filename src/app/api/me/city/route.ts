import { forward } from "@/lib/api/bff";
import { NextRequest } from "next/server";
export async function PUT(req: NextRequest) {
  return forward(req, "/me/city", { accessToken: true });
}
