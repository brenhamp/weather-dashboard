function weatherDashboard {
    //define HTML elements
    city = document.getElementById("city-input");
    search = document.getElementById("search-button");
    clear = document.getElementById("clear-history");
    cityName = document.getElementById("city-name");
    sky = document.getElementById("sky");
    temp = document.getElementById("temperature");
    humidity = document.getElementById("humidity");
    wind = document.getElementById("wind-speed");
    UV = document.getElementById("UV-index");
    history = document.getElementById("history");
    forecast = document.getElementById("fiveday-header");
    var todayweatherEl = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
}