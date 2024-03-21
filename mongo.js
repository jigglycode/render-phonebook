require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const [name, number] = process.argv.slice(1)

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(() => {
    console.log(`added ${name} ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person
    .find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(person)
      }
      )

      mongoose.connection.close()
    })
}
