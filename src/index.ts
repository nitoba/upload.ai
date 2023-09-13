import Elysia from 'elysia'
import { getAllPromptsRouter } from './routes/get-all-prompts'
import { uploadVideoRouter } from './routes/upload-video'

const app = new Elysia()

app.use(getAllPromptsRouter)
app.use(uploadVideoRouter)

app.listen(3333)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)