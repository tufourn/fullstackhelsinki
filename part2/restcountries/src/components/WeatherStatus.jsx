import weatherService from '../services/openweathermap'
import {useState, useEffect} from "react";

const WeatherStatus = ({country}) => {
  const [weatherData, setWeatherData] = useState(null)
  useEffect(() => {
    weatherService.getWeather(country)
      .then(data => {
        setWeatherData(data)
      })
  }, [country.capital])

  if (weatherData === null) {
    return null
  }

  return (
    <div>
      <h1>Weather in {country.capital[0]}</h1>
      <p>temperature {Math.floor(weatherData.main.temp - 273.15)} celcius</p>
    </div>
  )
}

export default WeatherStatus