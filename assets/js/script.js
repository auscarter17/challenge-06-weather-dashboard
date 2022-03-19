const apiKey = "744a9764e2e344e5caf523b79e9bef07"
var city = ""
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
            displayWeather(data);
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

  

  
  //citySearchTerm.textContent = city;
  //var tempCurrent = (data.main.temp);




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
