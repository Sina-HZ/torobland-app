import { NextRequest } from "next/server";
import { forward } from "@/lib/api/bff";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  return forward(req, `/products/${(await params).productId}`);
}
