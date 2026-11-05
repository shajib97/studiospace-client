import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

if (!uri || !dbName || !secret || !baseURL) {
  throw new Error("Missing Better Auth environment variables.");
}

const globalForMongo = globalThis as typeof globalThis & {
  studioSpaceMongoClient?: MongoClient;
};

const client =
  globalForMongo.studioSpaceMongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.studioSpaceMongoClient = client;
}

const db = client.db(dbName);

export const auth = betterAuth({
  appName: "StudioSpace",
  baseURL,
  secret,

  database: mongodbAdapter(db, { client }),
hooks: {
  before: createAuthMiddleware(async (ctx) => {
    if (ctx.path === "/sign-up/email") {
      const password = ctx.body?.password;

      if (
        typeof password !== "string" ||
        password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password)
      ) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must contain at least 6 characters, an uppercase letter, and a lowercase letter.",
        });
      }
    }
  }),
},
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
},
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
    autoSignIn: false,
  },
});