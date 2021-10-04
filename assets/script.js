//Call API for geocode
// http://api.openweathermap.org/geo/1.0/direct?q= {city name},{state code},{country code} &limit={limit} &appid=f4fa96020f2282301cd8312fc675da98
// https://api.openweathermap.org/data/2.5/onecall?lat= {lat} &lon= {lon}&exclude={part} &appid={API key}

//Variables to construct API requests
const geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=';
const oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
const lonPar = '&lon=';
const searchLimit = '&limit=1';
const inFar ='&units=imperial'
const apiKey = '&appid=f4fa96020f2282301cd8312fc675da98';

//Empty arrays to fill with variables and empty later
var geoLat = [];
var geoLon = []; 
var cityName = [];
var cityHistory = [];

//When search button is clicked, generate variables to search for that city

$("#search-button").click(function() {

    cityName.length = 0;
    cityName.push($("#search-bar").val().trim());
    
    grabCityList();
    
    cityHistory.unshift(cityName); 
    setCityList();
    renderHistoryButtons();
    // console.log(localStorage.getItem("city-names"));
    secondStep();
})


//Function to gather city history from local storage
function grabCityList() {
    if (localStorage.getItem("city-names") !== null) {
        cityHistory.length = 0;
    cityHistory = JSON.parse(localStorage.getItem("city-names"));
    }
}

//Function to store city history
function setCityList() {
    if (cityHistory !== null) {
        localStorage.setItem('city-names', JSON.stringify(cityHistory));
    }
    if (cityHistory.length > 6) {
        cityHistory.pop();
    }
}

//Create and append city history buttons
function renderHistoryButtons() {
    $("#saved-cities").empty();
    for (i=0; i<cityHistory.length && i<6;  i++) {
        var newButton = $('<button/>', {
            class: 'btn btn-outline-secondary w=100',
            type: 'button',
            id: 'history-button',
            value: cityHistory[i],
            text: cityHistory[i],
        })
        //Add button to page
        $("#saved-cities").append(newButton);
    }
}

//Function to use history buttons to search
$(document).on("click", "#history-button", function() {
    console.log("button is clicked");
    cityName.length = 0;
    cityName.push($(this).val());
    secondStep();
})


//Gather local storage on page refresh
$(document).ready(function(){
    if (localStorage.getItem("city-names") !== null) {
        grabCityList();
        renderHistoryButtons();        
    }
})

// After lat and lon are generated, perform One Call API request
function secondStep() {
    //After city name is entered, find lat and lon
    $.ajax({
        url: geoUrl + cityName + searchLimit + apiKey,
        method: 'GET',
        datatype: 'JSON',
    })
    
    .done(function(geoData){
        geoLat.length = 0;
        geoLon.length = 0;
        geoLat.push(geoData[0].lat);
        geoLon.push(geoData[0].lon);

    }).then(function(){
        
        //With lat and lon variables, find the city from the city name search in One Call API
        $.ajax({
            url: oneCallUrl + geoLat + lonPar + geoLon + inFar + apiKey,
            method: 'GET',
        }).fail(function() {
            alert("Incorrect entry, please ensure proper spelling of city, and correct state and country codes");
            return;
        }) 
        
        .done(function(oneData){
            var currentTemp = oneData.current.temp;
            var currentHumid = oneData.current.humidity;
            var currentWind = oneData.current.wind_speed;
            var currentUvi = oneData.current.uvi;
            console.log(oneData);

            //Add current weather data from API call to the weather dashboard
            $("#city-today").text(cityName);
            $("#temp-today").text('Temperature: ' + currentTemp);
            $("#humid-today").text('Humidity: ' + currentHumid);
            $("#wind-today").text('Wind Speed: ' + currentWind);
            $("#uvi-today").text(currentUvi);

            renderCurrentDate();
            

            //uvi background color
            if (currentUvi < 3) {
                $("#uvi-today").css("background-color", "green");
            }
            else if (currentUvi > 3 && currentUvi > 6) {
                $("#uvi-today").css("background-color", "yellow");
            }
            else if(currentUvi > 6 && currentUvi < 8) {
                $("#uvi-today").css("background-color", "orange");
            }
            else if (currentUvi > 8 && currentUvi < 11) {
                $("#uvi-today").css("background-color", "red");
            }
            else if (currentUvi > 11) {
                $("#uvi-today").css("background-color", "purple");
            }
            
            //Function to render icons
            var todayIcon = oneData.current.weather[0].icon;
            // console.log(todayIcon);
            todayIconUrl = "http://openweathermap.org/img/w/" + todayIcon + ".png";
            // console.log(todayIconUrl);
            $("#today-icon").attr('src', todayIconUrl, 'alt', "weather icon");

            var day1Icon = oneData.daily[1].weather[0].icon;
            day1IconUrl =  "http://openweathermap.org/img/w/" + day1Icon + ".png";
            $("#day1Icon").attr('src', day1IconUrl, 'alt', "weather icon");

            var day2Icon = oneData.daily[2].weather[0].icon;
            day2IconUrl =  "http://openweathermap.org/img/w/" + day2Icon + ".png";
            $("#day2Icon").attr('src', day2IconUrl, 'alt', "weather icon");

            var day3Icon = oneData.daily[3].weather[0].icon;
            day3IconUrl =  "http://openweathermap.org/img/w/" + day3Icon + ".png";
            $("#day3Icon").attr('src', day3IconUrl, 'alt', "weather icon");

            var day4Icon = oneData.daily[4].weather[0].icon;
            day4IconUrl =  "http://openweathermap.org/img/w/" + day4Icon + ".png";
            $("#day4Icon").attr('src', day4IconUrl, 'alt', "weather icon");

            var day5Icon = oneData.daily[5].weather[0].icon;
            day5IconUrl =  "http://openweathermap.org/img/w/" + day5Icon + ".png";
            $("#day5Icon").attr('src', day5IconUrl, 'alt', "weather icon");


            //Display temp and humidity for next day
            var day1Temp = oneData.daily[1].temp.day;
            var day1Humid = oneData.daily[1].humidity;
            $("#day1temp").text('Temp: ' + day1Temp);
            $("#day1humid").text('Humidity: ' + day1Humid);
            $("#day1").css('background-color', "lightblue");

            //Two days ahead
            var day2Temp = oneData.daily[2].temp.day;
            var day2Humid = oneData.daily[2].humidity;
            $("#day2temp").text('Temp: ' + day2Temp);
            $("#day2humid").text('Humidity: ' + day2Humid);
            $("#day2").css('background-color', "lightblue");

            //Three days ahead
            var day3Temp = oneData.daily[3].temp.day;
            var day3Humid = oneData.daily[3].humidity;
            $("#day3temp").text('Temp: ' + day3Temp);
            $("#day3humid").text('Humidity: ' + day3Humid);
            $("#day3").css('background-color', "lightblue");

            //Four days ahead
            var day4Temp = oneData.daily[4].temp.day;
            var day4Humid = oneData.daily[4].humidity;
            $("#day4temp").text('Temp: ' + day4Temp);
            $("#day4humid").text('Humidity: ' + day4Humid);
            $("#day4").css('background-color', "lightblue");

            //Five days ahead
            var day5Temp = oneData.daily[5].temp.day;
            var day5Humid = oneData.daily[5].humidity;
            $("#day5temp").text('Temp: ' + day5Temp);
            $("#day5humid").text('Humidity: ' + day5Humid);
            $("#day5").css('background-color', "lightblue");
        })
    })
}

//Function to render dates

function renderCurrentDate() {
    var currentDate = moment();
    $("#date-today").text("(" + currentDate.format('L') + ")")

    var date1 = currentDate.clone().add(1, 'days');
    $("#day1date").text(date1.format('L'));

    var date2 = currentDate.clone().add(2, 'days');
    $("#day2date").text(date2.format('L'));

    var date3 = currentDate.clone().add(3, 'days');
    $("#day3date").text(date3.format('L'));

    var date4 = currentDate.clone().add(4, 'days');
    $("#day4date").text(date4.format('L'));

    var date5 = currentDate.clone().add(5, 'days');
    $("#day5date").text(date5.format('L'));
}



