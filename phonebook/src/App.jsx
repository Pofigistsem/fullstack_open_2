import { useState, useEffect } from "react"
import personMethods from "./services/persons"

const Alert = ({message}) => {
  if (message === null)
    return null

  return (
    <div className="alert">
      {message}
    </div>
  )
}

const Filter = ({nameFilter, handleFilterChange}) => {

  return <p>filter shown with <input id="NameFilter" value={nameFilter} onChange={handleFilterChange}/> </p>
}

const PersonsForm = ({newName, newPhone, handleNameChange, handlePhoneChange, handleSubmit}) => {

  return (
    <form onSubmit={handleSubmit} id="submitPerson" name="submitPerson">
    <div>
      name: <input id="NameInput" type="text" onChange={handleNameChange} value={newName}/>
    </div>
    <div>
      number: <input id="PhoneInput" type="tel" onChange={handlePhoneChange} value={newPhone} 
                placeholder="enter phone number" />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Persons = ({persons, nameFilter, handleDelete}) => {
  /* onClick calls handleDelete passing person as an arugment
    without that passing, we would get an event as an argument
  */
  return (
    <>
    {persons
      .filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .map(person =><p key={person.name}>{person.name} {person.number} <button onClick={() => handleDelete(person)}>Delete</button></p>)}
    </>
  )

}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [alertMessage, setAlertMessage] = useState(null)

  useEffect(() => {
    personMethods
    .getAll()
    .then(person => setPersons(person))
  }, [])

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name.toLocaleLowerCase() === newName.toLocaleLowerCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const selectedPerson = persons.find(person => person.name === newName)
        personMethods
        .update(selectedPerson, newPhone)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person ))
          setAlertMessage(`Phone number of ${returnedPerson.name} was changed`)
          setTimeout(() => {
            setAlertMessage(null)
          }, 4000)
        })
      }
    } 
    else 
    {
    const newPerson = {
      name: newName,
      number: newPhone,
    }
    personMethods
    .create(newPerson)
    .then(newPerson => {
      setPersons(persons.concat(newPerson))
      setAlertMessage(`${newPerson.name} was added to the list`)
      setTimeout(() => {
        setAlertMessage(null)
      }, 4000)
    })
  }
    setNewName('')
    setNewPhone('')
}

  const handleDelete = (personToDelete) => {
    if (window.confirm(`Delete ${personToDelete.name}?`)){
      personMethods
      .deletePerson(personToDelete.id)
      .then(() => {
        setPersons(persons.filter(person => personToDelete.id !== person.id))
        setAlertMessage(`${personToDelete.name} was removed from the list`)
        setTimeout(() => {
          setAlertMessage(null)
        }, 4000)
      })
      .catch(e => {
        setAlertMessage(`Information of ${personToDelete.name} was already removed from the server`)
        setTimeout(() => {
          setAlertMessage(null)
        }, 4000)
        setPersons(persons.filter(person => person.id !== personToDelete.id))
      })
    }
  }

  return (
    <div>
      <Alert message={alertMessage}/>
      <h2>Phonebook</h2>  
      <Filter nameFilter={nameFilter} setNameFilter={setNameFilter}
      handleFilterChange={handleFilterChange}/> 

      <h3>add a new</h3>
      <PersonsForm newName={newName} newPhone={newPhone}
      handleNameChange={handleNameChange}
      handlePhoneChange={handlePhoneChange}
      handleSubmit={handleSubmit}/>

      <h3>Numbers</h3>
      <Persons persons={persons} nameFilter={nameFilter} handleDelete={handleDelete} />
    </div>
  )
}

export default App
