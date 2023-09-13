import { db } from "../lib/db";
import Elysia from "elysia";

export const getAllPromptsRouter = new Elysia()

getAllPromptsRouter.get('/prompts', async () => {
    const prompts = await db.query.prompts.findMany()
    return {
        prompts
    }
})