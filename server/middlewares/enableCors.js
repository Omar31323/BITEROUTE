import cors from 'cors';
export const enableCors = () => {
    return cors({
        origin: process.env.CORS_ORIGIN_URL,
        credentials: true
    })
}