import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";
import postgres from "postgres";

const client = postgres(process.env.DB_URL!);
export const db = drizzle(client, { schema });
