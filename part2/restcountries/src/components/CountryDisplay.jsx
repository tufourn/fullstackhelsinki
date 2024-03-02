import Country from './Country'
import CountryDetails from "./CountryDetails";
const CountryDisplay = ({ countriesToShow, search }) => {
  if (search.length === 0 || countriesToShow.length === 0) {
    return <p></p>
  }
  if (countriesToShow.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (countriesToShow.length > 1) {
    return (
      <div>
        {countriesToShow.map(c => <Country country={c} key={c.name.common}/>)}
      </div>
    )
  }
  return (
    <CountryDetails country={countriesToShow[0]} />
  )

}

export default CountryDisplay