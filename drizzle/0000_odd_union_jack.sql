CREATE TABLE IF NOT EXISTS "message" (
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"verifyCode" text,
	"verifyExpiry" timestamp,
	"isAcceptingMessage" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailUniqueIndex" ON "users" USING btree (lower("email"));