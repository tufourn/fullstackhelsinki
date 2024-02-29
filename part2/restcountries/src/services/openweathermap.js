import axios from "axios"
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const weather_api_key = import.meta.env.VITE_WEATHER_API_KEY

const getWeather = (country) => {
  const [lat, lon] = country.capitalInfo.latlng
  const request = axios.get(`${baseUrl}?lat=${lat}&lon=${lon}&appid=${weather_api_key}`)
  return request.then(response => response.data)
}

export default { getWeather }