
const apiKey = "f66f02798c6cca6baabb71fe26138d89";

const cityNameInput = document.querySelector(".city-lookup");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const currentWeather = document.querySelector(".current-weather");
const forecast = document.querySelector(".forecast");

searchBtn.addEventListener("click", () => {
  const cityName = cityNameInput.value;
  if (cityName) {
    fetchCurrentWeather(cityName);
    fetchWeatherForecast(cityName);
  } else {
    alert("Please enter a city name");
  }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat= position.coords.latitude;
            const lon = position.coords.longitude;
            fetchCurrentLocationWeather(lat,lon);
        }, (error) => {
            console.error("Error gettinf location:" ,error);
            alert("Error getting location. Please enter a city name manually.");
        });
    } else {
        alert("Geolocation is not supported by this browser. Please enter a city name manually.");
    }
});

function fetchCurrentWeather(cityName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      fetchUVIndex(data.coord.lat, data.coord.lon);
    })
    .catch((error) => {
      console.error("Error fetching current weather:", error);
      currentWeather.innerHTML = "<p>Error fetching current weather data. Please try again later.</p>";
    });
}


function fetchCurrentLocationWeather(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        displayCurrentWeather(data);
        fetchUVIndex(lat, lon);
      })
      .catch((error) => {
        console.error("Error fetching current weather for location:", error);
        currentWeather.innerHTML = "<p>Error fetching current weather data for your location. Please try again later.</p>";
      });
  }

function fetchUVIndex(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayUVIndex(data);
    })
    .catch((error) => {
      console.error("Error fetching UV index:", error);
      const uvElement = document.createElement("p");
      uvElement.textContent = "Error fetching UV index data.";
      currentWeather.appendChild(uvElement);
    });
}

function displayCurrentWeather(data) {
  currentWeather.innerHTML = `
        <div class="details">
            <h2>Current Weather in ${data.name}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Wind: ${data.wind.speed} m/s</p>
            <p>Weather: ${data.weather[0].description}</p>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="weather icon">
        </div>
    `;
}

function displayUVIndex(data) {
  const uvElement = document.createElement("p");
  uvElement.textContent = `UV Index: ${data.value}`;
  currentWeather.appendChild(uvElement);
}

function fetchWeatherForecast(cityName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      displayWeatherForecast(data);
    })
    .catch((error) => {
      console.error("Error fetching weather forecast:", error);
      forecast.innerHTML = "<p>Error fetching weather forecast data. Please try again later.</p>";
    });
}

function displayWeatherForecast(data) {
  forecast.innerHTML = `<h2>5-Day Weather Forecast for ${data.city.name}</h2>`;
  data.list.forEach((item, index) => {
    if (index % 8 === 0) {
      forecast.innerHTML += `
                <div class="col-md-2 card text-center p-2">
                    <div class="card-body">
                        <p>Date: ${new Date(item.dt_txt).toLocaleDateString()}</p>
                        <p>Temperature: ${item.main.temp}°C</p>
                        <p>Weather: ${item.weather[0].description}</p>
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png" alt="weather icon">
                    </div>
                </div>
            `;
    }
  });
}
