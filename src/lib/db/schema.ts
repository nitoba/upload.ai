import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const videos = pgTable('videos', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    path: text('path').notNull(),
    transcription: text('transcription'),
    createdAt: timestamp("createdAt").defaultNow()
})

export const prompts = pgTable('prompts', {
    id: text('id').primaryKey(),
    title: text('id').notNull(),
    template: text('template').notNull()
})