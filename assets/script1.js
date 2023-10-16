// Search Handling
const searchBtnEl = document.getElementById("search-button");
const searchInputEl = document.getElementById("search-input");


searchBtnEl.addEventListener("click", ()=>{
    const userQuery = searchInputEl.value.trim();
    console.log(userQuery);
    convertToCoordinates(userQuery);
});

// Convert to Coordinates
async function convertToCoordinates(query) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=en&format=json`

    try {
	    const response = await fetch(url)
        const data = await response.json();
        
        const result = data.results[0];
        const cityInfo = {"city": result.name, "lat": result.latitude, "long": result.longitude, "country": result.country};
        console.log(cityInfo);
        searchHistory(cityInfo);
        window.location.href = `./weatherpage.html?city=${cityInfo.city}`;

    } catch (error) {
	    console.error(error);
    }
}

// Save to History
function searchHistory(cityInfo) {
    let savedHistory = []
    if (localStorage.getItem("SearchHistory")) {
        savedHistory = JSON.parse(localStorage.getItem("SearchHistory"))
    }

    savedHistory.unshift(cityInfo);
    console.log(savedHistory);
    if (savedHistory.length > 5) {
        savedHistory.splice(5);
    }

    localStorage.setItem("SearchHistory", JSON.stringify(savedHistory));
}

// Render History List
const mainContainerEl = document.getElementById("main-container");

function renderHistory() {
    const historyContainerEl = document.createElement("div");
    const historyHeadEl = document.createElement("h4");
    const historyListEl = document.createElement("ul");
    
    savedHistory = JSON.parse(localStorage.getItem("SearchHistory"));
    for (i of savedHistory) {
        console.log(i.city);
        const cityListEl = document.createElement("li");
        const cityLinkEl = document.createElement("a");
        cityLinkEl.textContent = i.city + ", " + i.country
        cityListEl.append(cityLinkEl);
        historyListEl.append(cityListEl);

    }
    historyContainerEl.append(historyHeadEl);
    historyContainerEl.append(historyListEl);
    mainContainerEl.append(historyContainerEl);
}

renderHistory();