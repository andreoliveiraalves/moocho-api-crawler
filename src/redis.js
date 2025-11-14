import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.REDIS_URL) {
    throw new Error('❌ REDIS_URL is not defined in .env')
}

export const redisClient = createClient({
    url: process.env.REDIS_URL,
})

export async function initRedis() {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect()
            console.log('✅ Connected to Redis')
        }
    } catch (err) {
        console.error('❌ Failed to connect to Redis:', err)
        process.exit(1)
    }
}