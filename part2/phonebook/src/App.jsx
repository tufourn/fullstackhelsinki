import phonebookService from './services/phonebook'
import Message from './components/Message'
import { useState, useEffect } from 'react'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange}/>
    </div>
  )
}

const PersonForm = ({ handleSubmit, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input onChange={handleNameChange} value={newName}/>
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={newNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Display = ({ entriesToShow, handleDelete }) => {
  return (
    <div>
      {entriesToShow.map(person =>
        <p key={person.id}>
          {person.name} {person.number}
          {<button onClick={() => handleDelete(person.id)}>delete</button>}
        </p>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    phonebookService
      .getAll()
      .then(phonebook => {
        setPersons(phonebook)
      })

  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (id) => {
    for (let i = 0; i < persons.length; i++) {
      if (persons[i].id === id) {
        if (window.confirm(`Delete ${persons[i].name}?`)) {
          phonebookService
            .del(id)
            .then(() => {
              setPersons(persons.filter(person => person.id !== id))
              setMessageType('success')
              setMessage(`Deleted ${persons[i].name}`)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            })
        }
        return
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    for (let i = 0; i < persons.length; i++) {
      if (persons[i].name === newName) {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          phonebookService
            .update(persons[i].id, personObject)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== persons[i].id ? person : returnedPerson))
              setNewName('')
              setNewNumber('')
              setMessageType('success')
              setMessage(`Updated ${returnedPerson.name}`)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            })
            .catch(err => {
              setMessageType('error')
              setMessage(`Information of ${newName} has already been removed from server`)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              setPersons(persons.filter(person => person.id !== persons[i].id))
            })
        }
        return
      }
    }

    phonebookService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMessageType('success')
        setMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const entriesToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} type={messageType}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm handleSubmit={handleSubmit} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Display entriesToShow={entriesToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App