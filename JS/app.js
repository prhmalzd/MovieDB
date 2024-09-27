
leftBarOptions.forEach((option) => {
    option.addEventListener('click' , leftBarOptionsFunc)
})

changeLeftBarShowBTN.addEventListener('click' , showLeftBarHandler)
changeLeftBarHideBTN.addEventListener('click' , hideLeftBarHandler)

function showLeftBarHandler () {
    leftBarBig.style.opacity = '100%'
    leftBarLittle.style.opacity = '0%'
    container.style.marginLeft = '200px'
}
function hideLeftBarHandler () {
    leftBarBig.style.opacity = '0%'
    leftBarLittle.style.opacity = '100%'
    container.style.marginLeft = '70px'
}

function leftBarOptionsFunc (event) {
    
    let name = event.target.getAttribute('name')
    if (!name) {
        return
    }
    const selectedOptions = document.querySelectorAll(`div[name=${name}]`)
    
    Array.from(leftBarOptions).forEach((leftBarOption) => {
        Array.from(leftBarOption.children).forEach((option) => {
            option.classList.remove('leftBar_options_one_selected')
        })  
    })
    Array.from(selectedOptions).forEach((selectedOption) => {
        selectedOption.classList.add('leftBar_options_one_selected')
    })

    if (name === 'home' && state !== 'home') {
        showSlideBarMovies = true
        state = 'home'
        pageNumber = 1
        filterOption.vote = ['All' , '']
        filterOption.year = ['All' , '']
        filterOption.genres = ['All' , '']
        filterOption.arrange = ['Popular' , 'popularity.desc']
        checkSessionStorage()
    }
    else if (name === 'favorites' && state !== 'favorites') {
        state = 'favorites'
        createFavoriteSection()
    }
    else if (name === 'search' && state !== 'search') {
        state = 'search'
        clearHeader()
        clearFilters()
        searchInput.focus()
        createSearchMessageSection(stringMessages.searchMessageBasic , '')
        createOneMovieLoading()
    }
}

function createPeoplesSection () {

    const peoplesContainerDiv = createPeoplesElements(true)

    const peoplesContainerDivLittleBar = createPeoplesElements(false)
    peoplesContainerDivLittleBar.classList.add('leftBarLittle_peoples')

    leftBarBig.append(peoplesContainerDiv)
    leftBarLittle.append(peoplesContainerDivLittleBar)
}

function createPeoplesElements (isForLeftBarBig) {
    const peopleContainerDiv = document.createElement('div')
    peopleContainerDiv.classList.add('leftBar_peoples')

    for (let people of peoples) {
        const baseUrlImage = 'https://image.tmdb.org/t/p/w500'
        const imgaeURL = `${baseUrlImage}${people.profile_path}`


        const divContainer = document.createElement('div')
        divContainer.classList.add('leftBar_peoples_onePeople')
        
        const spanTitle = document.createElement('span')
        spanTitle.textContent = people.name
        
        const imgDiv = document.createElement('div')
        
        const img = new Image()
        img.onload = () => {
            imgDiv.style.backgroundImage = `url(${imgaeURL})`
        }
        img.onerror = () => {
            imgDiv.style.backgroundColor = 'black'
        }
        img.src = imgaeURL

        divContainer.append(imgDiv)
        if (isForLeftBarBig) {
            divContainer.append(spanTitle)
        }
        
        peopleContainerDiv.append(divContainer)
    }
    return peopleContainerDiv
}

function checkSessionStorage () {
    clearSearch()

    let storagedDetails = getSessionStorage()
    
    if (storagedDetails) {
        let parsedMovies = JSON.parse(storagedDetails)
        createHomeSection(parsedMovies)
        return
    }

    fetchMoviesByFilter()
}

function checkSessionStorageOneMovie () {

    let storagedDetails = getSessionStorageOneMovie()
    
    if (storagedDetails) {
        let parsedMovie = JSON.parse(storagedDetails)
        movieDetails = parsedMovie.details
        similarMovies = parsedMovie.similar
        
        createMovieDetailsPage(movieDetails)
        return
    }

    fetchOneMovieDetails(movieId)
}

function getSessionStorage () {
    const stringfyFilterOption = JSON.stringify(filterOption)
    const key = stringfyFilterOption + '&page:' + pageNumber
    const result = sessionStorage.getItem(key)

    return result
}

function getSessionStorageOneMovie () {
    const result = sessionStorage.getItem(movieId)
    return result
}

function setSessionStorage (movies) {
    const stringfyFilterOption = JSON.stringify(filterOption)
    const key = stringfyFilterOption + '&page:' + pageNumber
    const stringifyMovies = JSON.stringify(movies)
    sessionStorage.setItem(key , stringifyMovies)
}

function setSessionStorageOneMovie () {
    const value = {
        details : movieDetails,
        similar : similarMovies
    }
    const stringfyValue = JSON.stringify(value)
    sessionStorage.setItem(movieId , stringfyValue)
}

function createHomeSection (movies) {
    
    clearMoviesContainer()
    
    if (movies.length === 0) {
        createFilterSection()
        nothingToShow()
        return
    }
    

    if (showSlideBarMovies) {
        for (let i = 0 ; i < yearNumbersOnFirstLoad.length -1 ; i++) {
            let year = yearNumbersOnFirstLoad[i]
            let movies = yearMoviesOnFirstLoad[year]
            createCarouselMoviesByYear(movies , year)
        }
        showSlideBarMovies = false
    }

    createFilterSection()
    clearInterval(headerChangeInterval)
    createCarousel(movies)
    
    
    for (let movie of movies) {
        const movieDiv = createOneMovie(movie)
        moviesContainer.append(movieDiv)
    }
    paginationButtonUpdate()
}

function createSearchSection (movies) {
    clearMoviesContainer()
    
    if (movies.length === 0) {
        createFilterSection()
        nothingToShow()
        return
    }
     
    for (let movie of movies) {
        const movieDiv = createOneMovie(movie)
        moviesContainer.append(movieDiv)
    }
    paginationButtonUpdate()
}

function createFavoriteSection () {
    clearHeader()
    clearFilters()
    clearMoviesContainer()
    let movieCounter = pageNumber * 20

    if (Object.keys(favedMovies).length === 0) {
        nothingToShow()
        return
    }
    
    let distance = 0
    let movieCAounter = 0
    for (let movie in favedMovies) {
        if (distance < movieCounter - 20) {
            distance++
            continue
        }
        if (movieCAounter === 20) {
            break
        }
        let key = movie
        let value = favedMovies[key]
        const movieDiv = createOneMovie(value)
        moviesContainer.append(movieDiv)
        movieCAounter++
    }
    
    paginationButtonUpdate(movieCAounter)
}

function clearHeader () {
    headerContainer.innerHTML = ''
    headerIndex = 0
}
function clearMoviesContainer () {
    moviesContainer.innerHTML = ''
}
function clearFilters () {
    filtersContainer.innerHTML = ''
}

function createHeaderLoading () {
    clearHeader()

    const headerDiv = document.createElement('div')
    headerDiv.classList.add('header' , 'header_isLoading')

    headerContainer.append(headerDiv)
}

function createCarousel (movies) {
    clearHeader()
    const carouselItems = []
    
    const innerDiv = document.createElement('div')
    innerDiv.classList.add('header_container_inner')

    for (let i = 0 ; i < 3 ; i ++) {
        const headerMovie = createHeaderMovie(movies[i])
        innerDiv.append(headerMovie)
        carouselItems.push(headerMovie)
    }

    const carouselButtonsContainer = document.createElement('div')
    carouselButtonsContainer.classList.add('carousel_buttons_container')
    for (let i = 0 ; i < 3 ; i ++) {
        const carouselBTN = document.createElement('button')
        carouselBTN.classList.add('carousel_BTN')
        carouselBTN.setAttribute('name' , i)
        carouselBTN.addEventListener('click' , headerChangeIntervalFunc)
        if (i === 0 ) carouselBTN.classList.add('carousel_BTN_active')
        carouselButtonsContainer.append(carouselBTN)
        carouselBTNs.push(carouselBTN)
    }
    headerContainer.append(innerDiv)
    headerContainer.append(carouselButtonsContainer)

    headerChangeInterval = setInterval(headerChangeIntervalFunc, 3000);

    function headerChangeIntervalFunc (event) {
        
        if (event) {
            headerIndex = event.target.name
        }
        else {
            headerIndex = (headerIndex + 1 + 3) % 3;
        }
        const carouselButtons = document.querySelectorAll('.carousel_BTN')
        Array.from(carouselButtons).forEach((btn) => {
            btn.classList.remove('carousel_BTN_active')
            if (btn.name == headerIndex) {
                btn.classList.add('carousel_BTN_active')
            }
            
        })

        innerDiv.style.transform = `translateX(-${headerIndex * 100}%)`
    }
}
function createHeaderMovie (movieInfo) {

    let imgaeURL
    const baseUrlImage = 'https://image.tmdb.org/t/p/original'
    if (movieInfo.backdrop_path) {
        imgaeURL = `${baseUrlImage}${movieInfo.backdrop_path}`
    }

    const titleSpan = document.createElement('span')
    titleSpan.classList.add('header_information_title')
    titleSpan.textContent = movieInfo.title

    const discriptionSpan = document.createElement('span')
    discriptionSpan.classList.add('header_information_discreption')
    discriptionSpan.textContent = getShortText(movieInfo.overview)

    const ratingSpan = document.createElement('span')
    ratingSpan.classList.add('header_information_ratings_num')
    ratingSpan.textContent = movieInfo.vote_average

    const ratingDiv = document.createElement('div')
    ratingDiv.classList.add('header_information_ratings')

    const informationDiv = document.createElement('div')
    informationDiv.classList.add('header_information')

    const headerDiv = document.createElement('div')
    headerDiv.classList.add('header')

    const img = new Image()
    img.onload = () => {
        headerDiv.style.backgroundImage = `url(${imgaeURL})`
    }
    img.onerror = () => {
        headerDiv.classList.add('header_image_error')
        imageLoadErroHandler(headerDiv)
    }
    if (movieInfo.backdrop_path) {
        img.src = imgaeURL
    }
    
    ratingDiv.innerHTML = imdbIcon
    ratingDiv.append(ratingSpan)

    informationDiv.append(titleSpan)
    informationDiv.append(discriptionSpan)
    informationDiv.append(ratingDiv)

    headerDiv.append(informationDiv)
    return headerDiv
}

function createFilterSection () {
    clearFilters()
    let selectOptions = []

    const selectedGenreSection = createSelectedGenreElement()

    
    for (option in filtersOptions) {
        selectOptions = []
        let value = filtersOptions[option]
        const div = document.createElement('div')
        div.classList.add(`filters_${value}`)
        if (value === 'genres') {
            div.append(selectedGenreSection)
        }
        
        const select = document.createElement('select')
        select.setAttribute('name' , value)
        select.classList.add(`filters_${value}_select`)
        select.addEventListener('input' , filterSelectFunc)
        
        const label = document.createElement('label')
        label.setAttribute('for' , value)

        if (value === 'vote') {
            selectOptions.push('All')
            for (let i = 1 ; i < 11 ; i++) {
                selectOptions.push(i)
            }
            label.textContent = 'امتیاز'
        }
        else if (value === 'year') {
            selectOptions.push('All')
            for (let i = 1900 ; i < 2026 ; i++) {
                selectOptions.push(i)
            }
            label.textContent = 'سال انتشار'

        }
        else if (value === 'arrange') {
            selectOptions.push('Popular')
            selectOptions.push('Top Rated')
            selectOptions.push('Upcoming')
            label.textContent = 'مرتب سازی'

        }

        if (value === 'genres') {
            const defaultOption = document.createElement('option')
            defaultOption.textContent = '---'
            defaultOption.id = 'default_option_genres'
            defaultOption.setAttribute('selected' , true)
            select.append(defaultOption)
            const allOption = document.createElement('option')
            allOption.textContent = 'All'
            select.append(allOption)
            for (let genre of genres) {
                const option = document.createElement('option')
                option.textContent = genre.name
                option.id = genre.id
                select.append(option)
            }
            label.textContent = 'ژانر'
        }
        else {
            for (let selectOption in selectOptions) {
                let value = selectOptions[selectOption]
                const option = document.createElement('option')
                option.textContent = value
                
                if (value == filterOption.vote[0] ||
                    value == filterOption.year[0] ||
                    value == filterOption.arrange[0]
                )
                {
                    option.setAttribute('selected' , true)  
                }
                
                select.append(option)
            }
        }


        div.append(select)
        div.append(label)
        filtersContainer.append(div)
    }
}

function createSelectedGenreElement () {
    
    const selectedGenreSection = document.createElement('div')
    selectedGenreSection.classList.add('filters_selectedGenres')

    for (let index in filterOption.genresNames) {
        const value = filterOption.genresNames[index]
        const id = filterOption.genresIDs[index]

        const genreDiv = createOneGenreElement(value , id)
        selectedGenreSection.append(genreDiv)
    }
    return selectedGenreSection
}

function createOneGenreElement(value , id) {
    const genreDiv = document.createElement('div')
    genreDiv.classList.add('filters_selectedGenres_oneGenre')

    const genreSpan = document.createElement('span')
    genreSpan.textContent = value
        
    const deleteDiv = document.createElement('div')
    deleteDiv.innerHTML = deleteIcon
    deleteDiv.addEventListener('click' , () => {
        removeSelectedGenre(value , id , genreDiv)
    })

    genreDiv.append(genreSpan)
    genreDiv.append(deleteDiv)

    return genreDiv
}

function removeSelectedGenre (value , id , genreDiv) {

    let newNames = filterOption.genresNames.filter((name) => {
        if (value !== name) {
            return true
        }
    })
    let newIds = filterOption.genresIDs.filter((genreId) => {
        if (Number(id) !== genreId) {
            return true
        }
    })
    
    filterOption.genresNames = newNames
    filterOption.genresIDs = newIds
    if (filterOption.genresNames.length < 1) {
        filterOption.genres = ['All' , '']
    }
    
    genreDiv.remove()
    
    checkSessionStorage()
}



function createOneMovieLoading () {
    clearMoviesContainer()

    const loadingDivContainer = document.createElement('div')
    loadingDivContainer.classList.add('movies_loadingContainer')

    for (let i = 0 ; i < 20 ; i ++) {
        const containerDiv = document.createElement('div')
        containerDiv.classList.add('moveies_one' , 'moveies_one_isLoading')
    
        loadingDivContainer.append(containerDiv)
    }
    moviesContainer.append(loadingDivContainer)
}

function createCarouselMoviesByYear (movies , year) {

    let buttonSeeMore = document.createElement('button')
    let carouselTitle = document.createElement('span')

    if (year) {
        buttonSeeMore.textContent = 'بیشتر'
        buttonSeeMore.addEventListener('click' , () => {
            state = 'home'
            pageNumber = 1
            filterOption.vote = ['All' , '']
            filterOption.year = [year , year]
            filterOption.genres = ['All' , '']
            
            Array.from(leftBarOptions).forEach((leftBarOption) => {
                Array.from(leftBarOption.children).forEach((option) => {
                    option.classList.remove('leftBar_options_one_selected')
                })  
            })
    
            checkSessionStorage()
            window.scrollTo({top: 0 , behavior : 'smooth'})
        })
    
        carouselTitle.textContent = year
    }
    else {
        buttonSeeMore = document.createElement('div')
        carouselTitle.textContent = 'فیلم های مشابه'
    }

    const carouselMoviesTitleDiv = document.createElement('div')
    carouselMoviesTitleDiv.classList.add('moveies_carousel_year_titleContainer')

    const moviesContainerCarousel = document.createElement('div')
    moviesContainerCarousel.classList.add('moveies_carousel_year_moviesContainer')

    const carouselDiv = document.createElement('div')
    carouselDiv.classList.add('moveies_carousel_year')
    
    carouselMoviesTitleDiv.append(buttonSeeMore)
    carouselMoviesTitleDiv.append(carouselTitle)
    carouselDiv.append(carouselMoviesTitleDiv)
    
    let index = 1
    
    for (let movie of movies) {
        if (index > 10) break
        const movieDiv = createOneMovie(movie)
        moviesContainerCarousel.append(movieDiv)
        index++
    }
    
    carouselDiv.append(moviesContainerCarousel)
    moviesContainer.append(carouselDiv)
}

function createOneMovie (movieInfo) {
    
    let imgaeURL
    const baseUrlImage = 'https://image.tmdb.org/t/p/w500'

    if (movieInfo.backdrop_path) {
        imgaeURL = `${baseUrlImage}${movieInfo.poster_path}`
    }  

    const containerDiv = document.createElement('div')
    containerDiv.classList.add('moveies_one')
    containerDiv.id = movieInfo.id
    containerDiv.addEventListener('click' , (event) => {
        const tagName = event.target.tagName
        if (tagName === 'svg' || tagName === 'path') {
            faveMovieHandler(faveBTN , movieInfo)
            return
        }
        clearSearch()
        state = 'oneMovie'
        movieId = movieInfo.id
        clearPageForMovieDetails()
        checkSessionStorageOneMovie()
        window.scrollTo({top: 0 , behavior : 'smooth'})
    })

    const imageDiv = document.createElement('div')
    imageDiv.classList.add('moveies_one_image')

    const img = new Image()
    img.onload = () => {
        imageDiv.style.backgroundImage = `url(${imgaeURL})`
    }
    img.onerror = () => {
        imageDiv.classList.add('moveies_one_image_error')
        imageLoadErroHandler(imageDiv)
    }

    if (movieInfo.backdrop_path) {
        img.src = imgaeURL
    }  
    

    const infoDiv = document.createElement('div')
    infoDiv.classList.add('moveies_one_information')

    const spanTitle = document.createElement('span')
    spanTitle.classList.add('moveies_one_information_title')
    spanTitle.textContent = movieInfo.title.length > 40 ? getShortText(movieInfo.title) : movieInfo.title

    const spanDiscription = document.createElement('span')
    spanDiscription.classList.add('moveies_one_information_discreption')
    spanDiscription.textContent = getShortText(movieInfo.overview)

    const spanDate = document.createElement('span')
    spanDate.classList.add('moveies_one_information_date')
    spanDate.textContent = movieInfo.release_date

    const genresDiv = document.createElement('div')
    genresDiv.classList.add('moveies_one_genresContainer')

    const genresIds = movieInfo.genre_ids

    if (genresIds) {
        for (let genreId of genresIds) {
            genres.forEach(genre => {
                
                if (genre.id == genreId) {
                    const genreDiv = document.createElement('div')
                    genreDiv.classList.add('moveies_one_genre')
                    genreDiv.textContent = genre.name
                    genresDiv.append(genreDiv)
                }
            })
        }
    }
    
    const isThisMovieFaved = checkMovieFaved(movieInfo.id)
    const faveBTN = document.createElement('div')
    faveBTN.classList.add('moveies_one_information_faveIcon')
    if (isThisMovieFaved) {
        faveBTN.classList.add('faved')
        faveBTN.innerHTML = favedIcon
    }
    else faveBTN.innerHTML = unfavedIcon

    
    infoDiv.append(spanTitle)
    infoDiv.append(spanDiscription)
    infoDiv.append(spanDate)
    infoDiv.append(genresDiv)
    infoDiv.append(faveBTN)

    containerDiv.append(imageDiv)
    containerDiv.append(infoDiv)

    return containerDiv
}

function imageLoadErroHandler (div) {

    const errorDiv = document.createElement('div')
    const errorSpan = document.createElement('span')
    errorSpan.textContent = stringMessages.errorImageLoad

    errorDiv.innerHTML = errorIcon
    div.append(errorDiv)
    div.append(errorSpan)
}

function checkMovieFaved (id) {
    
    let isMovieFaved = favedMovies[id]
    
    return isMovieFaved
}

function getShortText (text) {
    const shortHandText = text.split(' ').slice(0 , 6).join(' ') + '...'
     
    return shortHandText
}

function faveMovieHandler (btn , info) {

    if (btn.classList.contains('faved')) {
        btn.classList.remove('faved')
        btn.innerHTML = unfavedIcon
        
        movieUnFaved(info)
    }
    else {
        btn.classList.add('faved')
        btn.innerHTML = favedIcon
        movieFaved(info)
    }

    if (state === 'favorites') {
        createFavoriteSection()
    }

}

function movieFaved (info) {
    const key = info.id
    favedMovies[key] = info

    const strigfyedFavedMovies = JSON.stringify(favedMovies)

    localStorage.setItem('favedMovies' , strigfyedFavedMovies)
}

function movieUnFaved (info) {

    const key = info.id
    delete favedMovies[key]

    const strigfyedFavedMovies = JSON.stringify(favedMovies)

    localStorage.setItem('favedMovies' , strigfyedFavedMovies)
}

function clearPageForMovieDetails () {
    clearFilters()
    clearMoviesContainer()
    paginationButtonUpdate()
}

function createMovieDetailsPage (movie) {
    clearHeader()
    Array.from(leftBarOptions).forEach((leftBarOption) => {
        Array.from(leftBarOption.children).forEach((option) => {
            option.classList.remove('leftBar_options_one_selected')
        })  
    })


    const baseUrlDropBack = 'https://image.tmdb.org/t/p/original'
    const baseUrlPoster = 'https://image.tmdb.org/t/p/w500'

    let backDropImageURL
    let posterImageURL

    if (movie.backdrop_path) {
        backDropImageURL = `${baseUrlDropBack}${movie.backdrop_path}`
    }
    if (movie.poster_path) {
        posterImageURL = `${baseUrlPoster}${movie.poster_path}`
    }

    const headerImage = document.createElement('div')
    headerImage.classList.add('header')
    
    const backDropImage = new Image()
    backDropImage.onload = () => {
        headerImage.style.backgroundImage = `url(${backDropImageURL})`
    }
    backDropImage.onerror = () => {
        headerImage.classList.add('moveies_one_image_error')
        imageLoadErroHandler(headerImage)
    }
    if (movie.backdrop_path) {
        backDropImage.src = backDropImageURL
    }

    const movieDetailsContainer = document.createElement('div')
    movieDetailsContainer.classList.add('movie_container')

    const imageDiv = document.createElement('div')
    imageDiv.classList.add('movie_container_image')
    
    const profileImage = new Image()
    profileImage.onload = () => {
        imageDiv.style.backgroundImage = `url(${posterImageURL})`
    }
    profileImage.onerror = () => {
        imageDiv.classList.add('moveies_one_image_error')
        imageLoadErroHandler(imageDiv)
    }
    if (movie.poster_path) {
        profileImage.src = backDropImageURL
    }

    const detailsContainer = document.createElement('div')
    detailsContainer.classList.add('movie_container_details')

    const titleSpan = document.createElement('span')
    titleSpan.textContent = movie.title
    titleSpan.classList.add('movie_container_details_title')

    const overviewSpan = document.createElement('span')
    overviewSpan.textContent = movie.overview
    titleSpan.classList.add('movie_container_details_overview')

    const rateDiv = document.createElement('div')
    rateDiv.classList.add('movie_container_details_rate')

    const rateSpan = document.createElement('span')
    rateSpan.textContent = movie.vote_average

    rateDiv.innerHTML = imdbIcon
    rateDiv.append(rateSpan)

    const genresDiv = document.createElement('div')
    genresDiv.classList.add('movie_container_details_genres')

    for (genre of movie.genres) {

        const genreTitle = document.createElement('span')
        genreTitle.classList.add('moveies_one_genre')
        genreTitle.id = genre.id
        genreTitle.textContent = genre.name

        genresDiv.append(genreTitle)
    }

    detailsContainer.append(titleSpan)
    detailsContainer.append(overviewSpan)
    detailsContainer.append(rateDiv)
    detailsContainer.append(genresDiv)

    movieDetailsContainer.append(imageDiv)
    movieDetailsContainer.append(detailsContainer)


    headerContainer.append(headerImage)
    moviesContainer.append(movieDetailsContainer)

    createCarouselMoviesByYear(similarMovies)

}

function loadingHandler () {
    if (state === 'search') {
        createOneMovieLoading()
    }
    else if (state === 'oneMovie') {
        createHeaderLoading()
    }
    else {
        createHeaderLoading()
        createOneMovieLoading()
    }
}

function nothingToShow () {
    state = 'nothing'
    const div = document.createElement('div')
    div.classList.add('nothingToShow')
    div.textContent = 'Cant find any Movies...'

    moviesContainer.append(div)

    paginationButtonUpdate()
}

function getGenresIDs () {
    let ids = []
    for (let id of filterOption.genresIDs) {
        ids.push(id)
    }
    return ids.join('%2C')
}

function errorHandler (err) {
    
    console.log(err);
    

    let prevState = state
    let message
    state = 'error'
    paginationButtonUpdate()

    if (err.status === 404) {
        message = stringMessages.errorMessage404
        console.log('404 not found');
    }
    else {
        message = stringMessages.errorMessageNoConnection
    }

    createErrorElement(prevState , message)
}

function createErrorElement(prevState , msg) {
    createHeaderLoading()
    clearMoviesContainer()
    clearFilters()

    const errorMessage = document.createElement('span')
    errorMessage.classList.add('errorDiv_message')
    errorMessage.textContent = msg

    const refreshBtn = document.createElement('button')
    refreshBtn.textContent = 'تلاش مجدد'
    refreshBtn.addEventListener('click' , () => {
        refreshPageHandler(prevState)
    })

    const errorDiv = document.createElement('div')
    errorDiv.classList.add('errorDiv')

    const headrLoading = document.querySelector('.header_isLoading')

    errorDiv.append(errorMessage)
    errorDiv.append(refreshBtn)

    headrLoading.append(errorDiv)

}

function refreshPageHandler(prevState) {
    state = prevState
    if (state === 'home') {
        checkSessionStorage()
    }
    else if (state === 'search') {
        searchMovieHandler()
    }
    else if (state === 'oneMovie') {
        fetchOneMovieDetails(movieId)
    }
}