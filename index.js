const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')
morgan.token('body', (req, res) => JSON.stringify(req.body))
const tiny = ':method :url :status :res[content-length] - :response-time ms'
app.use(morgan(`${tiny} :body`))

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/', (req, resp) => {
  resp.send('<h1>Hewwo Wowd</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (req, resp) => {
  let date = new Date()
  let resp_str = `Phonebook has info for ${persons.length}`
  resp_str += `<br/>${date.toDateString()} ${date.toTimeString()}`
  resp.send(resp_str)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const person = persons.find(person => person.id === id)
  person
    ? response.json(person)
    : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => Math.floor(Math.random() * 10000)

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and number must be present'
    })
  }

  const names = persons.map(p => p.name)

  if (names.includes(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
