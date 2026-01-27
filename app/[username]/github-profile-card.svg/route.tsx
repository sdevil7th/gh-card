import { NextRequest } from "next/server";
import { GET as generateImage } from "../../api/og/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  // Inject username and format into searchParams
  request.nextUrl.searchParams.set("username", username);
  request.nextUrl.searchParams.set("format", "svg");
  return generateImage(request);
}
