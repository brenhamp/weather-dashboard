function weatherDashboard() {
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
    forecast = document.getElementById("five-day-forecast");
    todaysWeather = document.getElementById("todays-weather");
    //my API key from OpenWeather
    apiKey = "4f9f2b98f7dbd0bd303f0561775c2890";

    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
        axios.get(queryURL)
        .then(function(response) {
            todaysWeather.classList.remove("d-none");

            currentDate = new Date(response.data.dt * 1000);
            day = currentDate.getDate();
            month = currentDate.getMonth() + 1;
            year = currentDate.getYear();

            cityName.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year +")";

            let weatherPic = response.data.weather[0].icon;
            sky.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            sky.setAttribute("alt", response.data.weather[0].description);
            temp.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
            humidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            wind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

            console.log(response);

            let lat = response.data.coord.lat;
            let lon = response.data.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            axios.get(UVQueryURL)
                .then(function (response) {
                    let UVIndex = document.createElement("span");
                    
                    // When UV Index is good, shows green, when ok shows yellow, when bad shows red
                    if (response.data[0].value < 4 ) {
                        UVIndex.setAttribute("class", "badge badge-success");
                    }
                    else if (response.data[0].value < 8) {
                        UVIndex.setAttribute("class", "badge badge-warning");
                    }
                    else {
                        UVIndex.setAttribute("class", "badge badge-danger");
                    }
                    console.log(response.data[0].value)
                    UVIndex.innerHTML = response.data[0].value;
                    currentUVEl.innerHTML = "UV Index: ";
                    currentUVEl.append(UVIndex);
        })
    getWeather(cityName);    
    });

    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];


};
}
weatherDashboard ();