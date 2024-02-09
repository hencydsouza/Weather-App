const timeEl = document.getElementById('time')
const dateEl = document.getElementById('date')
const currentWeatherItemsEl = document.getElementById('current-weather-items')
const timezone = document.getElementById('time-zone')
const countryEl = document.getElementById('country')
const weatherForecastEl = document.getElementById('weather-forecast')
const currentTempEl = document.getElementById('current-temp')
const inputEl = document.getElementById('search')
const locationEl = document.getElementById('location')

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = 'ffb7b9808e07c9135bdcc7d1e867253d'
// getWeatherData()

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 1000);

navigator.geolocation.getCurrentPosition((success) => {
    console.log(success)
    let { latitude, longitude } = success.coords;
    getWeatherData(latitude, longitude)
})

function getWeatherData(latitude, longitude) {

    // console.log(success)

    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data)
        showWeatherData(data)
    })

}

inputEl.addEventListener('search', async () => {
    console.log('searched')
    let data = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputEl.value}&limit=1&appid=ffb7b9808e07c9135bdcc7d1e867253d`).then(res => res.json()).then(data => {
        console.log(data[0])
        locationEl.innerHTML = data[0].name
        getWeatherData(data[0].lat, data[0].lon)
        
    })

    inputEl.value = ''
})

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed, temp } = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E '

    currentWeatherItemsEl.innerHTML = `
    <div class="weather-item">
        <div>Temp</div>
        <div>${temp}&deg; C</div>
    </div>
        <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>`

    let otherDayForecast = ''
    data.daily.forEach((day, index) => {
        if (index == 0) {
            currentTempEl.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>
            `
        } else {
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>
            `
        }
    })

    weatherForecastEl.innerHTML = otherDayForecast
}