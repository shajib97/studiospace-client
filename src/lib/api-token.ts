import { SignJWT } from "jose";

export async function createApiToken(userId: string) {
  const secret = process.env.API_JWT_SECRET;

  if (!secret) {
    throw new Error("API_JWT_SECRET must be set in .env");
  }

  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuer("studiospace-auth")
    .setAudience("studiospace-api")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(new TextEncoder().encode(secret));
}