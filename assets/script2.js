const cityNameEl = document.getElementsByClassName("city-name")[0];
const dateEl = document.getElementsByClassName("date")[0];
const currentIconEl = document.getElementById("current-weather-icon");
const currentTempEl = document.getElementsByClassName("current-temperature")[0];
const currentHumidityEl = document.getElementsByClassName("current-humidity")[0];
const currentWindEl = document.getElementsByClassName("current-wind-speed")[0];
const searchParams = new URLSearchParams(window.location.search);


// Recover City Value from URL
function getCityInfo() {
    const ourCity = searchParams.get("city");
    const savedHistory = JSON.parse(localStorage.getItem("SearchHistory"));
    const ourCityInfo = savedHistory.find(item => item.city === ourCity);
    console.log(ourCityInfo)
    if (ourCityInfo) {
        cityNameEl.textContent = `${ourCityInfo.city}, ${ourCityInfo.country}`;
        return ourCityInfo;
    } else {
        console.log('City information not available.');
        return null;
    }
}

async function returnWeatherData(ourCityInfo) {
    const timezone = ourCityInfo.timezone.replace("/", "%2F")
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${ourCityInfo.lat}&longitude=${ourCityInfo.long}&current=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=${timezone}`
    //const url = `https://api.open-meteo.com/v1/forecast?latitude=${ourCityInfo.lat}&longitude=${ourCityInfo.long}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m`
    try {
	    const response = await fetch(url)
        const data = await response.json();
        console.log(data);
        displayInfo(data);
        displayForecast(data);
        return data

    } catch (error) {
	    console.error(error);
    }
    
    console.log()

}

const wmo_codes = {
    "Clear": [0],
    "PartCloud": [1,2,3],
    "Fog": [45, 48],
    "Drizzle": [51,53,55],
    "FreezingDrizzle": [56,57],
    "Rain": [61,63,65,80,81,82],
    "FreezingRain": [66,67],
    "SnowFall": [71,73,75,77,85,86],
    "Thunderstorm": [95,96,99]
}

function codeTranslate(code) {
    return Object.keys(wmo_codes).find(key => wmo_codes[key].includes(code));
}

returnWeatherData(getCityInfo());

const forecastContainerEl = document.getElementsByClassName("five-day-forecast")[0];

function displayInfo(data) {
    console.log(data)
    currentIconEl.setAttribute("alt", codeTranslate(data.current.weathercode));
    dateEl.textContent = dayjs(data.current.time.split("T")[0]).format("dddd, MMMM D, YYYY")
    currentTempEl.textContent = data.current.temperature_2m + "°C";
    currentHumidityEl.textContent = data.current.relativehumidity_2m + "%";
    currentWindEl.textContent = data.current.windspeed_10m + "km/h";
}

function displayForecast(data) {
    for (i=1;i<6;i++) {
        const forecastDayEl = document.createElement("div");
        const forecsatIconEl = document.createElement("img");
        const forecastDayNameEl = document.createElement("h4");
        const forecastTempEl = document.createElement("p");
        const forecastWindEl = document.createElement("p");

        forecastDayEl.setAttribute("class", "forecast-day")

        forecastDayNameEl.textContent = dayjs(data.daily.time[i]).format("ddd");
        forecsatIconEl.setAttribute("alt", codeTranslate(data.daily.weathercode[i]));
        forecastTempEl.textContent = data.daily.temperature_2m_min[i] + "-" + data.daily.temperature_2m_max[i] + "°C";
        forecastWindEl.textContent = data.daily.windspeed_10m_max[i] + " km/h";

        forecastDayEl.append(forecsatIconEl);
        forecastDayEl.append(forecastDayNameEl);
        forecastDayEl.append(forecastTempEl);
        forecastDayEl.append(forecastWindEl);
        forecastContainerEl.append(forecastDayEl);
    }
}

