ALTER TABLE "links" RENAME COLUMN "shortened_url" TO "short_code";--> statement-breakpoint
ALTER TABLE "links" DROP CONSTRAINT "links_shortened_url_unique";--> statement-breakpoint
DROP INDEX "idx_shortened_url";--> statement-breakpoint
CREATE INDEX "idx_shortened_url" ON "links" USING btree ("short_code");--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_short_code_unique" UNIQUE("short_code");