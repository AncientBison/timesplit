import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { TASK_COLORS } from "~/lib/taskColors";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `timesplit_${name}`);

export const taskModeEnum = pgEnum("task_mode", ["all-at-once", "incremental"]);

export const colorsEnum = pgEnum("color", TASK_COLORS);

export const tasks = createTable("task", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: d.varchar({ length: 255 }).notNull(),
  dueDate: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  totalMinutesToComplete: d.integer().notNull(),
  minutesCompleted: d.integer().notNull().default(0),
  mode: taskModeEnum("task_mode").notNull(),
  colorHex: colorsEnum("color").notNull(),
  userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users)
}));

export const completedChunks = createTable("completedChunks", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  taskId: d
    .varchar({ length: 225 })
    .notNull()
    .references(() => tasks.id),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  date: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  durationMinutes: d.integer().notNull(),
}));

export const completedChunksRelations = relations(completedChunks, ({ one }) => ({
  task: one(tasks),
  user: one(users),
}));

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  tasks: many(tasks),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
