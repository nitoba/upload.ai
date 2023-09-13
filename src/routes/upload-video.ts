import { BunFile } from "bun";
import { randomUUID } from "crypto";
import Elysia from "elysia";
import { basename, extname, resolve } from "path";

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

    const pathToSaveFile = resolve(import.meta.dir, '..', '..', 'tmp', fileUploadName)

    const fileAsStream = data.stream()

    for await (const chunk of fileAsStream) {
        await Bun.write(pathToSaveFile, chunk)
    }

    return { message: 'Uploading video' }
})
