import { fetchPersonById } from '../tmdb.js'
import { redisClient } from '../redis.js'

export async function crawlPeopleIncremental(maxId = 1000) {
    let lastId = parseInt(await redisClient.get('people:lastId') || '0')
    console.log(`🟧 Starting people crawl from ID ${lastId + 1} to ${maxId}...`)

    for (let id = lastId + 1; id <= maxId; id++) {
        const person = await fetchPersonById(id)
        if (person) {
            await redisClient.set(`people:${person.id}`, JSON.stringify(person))
            console.log(`🟩 Person saved: [${person.id}] ${person.name}`)
        } else {
            console.log(`⚪ Person ID ${id} not found`)
        }

        await redisClient.set('people:lastId', id)
        await new Promise(res => setTimeout(res, 200))
    }

    console.log('✅ People crawl finished')
}