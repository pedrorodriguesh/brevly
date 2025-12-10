CREATE INDEX "shortened_url" ON "links" USING btree ("shortened_url");--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_shortened_url_unique" UNIQUE("shortened_url");