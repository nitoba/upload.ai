import Elysia from "elysia";
import { z } from "zod";
import { db } from "../lib/db";
import { videos } from "../lib/db/schema";
import { supabaseClient } from "../lib/supabase";
import axios, { AxiosError } from "axios";
import FormData from "form-data";
import { resolve } from "path";
import { createReadStream } from "fs";

export const createTranscriptionRouter = new Elysia()
createTranscriptionRouter.post('/videos/:videoId/transcription', async ({ params, body, set }) => {
    const paramsSchema = z.object({
        videoId: z.string().uuid(),
    })

    const { videoId } = paramsSchema.parse(params)

    const bodySchema = z.object({
      prompt: z.string(),
    })

    const { prompt } = bodySchema.parse(body)

    try {
        
        const video = await db.query.videos.findFirst({ where: ({ id }, { eq }) => {
            return eq(id, videoId)
        }})


        if (!video) {
            set.status = 404
            return {
                error: 'video not found'
            }
        }

        const videoPath = video.path

        const { data } = await supabaseClient.storage.from('videos').createSignedUrl(videoPath, 60 * 60, { download: true })

        const response = await fetch(data?.signedUrl as string)

        if (!response.ok) {
            set.status = 400
            return {
                error: 'error fetching video'
            }
        }

        const tmpVideoPath = resolve(import.meta.dir, '..', 'tmp', videoPath)
        await Bun.write(tmpVideoPath, response)
        const audioStream = createReadStream(tmpVideoPath)
        const form = new FormData()
        form.append('file', audioStream)
        form.append('model', 'whisper-1')
        form.append('language', 'pt')
        form.append('response_format', 'json')
        form.append('temperature', 0)
        form.append('prompt', prompt)

        const responseOpenAi = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                ...form.getHeaders()
            }
        })

        const transcription = responseOpenAi.data.text

        await db.update(videos).set({ transcription })
        return { transcription }
    } catch (error) {
        set.status = 400
        console.log('Error on transcription', error)

        if (error instanceof AxiosError) {
            return { error: error.response?.data }
        }
        return { error: 'Error on transcription' }
    }

})