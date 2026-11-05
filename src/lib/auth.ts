import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

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

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
    autoSignIn: false,
  },
});