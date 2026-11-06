import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { createApiToken } from "@/lib/api-token";

export async function POST(request: NextRequest) {
  const apiURL = process.env.API_URL;
  const appURL = process.env.BETTER_AUTH_URL;

  if (!apiURL || !appURL) {
    return NextResponse.json(
      { message: "Booking API configuration is missing." },
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

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json(
      { message: "Please log in to book a studio." },
      { status: 401 },
    );
  }

  try {
    const token = await createApiToken(session.user.id);

    const response = await fetch(`${apiURL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
        Cookie: `studiospace_api_token=${token}`,
      },
      body: await request.text(),
    });

    return NextResponse.json(await response.json(), {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the booking server. Please try again." },
      { status: 502 },
    );
  }
}