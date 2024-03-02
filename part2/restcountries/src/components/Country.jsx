import {useState} from "react";
import CountryDetails from "./CountryDetails.jsx";

const Country = ({ country }) => {
  const [showDetails, setShowDetails] = useState(false)

  const handleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <li>
      {country.name.common}
      <button onClick={handleShowDetails}>{showDetails ? 'hide' : 'show'}</button>
      {showDetails && <CountryDetails country={country} />}
    </li>
  )
}

export default Country