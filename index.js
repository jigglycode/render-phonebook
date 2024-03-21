require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
morgan.token('body', (req, res) => JSON.stringify(req.body))
const tiny = ':method :url :status :res[content-length] - :response-time ms'

app.use([express.static('dist'), cors(), express.json(), morgan(`${tiny} :body`)])

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const Person = require('./models/person')

// app.get('/', (req, resp) => {
//   resp.send('<h1>Hello World</h1>')
// })

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(people => response.json(people))
})

app.get('/info', (req, resp) => {
  Person
    .countDocuments()
    .then(count => {
      let date = new Date()
      let resp_str = `Phonebook has info for ${count}`
      resp_str += `<br/>${date.toDateString()} ${date.toTimeString()}`
      resp.send(resp_str)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      person ? response.json(person) : response.status(404).end()
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(result => response.json(result))
    .catch(e => next(e))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: 'name or number must be present'
  //   })
  // }

  // const names = persons.map(p => p.name)

  // if (names.includes(body.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(person => response.json(person))
    .catch(e => next(e))
})

app.put('/api/persons/:id', (req, resp, next) => {
  const { name, number } = req.body
  // new: true => returns modified obj instead of og
  Person
    .findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
      .then(person => resp.json(person))
      .catch(e => next(e))
})

app.use([unknownEndpoint, errorHandler])

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
