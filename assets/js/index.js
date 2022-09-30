function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);

        const coords = position.coords;
        getTemperatureByLocation(coords.latitude, coords.longitude);
      },
      (error) => {
        console.log(error);
        getUserIPAddress();
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    getUserIPAddress();
  }
}
getUserLocation();

function getTemperatureByLocation(latitude, longitude) {
  const appId = "dbf88648da8ef835a23c0890f789becf";
  const url = "https://api.openweathermap.org/data/2.5/weather";

  axios({
    method: "get",
    url,
    params: {
      lat: latitude,
      lon: longitude,
      appid: appId,
      units: "metric", // get value in deg celsius
    },
  })
    .then((value) => {
      console.log(value);
      displayTemperature(value.data);
    })
    .catch((error) => console.error(error));
}

function getUserIPAddress() {
  axios({
    url: "https://ipinfo.io",
    method: "get",
    params: {
      token: "c403ed380e7023",
    },
  })
    .then((value) => {
      console.log(value);
      const location = value.data.loc;

      const latAndLong = location.split(",");
      getTemperatureByLocation(latAndLong[0], latAndLong[1]);
    })
    .catch((error) => console.error(error));
}

function displayTemperature(tempDetails) {
  const weatherImg = document.querySelector(".weather-image i");
  const city = document.querySelector(".city-name");
  const country = document.querySelector(".country");
  const desc = document.querySelector(".description");
  const temperature = document.querySelector(".temp-data");

  const tempDescription = tempDetails.weather[0].description;
  const weatherIcon = tempDetails.weather[0].icon;
  const isDay = weatherIcon.includes("d");

  city.textContent = `${tempDetails.name},`;
  country.textContent = tempDetails.sys.country;
  desc.textContent = tempDescription;
  temperature.textContent = Math.round(tempDetails.main.temp);

  switch (tempDescription) {
    case "clear sky":
      if (isDay) {
        weatherImg.classList.add("wi-day-sunny");
      } else {
        weatherImg.classList.add("wi-night-clear");
      }
      break;

    case "few clouds":
      if (isDay) {
        weatherImg.classList.add("wi-day-cloudy");
      } else {
        weatherImg.classList.add("wi-night-alt-cloudy");
      }
      break;

    case "scattered clouds":
      weatherImg.classList.add("wi-cloud");
      break;

    case "broken clouds":
    // weatherImg.classList.add('wi-cloudy')
    // break;
    case "overcast clouds":
      weatherImg.classList.add("wi-cloudy");
      break;

    case "light rain":
    case "very heavy rain":
    case "heavy intensity rain":
    case "extreme rain":
    case "moderate rain":
      if (isDay) {
        weatherImg.classList.add("wi-day-showers");
      } else {
        weatherImg.classList.add("wi-night-alt-showers");
      }
      break;

    case "shower rain":
      weatherImg.classList.add("wi-showers");
      break;

    case 'thunderstorm':
    case 'heavy thunderstorm':
      if (isDay) {
        weatherImg.classList.add("wi-day-lightning");
      } else {
        weatherImg.classList.add("wi-night-alt-lightning");
      }
      break;

    case 'thunderstorm with light rain':
    case 'thunderstorm with rain':
    case 'thunderstorm with heavy rain':
      weatherImg.classList.add('wi-storm-showers')
      break;

    default:
      break;
  }
}

function convertCelsiusToFahrenheit() {
  let initialDegreeCelsius = ''

  document.querySelector('.description-wrap-2 .temp-unit')
    .addEventListener('click', (event) => {
      const tempData = document.querySelector('.temp-data');
      const degCelsiusInt = parseInt(tempData.textContent); //29

      event.target.classList.toggle('temp-convert')

      if (event.target.classList.contains('temp-convert'))  {
        event.target.textContent = 'F'
        const fResult = Math.round(((degCelsiusInt * 9) / 5)  + 32);
        initialDegreeCelsius = tempData.textContent //29
        tempData.textContent = fResult;
      } else {
        event.target.textContent = 'C'
        tempData.textContent = initialDegreeCelsius
      }
    })
}

convertCelsiusToFahrenheit()
