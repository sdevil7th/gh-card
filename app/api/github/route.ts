import { NextRequest, NextResponse } from "next/server";
import { fetchGithubData } from "@/lib/github/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }

  try {
    const data = await fetchGithubData(username);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
