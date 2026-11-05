import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const apiURL = process.env.API_URL;
  const appURL = process.env.BETTER_AUTH_URL;

  if (!apiURL || !appURL) {
    return NextResponse.json(
      { message: "Studio API configuration is missing." },
      { status: 500 },
    );
  }

  const origin = new URL(appURL).origin;

  if (request.headers.get("origin") !== origin) {
    return NextResponse.json(
      { message: "Request origin is not allowed." },
      { status: 403 },
    );
  }

  const token = request.cookies.get("studiospace_api_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Please log in to add a studio." },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(`${apiURL}/api/studios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
        Cookie: `studiospace_api_token=${token}`,
      },
      body: await request.text(),
    });

    const result = await response.json();

    return NextResponse.json(result, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the studio server. Please try again." },
      { status: 502 },
    );
  }
}