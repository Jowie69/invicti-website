import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteConnections = sqliteTable("site_connections", {
  id: integer("id").primaryKey().default(1),
  projectUrl: text("project_url").notNull(),
  publishableKey: text("publishable_key").notNull(),
  updatedAt: text("updated_at").notNull(),
});
