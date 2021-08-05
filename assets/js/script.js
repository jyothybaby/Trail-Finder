document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });


//OpenWeather Onecall API Key : d74649d085e772a2cff36556b7a6a792
var butnSearchEl = document.querySelector(".mainbutton");
WeatherParametersEl= document.querySelector("#WeatherParameters");
var redirectUrl = '404.html';
var citiesArray = [];

function initilizeProgram() {
    document.getElementById("page-2").style.setProperty("display", "none"); 
 // Local storage Actovitie starts from here...............   
    //initialize cities from local storage
    var citiesLocal = JSON.parse(localStorage.getItem("citiesLocal"));
    if (citiesLocal !== null) {
        citiesArray = citiesLocal;
    }
}

function viewCities() {
    var citiesLocal = JSON.parse(localStorage.getItem("citiesLocal"));
    if (citiesLocal !== null) {
        citiesArray = citiesLocal;
        console.log("citiesArray", citiesArray)
        displayCities();
    }

}
var cityButtonList = document.getElementById("recentSearchesCity");

function displayCities() {
    cityButtonList.innerHTML = "";
    for (var i = 0; i < citiesArray.length; i++) {
        var city = citiesArray[i];
        var cityButton = document.createElement("li");
        cityButton.textContent = city;
        cityButtonList.appendChild(cityButton);
        
    }
}

//Clearing the local storage
function clearCities() {
    localStorage.removeItem("citiesLocal");
    citiesArray = [];
    cityButtonList.innerHTML = "";
}
// local storage process till here.............
function searchTrail(event, cityId){
    event.preventDefault();
    
    var cityEl = document.getElementById(cityId).value;
    if (cityEl === "") {
        displayMessage("error", "Please enter a City !!");
        return;
    } else {
        citiesArray.push(cityEl);
        localStorage.setItem("citiesLocal", JSON.stringify(citiesArray));
        //going to call a function for displaying the local storage data
        viewCities();
        document.getElementById("homePage").style.setProperty("display", "none");
        document.getElementById("page-2").style.setProperty("display", "block");
        getWeatherInfo(cityEl);
    }
    
}

function getWeatherInfo(cityEl) {
    var apiurl = "https://api.openweathermap.org/data/2.5/weather?q= " + cityEl + "&appid=d74649d085e772a2cff36556b7a6a792"; 
    fetch(apiurl)
    .then(function(response){
        if (response.status === 404) {
            document.location.replace(redirectUrl); 
        } else {
            return response.json();
        }
    })
    .then (function (data){
        console.log(data);
        var day = moment().format("M/D/YYYY");  //Used Moment.js for dispalying the date
        var temp = Math.round((((data.main.temp) - 273.15) * 1.8) + 32);
        console.log("Temp", temp);
        WeatherParametersEl.textContent = "Today's Weather - "+ day+": "+ "Temperature: "+ temp+ " "+ "F" + ", " + "Humidity: " + data.main.humidity + " " + "%"+ ", " + "Wind: "+  data.wind.speed + " " + "MPH";
      
    })
}
var formMsg = document.querySelector("#formMsg");

// creating a function for Form messages
function displayMessage(type, message) {
    formMsg.textContent = message;
    formMsg.setAttribute("class", type);
}


/**
 * This initializes the modal window to open when triggered
 *
* Options for the modal
* @member Modal#options
* @prop {Number} [opacity=0.5] - Opacity of the modal overlay
* @prop {Number} [inDuration=250] - Length in ms of enter transition
* @prop {Number} [outDuration=250] - Length in ms of exit transition
* @prop {Function} onOpenStart - Callback function called before modal is opened
* @prop {Function} onOpenEnd - Callback function called after modal is opened
* @prop {Function} onCloseStart - Callback function called before modal is closed
* @prop {Function} onCloseEnd - Callback function called after modal is closed
* @prop {Boolean} [dismissible=true] - Allow modal to be dismissed by keyboard or overlay click
* @prop {String} [startingTop='4%'] - startingTop
* @prop {String} [endingTop='10%'] - endingTop
*/
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

initilizeProgram();








