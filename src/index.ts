import Elysia from 'elysia'
import { getAllPromptsRouter } from './routes/get-all-prompts'
import { uploadVideoRouter } from './routes/upload-video'
import { createTranscriptionRouter } from './routes/create-transcription'

const app = new Elysia()

app.use(getAllPromptsRouter)
app.use(uploadVideoRouter)
app.use(createTranscriptionRouter)

app.listen(3333)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)