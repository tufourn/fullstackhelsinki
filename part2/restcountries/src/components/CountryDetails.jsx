import WeatherStatus from "./WeatherStatus.jsx";
const CountryDetails = ({country}) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(l => <li key={l}>{l}</li>)}
      </ul>
      <img src={country.flags.png} alt="flag" width="100px" />
      <WeatherStatus country={country} />
    </div>
  )
}

export default CountryDetails