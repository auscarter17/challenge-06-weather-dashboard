const apiKey = "744a9764e2e344e5caf523b79e9bef07"
var city = "";
var cityLat = "";
var cityLon = "";
var searchHistoryEl = document.querySelector("#search-history");
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityname");
var weatherContainerEl = document.querySelector("#weather-container");
var citySearchTerm = document.querySelector("#city-search-term");
var citySearchRecord = JSON.parse(localStorage.getItem(city)) || [];
var futureContainer = document.querySelector("#future-container");
var forecastTitle = document.querySelector("#forecast");
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
  temperatureEl.textContent = "Temperature: " + Math.round(weather.main.temp) + " °F";
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
  weatherContainerEl.appendChild(uvIndexEl);
}

var formSubmitHandler = function(event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();

  if (city) {
    getWeather(city);
    getFuture(city);
    savedCities(city);
    cityInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

var getFuture = function(city){
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

  fetch(apiURL)
  .then(function(response){
      response.json().then(function(data){
         displayFuture(data);
      });
  });
};

var displayFuture = function(weather){
  futureContainer.textContent = "";
  forecastTitle.textContent = "5-Day Forecast:";

  var forecast = weather.list;
      for(var i=5; i < forecast.length; i=i+8){
     var dailyForecast = forecast[i];
      
     
     var forecastEl=document.createElement("div");
     forecastEl.classList = "card bg-primary text-light m-2";


     var forecastDate = document.createElement("h5")
     forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
     forecastDate.classList = "card-header text-center"
     forecastEl.appendChild(forecastDate);

     
     var weatherIcon = document.createElement("img")
     weatherIcon.classList = "card-body text-center";
     weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

     forecastEl.appendChild(weatherIcon);
     
     var forecastTempEl=document.createElement("span");
     forecastTempEl.classList = "card-body text-center";
     forecastTempEl.textContent = dailyForecast.main.temp + " °F";

      forecastEl.appendChild(forecastTempEl);

     var forecastHumEl=document.createElement("span");
     forecastHumEl.classList = "card-body text-center";
     forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

    forecastEl.appendChild(forecastHumEl);

    futureContainer.appendChild(forecastEl);
  }

}

var savedCities = function(city) {
  var pastCities = document.createElement("li");
  searchHistoryEl.appendChild(pastCities);

  pastCities.innerHTML = `<button class='"btn btn-block"'> ${city} </button>`
  var userSearch = {
    citySearch: city
  };
  citySearchRecord.push(userSearch);
  localStorage.setItem("city", JSON.stringify(userSearch));

  $(".pastCities").on("click", function() {
    localStorage.getItem($(this).text());

    var city = $(this)
      .text()
      .trim();

    getWeather(city);
  });
};


cityFormEl.addEventListener("submit", formSubmitHandler);

