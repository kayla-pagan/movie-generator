let localList = localStorage.getItem(`movieID`)
let watchlist = localList ? JSON.parse(localList) : []
const myList = document.getElementById('my-list')

function getEmptyListHtml(){
    if(watchlist.length < 1){
        myList.innerHTML = `
        <div class="empty-watchlist flex flex-column justify-center align-center">
            <h2>Your watchlist is looking a little empty...</h2>
            <div flex align-center>
                <a href="./index.html" class="justify-center align-center">
                    <img id="add-watchlist-btn" src="./img/watchlist-icon.svg" alt="add button that leads back to search page"> Let's add some movies!
                </a>
            </div>
        </div>`
    }
}

getEmptyListHtml()

function clearMyList(){
    myList.innerHTML = ""
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
                    <img id="remove-watchlist-btn" src="./img/remove-icon.svg" alt="minus button that removes movie from watchlist">
                </button>
                <p>Remove</p>
            </div>
            
            <p>${data.Plot}</p>
        </div>  
    </div>`
    
    newEl.addEventListener('click', e => {
        if(e.target.id === "remove-watchlist-btn"){
            e.target.closest(`#${data.imdbID}`).parentElement.remove()
            
            const currentWatchItem = watchlist.indexOf(data.imdbID)
            
            watchlist.splice(watchlist[currentWatchItem], 1)
            localStorage.setItem('movieID', JSON.stringify(watchlist))
            
            getEmptyListHtml()
        }
    })
    
    myList.append(newEl)
}

watchlist.map(watch => {
    clearMyList()
    
    fetch(`https://www.omdbapi.com/?i=${watch}&type=movie&plot=short&apikey=d3f6225`).then(res => res.json()).then(data => {
            appendToMovieContainer(data)
        })
})