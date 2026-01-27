import { NextRequest } from "next/server";
import { GET as generateImage } from "../../../api/og/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; repo: string }> },
) {
  const { username, repo } = await params;
  // Combine owner and repo for the logic
  request.nextUrl.searchParams.set("username", `${username}/${repo}`);
  return generateImage(request);
}
