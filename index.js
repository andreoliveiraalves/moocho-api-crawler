import 'dotenv/config'
import cron from 'node-cron'
import { initRedis } from './src/redis.js'
import { crawlMoviesIncremental } from './src/jobs/movies.js'
import { crawlTVIncremental } from './src/jobs/tv.js'
import { crawlPeopleIncremental } from './src/jobs/people.js'

async function main() {
  await initRedis()

  // Run immediately
  await crawlMoviesIncremental(5000)
  await crawlTVIncremental(3000)
  await crawlPeopleIncremental(1000)

  // Schedule hourly incremental crawl
  cron.schedule('0 * * * *', async () => {
    console.log('⏳ Running hourly TMDB incremental crawl...')
    await crawlMoviesIncremental(5000)
    await crawlTVIncremental(3000)
    await crawlPeopleIncremental(1000)
  })
}

main()