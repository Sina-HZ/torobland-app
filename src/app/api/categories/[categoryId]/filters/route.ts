import { NextRequest } from "next/server";
import { forward } from "@/lib/api/bff";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  return forward(req, `/categories/${(await params).categoryId}/filters`);
}
