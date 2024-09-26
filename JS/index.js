function http(...args) {
    return new Promise((resolve , reject) => {
        fetch(...args)
            .then((response) => {
                if (!response.ok) {
                    reject(response)
                    return
                }
                resolve(response.json())
            })
            .catch(error => {
                reject(error)
            })
    })
}

function fetchOneMovieDetails (movie_id) {
    isLoading = true
    loadingHandler()
    const movieURL = baseURL + `/3/movie/${movie_id}?language=en-US`
    http(movieURL , options)
        .then((movie) => {
            createMovieDetailsPage(movie)
        })
        .catch((err) => {
            errorHandler(err)
        })
        .finally(() => {isLoading = false})
}
function fetchOneMovieImages (movie_id) {
    isLoading = true
    const movieURL = baseURL + `/3/movie/${movie_id}/images`
    http(movieURL , options)
        .then((list) => {
            console.log('movie images : ');
            console.log(list);
        })
        .catch((err) => {
            errorHandler(err)
        })
        .finally(() => {isLoading = false})
}

function fetchSimilarMovies (movie_id , page = 1) {
    isLoading = true
    const movieURL = baseURL + `/3/movie/${movie_id}/similar?language=en-US&page=${page}`
    http(movieURL , options)
        .then((list) => {
            console.log('similar movies : ');
            console.log(list.results);
        })
        .catch((err) => {
            errorHandler(err)
        })
        .finally(() => {isLoading = false})
}

function searchMovie (query , year) {
    isLoading = true
    loadingHandler()
    const movieURL = baseURL + `/3/search/movie?query=${query}&include_adult=true&language=en-US&page=${pageNumber}&year=${year}`
    http(movieURL , options)
        .then((list) => {
            createSearchMessageSection(stringMessages.searchMessageResult , list.total_results , query)
            createPageUI(list.results)
        })
        .catch((err) => {
            errorHandler(err)
        })
        .finally(() => {isLoading = false})
}

let counter = 0
function fetchMoviesByFilter () {
    let genres = filterOption.genres[1]
    let year = counter === 0 ? yearNumbersOnFirstLoad[counter] : filterOption.year[1]
    let vote = filterOption.vote[1]
    let arrange = filterOption.arrange[1]

    
    if (filterOption.genresNames.length > 1) {
        genres = getGenresIDs()
    }

    isLoading = true
    loadingHandler()
    const moviesURL = baseURL + `/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageNumber}&sort_by=${arrange}&primary_release_year=${year}&with_genres=${genres}&vote_average.gte=${vote}`
    
    http(moviesURL , options)
        .then((list) => {
            if (counter < yearNumbersOnFirstLoad.length) {
                let key = yearNumbersOnFirstLoad[counter]
                yearMoviesOnFirstLoad[key] = list.results
                counter++
                filterOption.year[1] = yearNumbersOnFirstLoad[counter]
                fetchMoviesByFilter()
                return
            }
            setSessionStorage(list.results)
            createPageUI(list.results)
        })
        .catch((err) => {
            errorHandler(err)
        })
        .finally(() => {isLoading = false})
}

function fetchGenres () {
    isLoading = true
    const genreURL = baseURL + '/3/genre/movie/list?language=en'
    http(genreURL , options)
        .then((list) => {
            genres = list.genres
            fetchMoviesByFilter()
        })
        .catch((err) => {
            errorHandler(err)
        })
        .finally(() => {isLoading = false})
}

function fetchPeople () {
    isLoading = true
    const genreURL = baseURL + `/3/person/popular?language=en-US&page=${pageNumber}`
    http(genreURL , options)
        .then((list) => {
            peoples = list.results
            createPeoplesSection() 
        })
        .catch((err) => {
            errorHandler(err)
        })
        .finally(() => {isLoading = false})
}

function fetchFromLocalStorage () {
    let movies = localStorage.getItem('favedMovies')
    if (movies) {
        favedMovies = JSON.parse(movies)
    }
}

fetchGenres()
fetchFromLocalStorage()