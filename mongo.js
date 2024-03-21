const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const [password, name, number] = process.argv.slice(2)

const url =
  `mongodb+srv://jigglycode:${password}@cluster0.hq2mo6y.mongodb.net/phonebookApp?retryWrites=true&w=majority`

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
