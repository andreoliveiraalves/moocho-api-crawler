# 🕷️ Moocho API TMDB Crawler

> Crawling service to extract and store movies, TV shows, and people data from the TMDB API into Redis.  
> Used to create data for [Moocho API](https://github.com/andreoliveiraalves/moocho-api)

## 📌 Overview

This service is responsible for crawling the TMDB API and storing movies, TV shows, and people in Redis. It works as a **separate service** from your main API.

**⚠️ Important:** The main API only reads data already processed by the crawler — it never makes bulk requests to TMDB.

---

## 🚀 How it works

1. The crawler fetches IDs in batches (movies, TV shows, people)
2. For each resource, it makes a request to TMDB
3. Normalizes and validates the data using models
4. Stores each entry in Redis in the format:

```
resource:<type>:<id> = JSON
```

### Redis key examples:
```
resource:movie:550
resource:tv:1399
resource:person:287
```

---

## 🛠️ Requirements

- **Node.js** 18+
- **Redis** (local or via Docker)
- **Environment variables:**

```env
TMDB_API_KEY=xxxx
REDIS_URL=redis://localhost:6379
```

---

## 📦 Installation

```bash
npm install
```

---

## ▶️ How to start the crawler

```bash
npm run start
```

The crawler will continue while there are IDs to process.

---

## 🧹 Clear Redis data (optional)

In Redis CLI:

```bash
redis-cli
> FLUSHALL
```

---

## 🧱 Project structure

```
📂 crawler
 ┣ 📂 src
 ┃ ┣ 📂 jobs
 ┃ ┃ ┣ movies.js
 ┃ ┃ ┣ tv.js
 ┃ ┃ ┗ people.js
 ┃ ┣ 📂 models
 ┃ ┃ ┣ movieModel.js
 ┃ ┃ ┣ tvModel.js
 ┃ ┃ ┗ personModel.js
 ┃ ┣ redis.js
 ┃ ┗ index.js
 ┣ package.json
 ┗ README.md
```

---

## 🔄 Execution flow

1. `index.js` loads all jobs
2. Each job calls the TMDB API
3. Models validate the received data
4. Results are stored in Redis
5. The process continues until reaching the current maximum ID

---

## 🧪 Test if data was stored

### Inside Redis CLI:

```bash
redis-cli
> KEYS resource:movie:*
```

### Or in Node REPL:

```javascript
const redis = require('./src/redis');
await redis.get('resource:movie:550');
```

---

## 🐳 Docker (optional)

If you want to run Redis in Docker:

```bash
docker run -d -p 6379:6379 --name redis redis:alpine
```

To run the crawler in Docker, create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start"]
```

Build and run:

```bash
docker build -t tmdb-crawler .
docker run --env-file .env --network host tmdb-crawler
```

---

## 🔧 Rate limiting configuration

TMDB has rate limits (usually 40 requests per second). To avoid blocking:

- Add delays between requests (e.g., `setTimeout` of 50ms)
- Use libraries like `bottleneck` or `p-limit`
- Monitor API rate limit headers

---

## 📊 Monitoring

To run as a continuous service, use:

- **PM2** (recommended for Node.js)
- **Docker Compose** with restart policy
- **Systemd** (Linux)
- **Cron jobs** (for periodic executions)

### Example with PM2:

```bash
npm install -g pm2
pm2 start src/index.js --name tmdb-crawler
pm2 save
pm2 startup
```

---

## 🧭 Final notes

- ✅ This crawler should run as a separate service
- ✅ Your main API never crawls, it only reads data from Redis
- ✅ Redis must have persistent storage, or you'll lose data on restart
- ⚠️ Respect TMDB rate limits
- 💡 Consider adding structured logs (Winston, Pino)
- 💡 Implement retry logic for temporary failures

---
