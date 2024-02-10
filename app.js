const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const path = require('path')
const dbpath = path.join(__dirname, 'moviesData.db')
module.exports = app
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

// API 1

app.get('/movies/', async (request, response) => {
  const getMovieQuery = `
    SELECT
      movie_name
    FROM
      movie;`
  const movies = await db.all(getMovieQuery)
  response.send(movies)
})

//API 2

app.post('/movies/', async (request, response) => {
  const movieDeatails = request.body
  const {director_id, movie_name, lead_actor} = movieDeatails
  const getMovieQuery = `
    INSERT INTO
      movie (director_id, movie_name, lead_actor)
    VALUES
      (
        '${director_id}',
        '${movie_name}',
        '${lead_actor}'
      );`
  await db.run(getMovieQuery)
  response.send('Movie successfully Added')
})

//API 3

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieQuery = `
    SELECT
      *
    FROM
      movie
    WHERE
      movie_id = ${movieId};`
  const movieObject = await db.run(getMovieQuery)
  response.send(movieObject)
})

//API 4

app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const movieDeatails = request.body
  const {directorId, movieName, leadActor} = movieDeatails
  const getMovieQuery = `
    UPDATE
      movie
    SET
      director_id = '${directorId}',
      movie_name = '${movieName}',
      lead_actor = '${leadActor}'
    WHERE
      movie_id = '${movieId}';`

  await db.get(getMovieQuery)
  response.send('Movie Details Updated')
})

//API 5

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteMovie = `
    DELETE FROM
      movie
    WHERE
      movie_id = '${movieId}';`
  await db.get(deleteMovie)
  response.send('Movie Removed')
})

//API 6

app.get('/directors/', async (request, response) => {
  const getDirectorQuery = `
    SELECT
      *
    FROM
      director;`
  const directorArray = await db.all(getDirectorQuery)
  response.send(directorArray)
})

//API 7

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getDirectorQuery = `
    SELECT
      *
    FROM
      movie
    WHERE
      director_id = '${directorId}';`
  const directorArray = await db.run(getDirectorQuery)
  response.send(directorArray)
})
