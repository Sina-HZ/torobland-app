import { forward } from "@/lib/api/bff";
import { NextRequest } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  return forward(req, `/categories/${(await params).categoryId}/filters`);
}
