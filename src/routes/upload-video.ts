import Elysia from "elysia";
import { BunFile } from "bun";
import { randomUUID } from "crypto";
import { basename, extname } from "path";
import { supabaseClient } from "../lib/supabase";
import { db } from "../lib/db";
import { videos } from "../lib/db/schema";

export const uploadVideoRouter = new Elysia()

uploadVideoRouter.post('/videos', async ({ request, set }) => {
    const file = (await request.formData()).get('file') as BunFile

    if (!file) {
        set.status = 400
        return {
            error: 'Missing file.'
        }
    }

    const extension = extname(file.name as string)

    if (extension !== '.mp3') {
        set.status = 400
        return { error: 'Invalid input type, please upload a MP3.' }
    }

    const fileBaseName = basename(file.name as string, extension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`

    const fileAsStream = file.stream()

    for await (const chunk of fileAsStream) {
        const { error } = await supabaseClient.storage.from('videos').upload(fileUploadName, chunk, {
            contentType: 'audio/mpeg',
            upsert: true,
        })

        if (error) {
            fileAsStream.cancel()
            console.log(JSON.stringify(error, undefined, 2))
            set.status = 400
            return { 
                error: error.message
            }
        }
    }

    const videoToInsert = {
        id: randomUUID(),
        name: file.name ?? fileUploadName,
        path: fileUploadName,
    }

    await db.insert(videos).values(videoToInsert)

    return { message: 'video uploaded with success!', video: videoToInsert }
})
