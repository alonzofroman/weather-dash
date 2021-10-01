//Call API for geocode
// http://api.openweathermap.org/geo/1.0/direct?q= {city name},{state code},{country code} &limit={limit} &appid=f4fa96020f2282301cd8312fc675da98
// https://api.openweathermap.org/data/2.5/onecall?lat= {lat} &lon= {lon}&exclude={part} &appid={API key}

//Variables to construct API requests
var geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=';
var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
var lonPar = '&lon=';
var searchLimit = '&limit=1';
var inFar ='&units=imperial'
var apiKey = '&appid=f4fa96020f2282301cd8312fc675da98';
var geoLat = [];
var geoLon = []; 

//When search button is clicked, search for that city
$("#search-button").click(function(){
    var cityName = $("#search-bar").val().trim();

    $.ajax({
        url: geoUrl + cityName + searchLimit + apiKey,
        method: 'GET',
        datatype: 'JSON',
    }).then(function(geoData){
        geoLat.length = 0;
        geoLon.length = 0;
    
        geoLat.push(geoData[0].lat);

        geoLon.push(geoData[0].lon);
    }).then(function(){
        
        $.ajax({
            url: oneCallUrl + geoLat + lonPar + geoLon + inFar + apiKey,
            method: 'GET',
        }).then(function(oneData){
            var currentTemp = oneData.current.temp;
            var currentHumid = oneData.current.humidity;
            var currentWind = oneData.current.wind_speed;
            var currentUvi = oneData.current.uvi;

            $("#city-today").append(cityName);
            $("#temp-today").append(currentTemp);
            $("#humid-today").append(currentHumid);
            $("#wind-today").append(currentWind);
            $("#uvi-today").append(currentUvi);
            
        })
    })

})