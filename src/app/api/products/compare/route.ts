import { NextRequest } from "next/server";
import { forward } from "@/lib/api/bff";
export async function POST(req: NextRequest) {
  return forward(req, "/products/compare", { accessToken: true });
}
