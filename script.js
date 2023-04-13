let apiKey = "fffd1dee7dc1225b9925321082352871";
const storedInput = JSON.parse(localStorage.getItem("searchHistory")) || [];
$(".searchButton").on("click", function () {
  var searchValue = $(".searchTerm").val();
  console.log(searchValue);
  geoCode(searchValue);
  storedInput.push(searchValue);
  localStorage.setItem("searchHistory", JSON.stringify(storedInput));
});

for (var i = 0; i < storedInput.length; i++) {
  var searchHistory = $("<button>")
    .text(storedInput[i])
    .addClass("searchHistory");
  $(".history").append(searchHistory);
}

$("#menu-toggle").click(function () {
  $("#popCol-9").show(1000);
});
$("#toggleClear").click(function () {
  $("#popCol-9").hide(500);
});

function geoCode(searchValue) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=${apiKey}`
  )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var searchHistory = $("<button>")
        .text(searchValue)
        .addClass("searchHistory");
      $(".history").append(searchHistory);
      currentWeather(data[0].lat, data[0].lon);
      weatherForecast(data[0].lat, data[0].lon);
    });
  
}
function currentWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      $("#currentWeather").empty();
      var date = $("<h1>").text(dayjs.unix(data.dt).format("MM/DD/YYYY"));
      var cityName = $("<h1>").text(data.name);
      var temp = $("<p>").text("temp, " + data.main.temp);
      var humitity = $("<p>").text("humitity, " + data.main.humidity);
      var windspeed = $("<p>").text("windspeed, " + data.wind.speed);
      var icon = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
      );
      $("#currentWeather").append(
        cityName,
        date,
        icon,
        temp,
        humitity,
        windspeed
      );
    });
}

function weatherForecast(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  )
    .then(response => response.json())
    .then(data => {
      console.log("5 Day", data);
      $("#forecast").empty();
      for (var i = 4; i < data.list.length; i = i + 8) {
        var forecastCard = $("<div>").addClass("card");
        var date = $("<h5>").text(
          dayjs.unix(data.list[i].dt).format("MM/DD/YYYY")
        );
        var temp = $("<p>").text("temp, " + data.list[i].main.temp);
        var humitity = $("<p>").text("humitity, " + data.list[i].main.humidity);
        var windspeed = $("<p>").text("windspeed, " + data.list[i].wind.speed);
        var icon = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/w/" +
            data.list[i].weather[0].icon +
            ".png"
        );
        icon.addClass("icon");
        forecastCard.append(date, icon, temp, humitity, windspeed);
        $("#forecast").append(forecastCard);
      }
    });
}

geoCode("Honolulu");

//  $("#menu-toggle").click(function(){
//  $("#popCol-9").show(1000);
//  $("geoCode").click(function(){
//  $("#popCol-9").show(1000);
//});

function clearData() {
  document.querySelector(".searchTerm").value = "";
  localStorage.removeItem("searchHistory");
  document.querySelector(".history").innerHTML = "";
  document.querySelector("#currentWeather").innerHTML = "";
  document.querySelector("#forecast").innerHTML = "";
}

document.querySelector(".clearDataButton").addEventListener("click", clearData);
