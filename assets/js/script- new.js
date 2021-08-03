var citiesArray = [];
var searchBtnEl = document.querySelector(".mainbutton");

function initializeProgram(){
    document.getElementById("page-2").style.setProperty("display", "none");
    initializeCities();
}

function initializeCities() {
    var citiesLocal = JSON.parse(localStorage.getItem("citiesLocal"));
    if (citiesLocal !== null) {
        citiesArray = citiesLocal;
    }
    viewCities()
}

//Clearing the local storage
function clearCities() {
    localStorage.removeItem("citiesLocal");
    citiesArray = [];
    //viewScores();
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
        //cityButton.className = "city-id";
        //cityButton.id
        cityButton.textContent = city;
        cityButtonList.appendChild(cityButton);
        //cityButton.onclick = cityButtonClickHandler; // calling a function here after a button click
    }
}
var formMsg = document.querySelector("#formMsg");
function displayMessage(type, message) {
    formMsg.textContent = message;
    formMsg.setAttribute("class", type);
}

searchBtnEl.addEventListener("click",function (event){
    event.preventDefault();
    var cityEl = document.getElementById("city").value;
    if (cityEl === ""){
        displayMessage("error", "Please enter a City !!");
        return;
    } else {
         citiesArray.push(cityEl);
        localStorage.setItem("citiesLocal", JSON.stringify(citiesArray));
        viewCities();
        
    }
})
searchBtnEl.addEventListener("click", startShowpage1);
//called the onlick funtion from the Homepage start button
function startShowpage1()
{
    document.getElementById("homePage").style.setProperty("display", "none");
    document.getElementById("page-2").style.setProperty("display", "block");
    displayCities();
    }


initializeProgram()











