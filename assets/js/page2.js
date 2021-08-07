mapboxgl.accessToken = "pk.eyJ1IjoidHJhaWxmaW5kZXIyMDIxIiwiYSI6ImNrcndyMTRsMjBqYWgydnIwb3lvOWRobGcifQ.lgOoEmg6MS5cXr21WZOSxw";

var butnSearchEl = document.querySelector(".mainbutton");
var WeatherParametersEl = document.querySelector("#WeatherParameters");
var listContainerEl = document.getElementById("listContainer")
var imageContainerEl = document.getElementById("imageContainer")
var cityButtonList = document.getElementById("recentSearchesCity");
var formMsg = document.querySelector("#formMsg");
var redirectUrl = '404.html';
var mapUrl = 'page2.html';
var citiesArray = []; //object array for pulling out of local storage elements
var map; //object that has to be inialized by function setUpMap

//Navbar mobile functionality
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

function initilizeProgram() {
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
function searchTrail(event, cityId) {
    event.preventDefault();

    var cityEl = document.getElementById(cityId).value;
    if (cityEl === "") {
        displayMessage("error", "Please enter a City !!");
        return;
    } else {
        //prevents duplicate cities
        if (citiesArray.includes(cityEl) === false) {
            citiesArray.push(cityEl);
            localStorage.setItem("citiesLocal", JSON.stringify(citiesArray));
        }
        //going to call a function for displaying the local storage data
        viewCities();
        getWeatherInfo(cityEl);
    }
}


function getWeatherInfo(cityEl) {
    var apiurl = "https://api.openweathermap.org/data/2.5/weather?q= " + cityEl + "&appid=d74649d085e772a2cff36556b7a6a792";
    fetch(apiurl)
        .then(function (response) {
            if (response.status === 404) {
                document.location.replace(redirectUrl);
            } else {
                return response.json();
            }
        })
        .then(function (data) {
            var day = moment().format("M/D/YYYY");  //Used Moment.js for dispalying the date
            var temp = Math.round((((data.main.temp) - 273.15) * 1.8) + 32);
            WeatherParametersEl.textContent = "Today's Weather - " + day + ": Temperature: " + temp + "°F, Humidity: " + data.main.humidity + " % , Wind: " + data.wind.speed + " MPH";
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            //ATTENTION: First parameter will be LONGITUDE then Latitude
            setUpMap([lon, lat]);
            //showMarker(lon,lat);
            listTrailfinder(lon, lat);
        })
}

// creating a function for Form messages
function displayMessage(type, message) {
    formMsg.textContent = message;
    formMsg.setAttribute("class", type);
}


function setUpMap(center) {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 8
    });
}

function listTrailfinder(lon, lat) {
    //Clear earlier results
    listContainerEl.innerHTML = "";
    imageContainerEl.innerHTML = "";

    var mapListURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/trail.json?proximity=" + lon + "," + lat + "&access_token=pk.eyJ1IjoidHJhaWxmaW5kZXIyMDIxIiwiYSI6ImNrcndyMTRsMjBqYWgydnIwb3lvOWRobGcifQ.lgOoEmg6MS5cXr21WZOSxw&limit=2";
    var searchTrailResult;
    fetch(mapListURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            searchTrailResult = data;
            console.log("trails list: ", searchTrailResult);
            console.log("data length :", searchTrailResult.features.length);
            

            //  console.log("trails list: ", data);
            //  console.log("data length :", data.features.length);

            for (var i = 0; i < searchTrailResult.features.length; i++) {
                var card = document.createElement("div");
                card.textContent = searchTrailResult.features[i].place_name;
                listContainerEl.appendChild(card);

                const marker2 = new mapboxgl.Marker({ color: 'blue' })
                    .setLngLat(searchTrailResult.features[i].geometry.coordinates)
                    .addTo(map);
            }

            listTrailImages(searchTrailResult)
        });

        
    }

function listTrailImages(searchTrailResult){

    for (var i = 0; i < searchTrailResult.features.length; i++) {
        //Fetch the image of each trail result by calling Serpapi
        var imgSearchText = searchTrailResult.features[i].place_name;
        console.log(imgSearchText);
        var imageSearchUrl = "https://serpapi.com/search.json?q=" + imgSearchText + "&tbm=isch&ijn=0&api_key=d6db6046a49d044c851ae398fe7e90ecf61ede5961a226a8129f43fb2de747c3";
        fetch(imageSearchUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function(data) {
                console.log('entered serp response');
                var imageResult = data.images_results[0];

                var card = document.createElement('div');
                card.setAttribute("class","card");

                var cardName = document.createElement('div');
                cardName.setAttribute("class","card header");
                cardName.textContent = searchTrailResult.features[imageContainerEl.children.length].place_name;
                card.appendChild(cardName);

                var img = document.createElement('img');
                img.src = imageResult.thumbnail;
                card.appendChild(img);

                imageContainerEl.appendChild(card);
                
            });
    // Getting ERROR
    // Access to fetch at 'https://serpapi.com/search.json?q=Bayshore%20Fitness%20Walk,%20344%20Bayshore%20Blvd,%20Tampa,%20Florida%2033606,%20United%20States&tbm=isch&ijn=0&api_key=d6db6046a49d044c851ae398fe7e90ecf61ede5961a226a8129f43fb2de747c3' 
    // from origin 'http://localhost:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. 
    // If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
    // Added chrome extension Allow CORS for time being. We need to find a permanent solution for this.

    }
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
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

initilizeProgram();
viewCities();










