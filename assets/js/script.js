const apiKey = "744a9764e2e344e5caf523b79e9bef07"
var city = "";
var cityLat = "";
var cityLon = "";
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityname");
var weatherContainerEl = document.querySelector("#weather-container");
var citySearchTerm = document.querySelector("#city-search-term");

// https://api.openweathermap.org/data/2.5/weather?q=atlanta&units=imperial&appid=744a9764e2e344e5caf523b79e9bef07

var getWeather = function(city) {
  // format the openweather url
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
  fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
        response.json().then(function(data) {
            // pass response data to dom function
            console.log(data);
            displayWeather(data, city);
        });
    }
    else {
        alert("There was a problem with your request!");
    }
  });
}
    
var displayWeather = function (weather, searchCity) {
  
  weatherContainerEl.textContent = "";
  citySearchTerm.textContent = searchCity;

  var currentDate = document.createElement("span")
  currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  citySearchTerm.appendChild(currentDate);

  var weatherIcon = document.createElement("img")
  weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
  citySearchTerm.appendChild(weatherIcon);

  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
  temperatureEl.classList = "list-group-item"
 
  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item"

  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windSpeedEl.classList = "list-group-item"

  weatherContainerEl.appendChild(temperatureEl);

  weatherContainerEl.appendChild(humidityEl);

  weatherContainerEl.appendChild(windSpeedEl);

  var cityLat = weather.coord.lat;
  var cityLon = weather.coord.lon;
  getUvData(cityLat,cityLon)
}



var getUvData = function(cityLat,cityLon) {
  // use API to find latitude/longitude of searched city
    
    var apiUvUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + apiKey + "&cnt=1";
    
    fetch(apiUvUrl)
    .then(function(response) {
      response.json().then(function(data){
        displayUvIndex(data)
      });
    });
} 
    
var displayUvIndex = function(data) {
  var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"
        
    uvIndexSig = document.createElement("span")
    uvIndexSig.textContent = data[0].value;
        
    console.log(data[0].value);

    if(data[0].value <=2){
    uvIndexSig.classList = "favorable"
        
    }else if(data[0].value >2 && data[0].value<=8){
    uvIndexSig.classList = "moderate "
    
    }else if(data[0].value >8){
    uvIndexSig.classList = "severe"
    };
  

  uvIndexEl.appendChild(uvIndexSig);
  //append index to current weather
  weatherContainerEl.appendChild(uvIndexEl);
}

var formSubmitHandler = function(event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();

  if (city) {
    getWeather(city);
    cityInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};



cityFormEl.addEventListener("submit", formSubmitHandler);
