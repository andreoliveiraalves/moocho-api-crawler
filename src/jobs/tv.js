import { fetchTVById } from '../tmdb.js'
import { redisClient } from '../redis.js'

export async function crawlTVIncremental(maxId = 3000) {
  let lastId = parseInt(await redisClient.get('tv:lastId') || '0')
  console.log(`🟪 Starting TV crawl from ID ${lastId + 1} to ${maxId}...`)

  for (let id = lastId + 1; id <= maxId; id++) {
    const show = await fetchTVById(id)
    if (show) {
      await redisClient.set(`tv:${show.id}`, JSON.stringify(show))
      console.log(`🟩 TV saved: [${show.id}] ${show.name}`)
    } else {
      console.log(`⚪ TV ID ${id} not found`)
    }

    await redisClient.set('tv:lastId', id)
    await new Promise(res => setTimeout(res, 200))
  }

  console.log('✅ TV crawl finished')
}