const express = require('express')
const morgan = require('morgan')
const POKEDEX = require('./pokedex.json')
require('dotenv').config()

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

app.use(function validateBearerToken(req, res, next) {
   debugger
   const bearerToken = req.get('Authorization').split(' ')[1];
   const apiToken = process.env.API_TOKEN;
   if(!apiToken || bearerToken !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
   }
   next()
   })

function handleGetTypes(req, res) {
   res.json(validTypes)
   }
   app.get('/types', handleGetTypes)

   app.get('/pokemon', function handleGetPokemon(req, res) {
   let response = POKEDEX.pokemon
   if(req.query.name) {
      response = response.filter(pokemon =>
         pokemon.name.toLowerCase().includes(req.query.name.toLowerCase()))
   }
   if (req.query.type) {
      response = response.filter(pokemon =>
        pokemon.type.includes(req.query.type)
      )}
      res.json(response)
   })
   
app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
})