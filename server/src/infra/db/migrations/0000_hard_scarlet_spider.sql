CREATE TABLE "links" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"shortened_url" text NOT NULL,
	"full_url" text NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"created_at" date DEFAULT now()
);
