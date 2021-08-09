mapboxgl.accessToken = "pk.eyJ1IjoiYWRhbS1uaWdnZWJydWdnZSIsImEiOiJja3JzMXN1M2EwaHJoMzF1aHRsNnh3ejNiIn0.qgb2dKPkqB5Lx5iukcDSdA";

var butnSearchEl = document.querySelector(".mainbutton");
var WeatherParametersEl = document.querySelector("#WeatherParameters");
var listContainerEl = document.getElementById("listContainer")
var imageContainerEl = document.getElementById("imageContainer")
var cityButtonList = document.getElementById("recentSearchesCity");
var formMsg = document.querySelector("#formMsg");
var redirectUrl = '404.html';
var mapUrl = 'page2.html';
var citiesArray = []; //object array for pulling out of local storage elements
map; //object that has to be inialized by function setUpMap

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
    //check if coming from second page if a location was searched
    //from stackoverflow https://stackoverflow.com/questions/17502071/transfer-data-from-one-html-file-to-another
    var url = document.location.href,
    params = url.split('?')[1].split('&'),
    data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
     tmp = params[i].split('=');
     data[tmp[0]] = tmp[1];
    }
    if(data.locationName !== ''){
        storeSearchLocation(data.locationName);
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
 
//Dedicating function to handle searches from page2
function searchedLocation(event, cityId){
    event.preventDefault();
    var cityEl = document.getElementById(cityId).value;
    if (cityEl === "") {
        displayMessage("error", "No location given, please give a location!!");
        return;
    }else{
        storeSearchLocation(cityEl);
    }
}


 /**
  * Called to store in local storage the location name being searched
  * @param {*} searched string of searched area name
  */
 function storeSearchLocation(searched){
    searched = capitalizeFirstLetter(searched);
        //prevents duplicate cities
        if (citiesArray.includes(searched) === false) {
            citiesArray.push(searched);
            localStorage.setItem("citiesLocal", JSON.stringify(citiesArray));
        }
        //going to call a function for displaying the local storage data
        viewCities();
        getWeatherInfo(searched);
}

//Clearing the local storage
function clearCities() {
    localStorage.removeItem("citiesLocal");
    citiesArray = [];
    cityButtonList.innerHTML = "";
}

 function getWeatherInfo(cityEl) {
     var apiurl = "https://api.openweathermap.org/data/2.5/weather?q= "+cityEl+"&appid=d74649d085e772a2cff36556b7a6a792"; 
     fetch(apiurl)
     .then(function(response){
         if (response.status === 404) {
             document.location.replace(redirectUrl); 
         } else {
             return response.json();
         }
     })
     .then (function (data){
         var day = moment().format("ddd MMM Do");  //Used Moment.js for dispalying the date
         var temp = Math.round((((data.main.temp) - 273.15) * 1.8) + 32);
         //This will clear out any previously created elements
         while(WeatherParametersEl.firstChild){
             WeatherParametersEl.removeChild(WeatherParametersEl.firstChild);
         }
         var liElOne = document.createElement("li");
         liElOne.textContent = cityEl+" Weather this "+day+":";
         WeatherParametersEl.appendChild(liElOne);
         var liElTwo = document.createElement("li");
         liElTwo.textContent = "Temperature: "+temp+"°F";
         WeatherParametersEl.appendChild(liElTwo);
         var liElThree = document.createElement("li");
         liElThree.textContent = "Humidity: "+data.main.humidity+" %";
         WeatherParametersEl.appendChild(liElThree);
         var liElFour = document.createElement("li");
         liElFour.textContent = "Wind: "+data.wind.speed+" MPH";
         WeatherParametersEl.appendChild(liElFour);
         var lat = data.coord.lat;
         var lon = data.coord.lon;
         //ATTENTION: First parameter will be LONGITUDE then Latitude
         setUpMap([lon,lat]);
         //showMarker(lon,lat);
         listTrailfinder(lon,lat);
    })
 }
 
 // creating a function for Form messages
 function displayMessage(type, message) {
     formMsg.textContent = message;
     formMsg.setAttribute("class", type);
 }
 

 function setUpMap(center){
     map = new mapboxgl.Map({
         container: 'map',
         style: 'mapbox://styles/adam-niggebrugge/cks2lfvnt3ymv17pkmhxwlh83',
         center: center,
         zoom:15
    });
 }
 
 map.on('load', () => {
    map.addSource('dem', {
        'type': 'raster-dem',
         'url': 'mapbox://mapbox-terrain-dem-v1'
    });
    map.addLayer(
        {
            'id': 'hillshading',
            'source': 'dem',
            'type': 'hillshade'
        },
    );
});

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
 * From stackoverflow.com capitalize in general for english
 * @param {*} string 
 * @returns Upper case first letter on every word space
 */
 function capitalizeFirstLetter(string) {
    var splitStr = string.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
  }

function listTrailfinder(lon, lat) {
    //Clear earlier results
    listContainerEl.innerHTML = "";
    imageContainerEl.innerHTML = "";

    var mapListURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/trail.json?proximity="+lon+","+lat+"&access_token=pk.eyJ1IjoiYWRhbS1uaWdnZWJydWdnZSIsImEiOiJja3JzMXN1M2EwaHJoMzF1aHRsNnh3ejNiIn0.qgb2dKPkqB5Lx5iukcDSdA&limit=4";
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
        //var imageSearchUrl = "https://serpapi.com/search.json?q=" + imgSearchText + "&tbm=isch&ijn=0&api_key=d6db6046a49d044c851ae398fe7e90ecf61ede5961a226a8129f43fb2de747c3";
        var imageSearchUrl = "https://api.unsplash.com/search/photos?query=" + imgSearchText + "&client_id=uDBXJ0P4LsC7LFw3XRsL72JDWXlolhLtMvAe667avc4";
        fetch(imageSearchUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function(data) {
                console.log('entered serp response');
                var imageResult = data.results[0];

                var card = document.createElement('div');
                card.setAttribute("class","card");

                var cardName = document.createElement('div');
                cardName.setAttribute("class","card header");
                cardName.textContent = searchTrailResult.features[imageContainerEl.children.length].place_name;
                card.appendChild(cardName);

                var img = document.createElement('img');
                img.src = imageResult.urls.small;
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

initilizeProgram();
viewCities();










