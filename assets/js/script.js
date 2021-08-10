//Map box Access token: pk.eyJ1IjoidHJhaWxmaW5kZXIyMDIxIiwiYSI6ImNrcndyMTRsMjBqYWgydnIwb3lvOWRobGcifQ.lgOoEmg6MS5cXr21WZOSxw
//OpenWeather Onecall API Key : d74649d085e772a2cff36556b7a6a792
var listContainerEl = document.getElementById("listContainer")
var butnSearchEl = document.querySelector(".mainbutton");
var WeatherParametersEl = document.querySelector("#WeatherParameters");
var formMsg = document.querySelector("#formMsg");
var redirectUrl = '404.html';
var mapUrl = 'page2.html';
var citiesArray = [];


document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });
/**
 * Local storage retrevial
 */
function initilizeProgram() { 
    var citiesLocal = JSON.parse(localStorage.getItem("citiesLocal"));
    if (citiesLocal !== null) {
        citiesArray = citiesLocal;
    }
}

function switchPages() {
    document.location.replace(mapUrl);
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

/**
 *Function passes users input from index to page2
 *https://stackoverflow.com/questions/17502071/transfer-data-from-one-html-file-to-another
 * @param {*} event - click event
 * @param {*} cityId - string value of city name typed
 */
function searchTrail(event){
    event.preventDefault();

    let locationName = document.querySelector('#navCity');
    if (locationName.value === "") {
        displayMessage("error", "No location given. Please enter a location!!");
        return;
    }else {
        let mapURLLocation = mapUrl+'?locationName='+ encodeURIComponent(locationName.value);
        document.location.href = mapURLLocation;
    }
}

function searchTrailMobile(event){
    event.preventDefault();

    let locationName = document.querySelector('#navCity-mobile');
    if (locationName === "") {
        displayMessage("error", "No location given. Please enter a location!!");
        return;
    }else {
        let mapURLLocation = mapUrl+'?locationName='+ encodeURIComponent(locationName.value);
        document.location.href = mapURLLocation;
    }
}

 // creating a function for Form messages
 function displayMessage(type, message) {
    formMsg.textContent = message;
    formMsg.setAttribute("class", type);
}


//On page load start
initilizeProgram();








