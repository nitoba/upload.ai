CREATE TABLE IF NOT EXISTS "prompts" (
	"id" text NOT NULL,
	"template" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "videos" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"transcription" text,
	"createdAt" timestamp DEFAULT now()
);
