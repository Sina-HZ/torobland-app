import { NextRequest } from "next/server";
import { forward } from "@/lib/api/bff";
export async function GET(req: NextRequest) {
  return forward(req, "/cities");
}
