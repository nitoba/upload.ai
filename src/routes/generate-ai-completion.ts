import Elysia from "elysia";
import { z } from "zod";
import { db } from "../lib/db";

export const generateAICompletion = new Elysia()


generateAICompletion.post('/ai/completion', async ({ body, set }) => {
    const bodySchema = z.object({
        videoId: z.string().uuid(),
        prompt: z.string(),
        temperature: z.number().min(0).max(1).default(0.5),
    })
  
    const { videoId, prompt, temperature } = bodySchema.parse(body)
  
    const video = await db.query.videos.findFirst({ where: ({ id }, { eq }) => eq(id, videoId)})
    
      
    if (!video) {
        set.status = 404
        return {
            error: 'No video found'
        }
    }
        
    if (!video.transcription) {
        set.status = 400
        return {
            error: 'Video transcription was not generated yet.'
        }
    }
        
    const promptMessage = prompt.replace('{transcription}', video.transcription)

    // const response = await openai.chat.completions.create({
    //     model: 'gpt-3.5-turbo-16k',
    //     temperature,
    //     messages: [
    //       { role: 'user', content: promptMessage }
    //     ],
    //     stream: true,
    // })
  
    // const stream = OpenAIStream(response)
  
    // streamToResponse(stream, reply.raw, {
    //     headers: {
    //       'Access-Control-Allow-Origin': '*',
    //       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    //     }
    // })  
})