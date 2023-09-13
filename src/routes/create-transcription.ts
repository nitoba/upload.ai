import Elysia from "elysia";
import { z } from "zod";
import { db } from "../lib/db";
import { createReadStream } from "fs";
import { videos } from "../lib/db/schema";

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
    const audioReadStream = createReadStream(videoPath)

    //TODO: call OpenAI library to transcribe audio
    // const response = await openai.audio.transcriptions.create({
    //     file: audioReadStream,
    //     model: 'whisper-1',
    //     language: 'pt',
    //     response_format: 'json',
    //     temperature: 0,
    //     prompt,
    // })

    const transcription = 'response.text'

    await db.update(videos).set({ transcription })

    return { transcription }
})