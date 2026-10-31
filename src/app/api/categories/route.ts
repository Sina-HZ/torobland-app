import { forward } from "@/lib/api/bff";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return forward(req, "/categories");
}
