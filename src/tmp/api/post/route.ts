import { NextResponse } from "next/server";

/**@interface http://localhost:3000/api/post */
export async function GET(request: Request) {
  return NextResponse.json(
    [{ slug: "post-1" }, { slug: "post-2" }, { slug: "post-3" }],
    { status: 200 }
  );
}
