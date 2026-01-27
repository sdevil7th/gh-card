import { NextRequest } from "next/server";
import { GET as generateImage } from "../../api/og/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  // Inject username into searchParams so the shared logic can read it
  request.nextUrl.searchParams.set("username", username);
  return generateImage(request);
}
