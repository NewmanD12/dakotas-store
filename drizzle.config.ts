import type { Config } from "drizzle-kit";

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default {
  schema: "./src/app/drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
} satisfies Config;