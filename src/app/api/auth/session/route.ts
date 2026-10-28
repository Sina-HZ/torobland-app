import { cookies } from "next/headers";
export async function GET() {
  const jar = await cookies();
  return Response.json({
    authenticated: Boolean(jar.get("torobland_access")?.value),
  });
}
