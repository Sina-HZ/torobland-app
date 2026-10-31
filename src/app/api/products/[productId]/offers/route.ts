import { forward } from "@/lib/api/bff";
import { NextRequest } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  return forward(req, `/products/${(await params).productId}/offers`);
}
