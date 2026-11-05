import { SignJWT } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const appURL = process.env.BETTER_AUTH_URL;
  const secret = process.env.API_JWT_SECRET;

  if (!appURL || !secret) {
    return NextResponse.json(
      { message: "Token configuration is missing." },
      { status: 500 },
    );
  }

  if (request.headers.get("origin") !== new URL(appURL).origin) {
    return NextResponse.json(
      { message: "Request origin is not allowed." },
      { status: 403 },
    );
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json(
      { message: "Please log in to continue." },
      { status: 401 },
    );
  }

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.user.id)
    .setIssuer("studiospace-auth")
    .setAudience("studiospace-api")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(new TextEncoder().encode(secret));

  const response = NextResponse.json({ success: true });

  response.cookies.set("studiospace_api_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
    maxAge: 5 * 60,
  });

  return response;
}

export function DELETE(request: NextRequest) {
  const appURL = process.env.BETTER_AUTH_URL;

  if (!appURL || request.headers.get("origin") !== new URL(appURL).origin) {
    return NextResponse.json(
      { message: "Request origin is not allowed." },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("studiospace_api_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
    maxAge: 0,
  });

  return response;
}