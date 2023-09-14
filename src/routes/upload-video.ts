import Elysia from "elysia";
import { BunFile } from "bun";
import { randomUUID } from "crypto";
import { basename, extname } from "path";
import { supabaseClient } from "../lib/supabase";

export const uploadVideoRouter = new Elysia()

uploadVideoRouter. post('/videos', async ({ request, set }) => {
    const data = (await request.formData()).get('file') as BunFile

    if (!data) {
        set.status = 400
        return {
            error: 'Missing file.'
        }
    }

    const extension = extname(data.name as string)

    if (extension !== '.mp3') {
        set.status = 400
        return { error: 'Invalid input type, please upload a MP3.' }
    }

    const fileBaseName = basename(data.name as string, extension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`

    const fileAsStream = data.stream()

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
        } else {
            return { message: 'video uploaded with success!' }
        }
    }
})
