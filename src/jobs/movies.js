import { fetchMovieById } from '../tmdb.js'
import { redisClient } from '../redis.js'

export async function crawlMoviesIncremental(maxId = 5000) {
  let lastId = parseInt(await redisClient.get('movies:lastId') || '0')
  console.log(`🟦 Starting movies crawl from ID ${lastId + 1} to ${maxId}...`)

  for (let id = lastId + 1; id <= maxId; id++) {
    const movie = await fetchMovieById(id)
    if (movie) {
      await redisClient.set(`movies:${movie.id}`, JSON.stringify(movie))
      console.log(`🟩 Movie saved: [${movie.id}] ${movie.title}`)
    } else {
      console.log(`⚪ Movie ID ${id} not found`)
    }

    await redisClient.set('movies:lastId', id)
    await new Promise(res => setTimeout(res, 200))
  }

  console.log('✅ Movies crawl finished')
}