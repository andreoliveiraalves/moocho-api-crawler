import 'dotenv/config'
import cron from 'node-cron'
import { initRedis } from './src/redis.js'
import { crawlMoviesIncremental } from './src/jobs/movies.js'
import { crawlTVIncremental } from './src/jobs/tv.js'
import { crawlPeopleIncremental } from './src/jobs/people.js'

async function main() {
  await initRedis()

  console.log('🚀 Starting initial TMDB crawl...')

  // REALISTIC MAX ID LIMITS
  const MOVIE_MAX_ID = 2_000_000
  const TV_MAX_ID = 300_000
  const PERSON_MAX_ID = 2_500_000

  // Run immediately (incremental)
  await crawlMoviesIncremental(MOVIE_MAX_ID)
  await crawlTVIncremental(TV_MAX_ID)
  await crawlPeopleIncremental(PERSON_MAX_ID)

  // Schedule crawl every 6 hours (recommended)
  cron.schedule('0 */6 * * *', async () => {
    console.log('⏳ Running scheduled TMDB incremental crawl...')
    await crawlMoviesIncremental(MOVIE_MAX_ID)
    await crawlTVIncremental(TV_MAX_ID)
    await crawlPeopleIncremental(PERSON_MAX_ID)
  })
}

main()
