import { envSchema } from './env'

// Only safe to access import.meta.env here
export const clientEnv = envSchema.parse({
    ENV: import.meta.env.VITE_ENV,
    PORT: import.meta.env.VITE_PORT,
    BACKEND_PROXY: import.meta.env.VITE_BACKEND_PROXY,
    CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    CLOUDINARY_TEAM_LOGO_FOLDER: import.meta.env.VITE_CLOUDINARY_TEAM_LOGO_FOLDER
})

export default clientEnv
