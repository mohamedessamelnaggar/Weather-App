const inputSearch = document.querySelector("input");
const cityElement = document.getElementById("city");
const monthElement = document.getElementById("month");
const dayElements = document.querySelectorAll("#day");
const temperatureElements = document.querySelectorAll(".card-body p");
const iconElements = document.querySelectorAll(".card-body img");
const conditionTextElements = document.querySelectorAll(".custom");
const weatherDetails = document.querySelectorAll(".card-body span");
const predictedTemperatureElements = document.querySelectorAll(".card-body small");
const errorElement = document.getElementById("incorrect");
async function fetchWeatherData(cityName) {
  const apiKey = "eeb6609c2b0343e8ace132436240312";
  const apiUrl = `HTTPS://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=3&aqi=no&alerts=no`;

  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const weatherData = await response.json();
      updateCityName(weatherData.location);
      updateDateDetails(weatherData.forecast.forecastday);
      updateWeatherDetails(weatherData.current, weatherData.forecast.forecastday);
      console.log(weatherData);
    } else if (response.status === 400) {
      errorElement.innerText = `No weather data found for "${cityName}". Please enter a valid city name.`;
      errorElement.classList.add("text-danger");
    } else {
      throw new Error("Failed to fetch weather data.");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return false;
  }
}

function isInputValid(input) {
  const regex = /^[a-zA-Z\s]*$/;
  return regex.test(input);
}
function updateCityName(data) {
  if (data?.name) {
    cityElement.innerText = data.name;
  }
}
function updateDateDetails(data) {
  data.forEach((forecast, index) => {
    const date = new Date(forecast.date);
    const dayName = date.toLocaleString("en-US", { weekday: "long" });
    const monthName = date.toLocaleString("en-US", { month: "long" });
    const dayOfMonth = date.getDate();
    dayElements[index].innerText = dayName;
    if (index === 0) {
      monthElement.innerText = `${dayOfMonth} ${monthName}`;
    }
  });
}

function updateWeatherDetails(current, forecast) {
  temperatureElements[0].innerText = `${current.temp_c}°C`;
  temperatureElements[1].innerText = `${forecast[1].day.maxtemp_c}°C`;
  temperatureElements[2].innerText = `${forecast[2].day.maxtemp_c}°C`;
  iconElements[0].src = `http:${current.condition.icon}`;
  iconElements[1].src = `http:${forecast[1].day.condition.icon}`;
  iconElements[2].src = `http:${forecast[2].day.condition.icon}`;
  conditionTextElements[0].innerText = current.condition.text;
  conditionTextElements[1].innerText = forecast[1].day.condition.text;
  conditionTextElements[2].innerText = forecast[2].day.condition.text;
  predictedTemperatureElements[0].innerText = `${forecast[1].day.mintemp_c}°C`;
  predictedTemperatureElements[1].innerText = `${forecast[2].day.mintemp_c}°C`;
  weatherDetails[0].innerHTML = `<i class="fa-solid fa-umbrella fa-rotate-by" style="--fa-rotate-angle: 45deg"></i> ${current.humidity}%`;
  weatherDetails[1].innerHTML = `<i class="fa-solid fa-wind"></i> ${current.wind_kph} km/h`;
  const windDirections = {
    N: "North",
    NNE: "north-northeast",
    NE: "East",
    ENE: "east-northeast",
    E: "South",
    ESE: "east-southeast",
    SE: "West",
    SSE: "south-southeast",
    S: "South",
    SSW: "south-southwest",
    SW: "West",
    WSW: "west-southwest",
    W: "West",
    NNW: "north-northwest",
    WNW: "west-northwest ",
  };

  weatherDetails[2].innerHTML = `<i class="fa-solid fa-compass"></i> ${windDirections[current.wind_dir] || current.wind_dir}`;
}
inputSearch.addEventListener("input", (event) => {
  const searchValue = event.target.value;
  if (searchValue.length < 3) {
    return;
  }
  if (isInputValid(searchValue)) {
    fetchWeatherData(searchValue.trim());
    errorElement.innerText = "";
  } else {
    errorElement.innerText = "Invalid input. Please enter only city names.";
    errorElement.classList.add("text-danger");
  }
});

fetchWeatherData("Cairo");
