DROP INDEX "shortened_url";--> statement-breakpoint
CREATE INDEX "idx_shortened_url" ON "links" USING btree ("shortened_url");