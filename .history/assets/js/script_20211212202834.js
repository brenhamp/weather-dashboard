function weatherDashboard() {
    //define HTML elements
const city = document.getElementById("city-input");
const search = document.getElementById("search-button");
const clear = document.getElementById("clear-history");
const name = document.getElementById("city-name");
const sky = document.getElementById("sky");
const temp = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const UV = document.getElementById("UV");
const history = document.getElementById("history");
const forecast = document.getElementById("five-day-forecast");
const todaysWeather = document.getElementById("todays-weather");
    //my API key from OpenWeather
    apiKey = "4f9f2b98f7dbd0bd303f0561775c2890";
    
    //function to contain all API requests
    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + apiKey;
        axios.get(queryURL)
        .then(function(response) {
            todaysWeather.classList.remove("d-none");
            
            //retrieve current date for displaying
            currentDate = new Date(response.data.dt * 1000);
            day = currentDate.getDate();
            month = currentDate.getMonth() + 1;
            year = currentDate.getFullYear();

            name.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year +")";
            
            //display today's weather including sky icon, temp, humidity and wind speed
            let skyImg = response.data.weather[0].icon;
            sky.setAttribute("src", "https://openweathermap.org/img/wn/" + skyImg + "@2x.png");
            sky.setAttribute("alt", response.data.weather[0].description);
            temp.innerHTML = "Temperature: " + response.data.main.temp + " &#176F";
            humidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            wind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

            //get UV index using latitude and longitude
            let lat = response.data.coord.lat;
            let lon = response.data.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + apiKey + "&cnt=1";
            axios.get(UVQueryURL)
                .then(function (response) {
                    //use span for HTML convenience
                    let UVIndex = document.createElement("span");
                    
                    //change color to indicate mild/moderate/severe UV levels
                    if (response.data[0].value < 4 ) {
                        UVIndex.setAttribute("class", "badge badge-success");
                    }
                    else if (response.data[0].value < 8) {
                        UVIndex.setAttribute("class", "badge badge-warning");
                    }
                    else {
                        UVIndex.setAttribute("class", "badge badge-danger");
                    }
                    UVIndex.innerHTML = response.data[0].value;
                    UV.innerHTML = "UV Index: ";
                    UV.append(UVIndex);
        });

           //five-day forecast
           let cityID = response.data.id;
           let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial" + "&appid=" + apiKey;
           axios.get(forecastQueryURL)
               .then(function (response) {
                   forecast.classList.remove("d-none");

                       //  Parse response to display forecast for next 5 days
                       const forecastEls = document.querySelectorAll(".forecast");
                       for (i = 0; i < forecastEls.length; i++) {
                           forecastEls[i].innerHTML = "";
                           const forecastIndex = i * 8 + 4;
                           const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                           const forecastDay = forecastDate.getDate();
                           const forecastMonth = forecastDate.getMonth() + 1;
                           const forecastYear = forecastDate.getFullYear();
                           const forecastDateEl = document.createElement("p");
                           forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                           forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                           forecastEls[i].append(forecastDateEl);

                           // Icon for current weather
                           const forecastWeatherEl = document.createElement("img");
                           forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                           forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                           forecastEls[i].append(forecastWeatherEl);
                           const forecastTempEl = document.createElement("p");
                           forecastTempEl.innerHTML = "Temp: " + response.data.list[forecastIndex].main.temp + " &#176F";
                           forecastEls[i].append(forecastTempEl);
                           const forecastHumidityEl = document.createElement("p");
                           forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                           forecastEls[i].append(forecastHumidityEl);
                       }
                    })
    });
}

    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    
    function renderSearchHistory () {
        history.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyEl = document.createElement("input");
            Object.assign(historyEl, {
                type: "text",
                readonly: true,
                class: "form-control",
                value: searchHistory[i],
            });
            historyEl.addEventListener("click", function() {
                getWeather(historyEl.value);
            })
            history.append(historyEl);
        }
    }

    renderSearchHistory();

    search.addEventListener("click", "enter",  function () {
        searchTerm = city.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    clear.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })


};

weatherDashboard ();