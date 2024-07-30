import axios from "axios"

const personsUrl = "http://localhost:3001/persons"

const getAll = async () => {
    return axios
    .get(personsUrl)
    .then(person => person.data)
}

const create = async (personToCreate) => {
    return axios
    .post(personsUrl, personToCreate)
    .then(person => person.data)
}

const update = async (person, newNumber) => {
    return axios
    .put(`${personsUrl}/${person.id}`, {...person, number: newNumber})
    .then(answer => answer.data)
}

const deletePerson = (personId) => {
    return axios
    .delete(`${personsUrl}/${personId}`)
}

export default {
    getAll,
    create,
    update,
    deletePerson,
}