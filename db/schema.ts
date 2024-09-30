import {
  AnyPgColumn,
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, SQL, sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    isVerified: boolean("isVerified").notNull().default(false),
    verifyCode: text("verifyCode"),
    verifyExpiry: timestamp("verifyExpiry"),
    isAcceptingMessage: boolean("isAcceptingMessage").notNull().default(true),
  },
  (table) => ({
    emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(lower(table.email)),
  })
);

export const lower = (email: AnyPgColumn): SQL => {
  return sql`lower(${email})`;
};

export const message = pgTable("message", {
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  userId: integer("userId").notNull(),
});

export const usersRelation = relations(users, ({ many }) => ({
  messages: many(message),
}));

export const messageRelations = relations(message, ({ one }) => ({
  user: one(users, {
    fields: [message.userId],
    references: [users.id],
  }),
}));
