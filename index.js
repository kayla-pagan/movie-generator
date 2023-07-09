const main = document.getElementById('main')
const movieContainer = document.getElementById('movie-container')
const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const addToWatchlist = document.getElementById('add-watchlist-btn')
const exploreAndErrorSection = document.getElementById('explore-and-error-section')
let watchlistIdArray = []



function LocalStorage(data){
    localStorage.setItem(`movieID`, JSON.stringify(watchlistIdArray))
}

function clearSection(){
    exploreAndErrorSection.classList.add('d-none')
}

function appendToMovieContainer(data) {
    let newEl = document.createElement("li")
                            
    newEl.innerHTML += `
    <div id="${data.imdbID}" class="movie flex align-center">
        <div class="poster">
            <img src="${data.Poster}">
        </div>

        <div>
            <div class="title-rating flex align-center">
                <h2>${data.Title}</h2>
                <p>⭐ ${data.imdbRating}</p>
            </div>
            
            <div class="info flex align-center">
                <p>${data.Runtime}</p>
                <p>${data.Genre}</p>
                <button class="justify-center align-center">
                    <img id="add-watchlist-btn" src="./img/watchlist-icon.svg" alt="plus button that adds movie to watchlist">
                </button>
                <p>Watchlist</p>
            </div>
            
            <p>${data.Plot}</p>
        </div>  
    </div>`
    
    newEl.addEventListener('click', e => {
        if(e.target.id === "add-watchlist-btn"){
            watchlistIdArray.push(data.imdbID)
            LocalStorage(data)
        }
    })
    
    movieContainer.append(newEl)
}

function getApiData(){
    fetch(`https://www.omdbapi.com/?s=${searchInput.value}&type=movie&plot=short&apikey=d3f6225`)
        .then(res => {
            if(!res.ok){
                throw Error('Something went wrong!')  
              }
              return res.json()
        })
        .then(data => {
                let results = data.Search
            
            results.map(result => {
                    fetch(`https://www.omdbapi.com/?t=${result.Title}&type=movie&plot=short&apikey=d3f6225`)
                    .then(res => res.json())
                    .then(data => {
                            appendToMovieContainer(data)    
                    })
            })
        })
        .catch(err => {
            exploreAndErrorSection.classList.remove('d-none')
            exploreAndErrorSection.innerHTML = `
            <h2>Unable to find what you’re looking for. Please try another search.</h2>`       
        })
}

searchBtn.addEventListener('click', () => {
    clearSection()
    
    movieContainer.classList.remove('d-none')
    
    getApiData()
})