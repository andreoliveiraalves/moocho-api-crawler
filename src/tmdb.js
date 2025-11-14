import axios from 'axios'

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3'
})

async function fetchMovieById(id) {
  try {
    const res = await tmdb.get(`/movie/${id}`, { params: { api_key: process.env.TMDB_API_KEY } })
    return res.data
  } catch (err) {
    if (err.response && err.response.status === 404) return null
    console.error('❌ Error fetching movie ID', id, err.message)
    return null
  }
}

async function fetchTVById(id) {
  try {
    const res = await tmdb.get(`/tv/${id}`, { params: { api_key: process.env.TMDB_API_KEY } })
    return res.data
  } catch (err) {
    if (err.response && err.response.status === 404) return null
    console.error('❌ Error fetching TV ID', id, err.message)
    return null
  }
}

async function fetchPersonById(id) {
  try {
    const res = await tmdb.get(`/person/${id}`, { params: { api_key: process.env.TMDB_API_KEY } })
    return res.data
  } catch (err) {
    if (err.response && err.response.status === 404) return null
    console.error('❌ Error fetching Person ID', id, err.message)
    return null
  }
}

export { fetchMovieById, fetchTVById, fetchPersonById }