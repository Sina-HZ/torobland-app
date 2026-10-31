import { forward } from "@/lib/api/bff";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  return forward(req, "/products/compare", { accessToken: true });
}
