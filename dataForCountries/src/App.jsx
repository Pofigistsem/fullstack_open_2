import { useState, useEffect } from "react"
import axios from "axios"
import { api_key } from "./utility"

const CountriesDisplay = ({countries, handleShowMore}) => {

  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }
  
  return (
    <>
    {countries.length > 1 ? countries.map(country => {
      return (
      <p key={country.name.official}>{country.name.common}<button onClick={() => handleShowMore(country)}>show</button></p>
      )
    })
    : countries.map(country => {
      return (
      <div key={country.name.official}>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital}</p>
        <p>are {country.area}</p>
        <h3>languages: </h3>
        <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} style={{width: "10em", height: "10em" }}/>
        <h3>Weather in {country.name.common}</h3>
        <p>temperature {country.temp} Celsius</p>
        <img src={`https://openweathermap.org/img/wn/${country.icon}@2x.png`} />
        <p>wind {country.wind}</p>
      </div>
      )
    }) 
  }
  </>
  )
}


const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [filteredCountries, setFilteredCountries] = useState(countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())))

  useEffect(() => {
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then(response => setCountries(response.data)
    )
  }, [])


  useEffect(() => {
    if(filteredCountries.length === 1) {
      let [filteredCountry] = filteredCountries
      axios
      .get(`http://api.openweathermap.org/geo/1.0/direct?q=${filteredCountry.capital}&limit=1&appid=${api_key}`) // get geodata
      .then(response => {
        axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=${api_key}`)
        .then((response) => {
            setFilteredCountries([{...filteredCountry, temp: response.data.main.temp, icon: response.data.weather[0].icon, wind: response.data.wind.speed}])
          })
      })
    }
  }, [search])

  console.log(filteredCountries)

  const handleShowMore = (c) => {
    setSearch(c.name.common)
    setFilteredCountries(countries.filter(country => country.name.common.toLowerCase().includes(c.name.common.toLowerCase())))
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setFilteredCountries(countries.filter(country => country.name.common.toLowerCase().includes(e.target.value.toLowerCase())))
  }

  return (
    <div>
      <p>find countries <input onChange={handleSearchChange} value={search} /></p>
      <CountriesDisplay countries={filteredCountries} handleShowMore={handleShowMore} />
    </div>
  )
}

export default App