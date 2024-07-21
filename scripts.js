const apiKey = "f66f02798c6cca6baabb71fe26138d89";

const cityNameInput = document.querySelector(".city-lookup");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const currentWeather = document.querySelector(".current-weather");
const forecast = document.querySelector(".forecast");
//TODO AICI INCEPE CODUL DE INVARTIRE A SPINNER ULUI
const loadingGif = document.getElementById("loading-gif");
const loadingContainer = document.getElementById("loading-container");

// Ascunde GIF-ul de încărcare inițial
loadingGif.classList.add("visually-hidden");

searchBtn.addEventListener("click", () => {
  const cityName = cityNameInput.value;
  if (cityName) {
    fetchCurrentWeather(cityName);
    fetchWeatherForecast(cityName);
  } else {
    alert("Please enter a city name");
  }
});
// Adaugă eveniment pentru butonul de căutare
searchBtn.addEventListener("click", () => {
  // Afișează GIF-ul de încărcare
  loadingGif.classList.remove("visually-hidden");
  fetchWeatherData();
});

// Adaugă eveniment pentru butonul de locație
locationBtn.addEventListener("click", () => {
  // Afișează GIF-ul de încărcare
  loadingGif.classList.remove("visually-hidden");
  fetchLocationWeather();
});
// Funcție pentru a ascunde GIF-ul de încărcare
function hideLoadingGif() {
  loadingGif.classList.add("visually-hidden");
}

// Exemplu de funcție pentru încărcare datelor meteo
function fetchWeatherData() {
  // Simulează o cerere de date meteo
  setTimeout(() => {
    // După ce datele sunt încărcate, ascunde GIF-ul de încărcare
    hideLoadingGif();
  }, 2000); // Exemplu: așteaptă 2 secunde (simulează o cerere reală)
}

// Exemplu de funcție pentru încărcare datelor meteo bazate pe locație
function fetchLocationWeather() {
  // Simulează o cerere de date meteo bazată pe locație
  setTimeout(() => {
    // După ce datele sunt încărcate, ascunde GIF-ul de încărcare
    hideLoadingGif();
  }, 2000); // Exemplu: așteaptă 2 secunde (simulează o cerere reală)
}
//TODO -AICI SE TERMINA CODUL DE ASCUNDERE A SPINNER ULUI

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchCurrentLocationWeather(lat, lon);
      },
      (error) => {
        console.error("Error gettinf location:", error);
        alert("Error getting location. Please enter a city name manually.");
      }
    );
  } else {
    alert(
      "Geolocation is not supported by this browser. Please enter a city name manually."
    );
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
      currentWeather.innerHTML =
        "<p>Error fetching current weather data. Please try again later.</p>";
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
      currentWeather.innerHTML =
        "<p>Error fetching current weather data for your location. Please try again later.</p>";
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
  let backgroundUrl;

  switch (data.weather[0].main) {
    case "Clear":
      backgroundUrl = "assets/clear.jpg";
      break;
    case "Clouds":
      backgroundUrl = "assets/cloudy.jpg";
      break;
    case "Rain":
      backgroundUrl = "assets/rainy.jpg";
      break;
    case "Snow":
      backgroundUrl = "assets/snow.jpg";
      break;
    default:
      backgroundUrl = "assets/default.jpg";
      break;
  }

  currentWeather.style.backgroundImage = `url('${backgroundUrl}')`;

  currentWeather.innerHTML = `
        <div class="details">
            <h2>Current Weather in ${data.name}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Wind: ${data.wind.speed} m/s</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
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
      forecast.innerHTML =
        "<p>Error fetching weather forecast data. Please try again later.</p>";
    });
}

const weatherBackgrounds = {
  Clear: "assets/clear.jpg",
  Clouds: "assets/cloudy.jpg",
  Rain: "assets/rainy.jpg",
  Snow: "assets/snowy.jpg",
  default: "assets/default-background.jpg",
};

function displayWeatherForecast(data) {
  forecast.innerHTML = `<h2 style="color: black;">5-Day Weather Forecast for ${data.city.name}</h2>`;
  data.list.forEach((item, index) => {
    if (index % 8 === 0) {
      const weatherCondition = item.weather[0].main;
      const backgroundUrl =
        weatherBackgrounds[weatherCondition] || weatherBackgrounds.default;

      forecast.innerHTML += `
                <div class="col-md-2 card text-center p-2" style="background-image: url('${backgroundUrl}'); background-size: cover; background-repeat: no-repeat; background-position: center;">
                    <div class="card-body">
                        <p>Date: ${new Date(
                          item.dt_txt
                        ).toLocaleDateString()}</p>
                        <p>Temperature: ${item.main.temp}°C</p>
                        <p>Weather: ${item.weather[0].description}</p>
                         <p>Humidity: ${item.main.humidity}%</p>
                         <img src="https://openweathermap.org/img/wn/${
                           item.weather[0].icon
                         }@4x.png" alt="weather icon">
                    </div>
                </div>
            `;
    }
  });
}
