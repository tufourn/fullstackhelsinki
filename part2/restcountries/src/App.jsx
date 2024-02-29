import { useState, useEffect } from 'react'
import countriesService from './services/restcountries'
import CountryDisplay from './components/CountryDisplay'

function App() {
  const [search, setSearch] = useState('')
  const [countryList, setCountryList] = useState([])

  useEffect(() => {
    countriesService.getAll().then(response => {
      setCountryList(response)
    })
  }, []);

  const handleCountryChange = (event) => {
    setSearch(event.target.value)
  }

  const countriesToDisplay = countryList.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <p>
        find countries
        <input onChange={handleCountryChange}/>
      </p>
      <CountryDisplay countriesToShow={countriesToDisplay} search={search} />
    </div>
  )
}

export default App
