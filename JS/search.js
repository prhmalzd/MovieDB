searchInput.addEventListener('input' , updateSearchText)
searchBTN.addEventListener('click' , searchMovieHandler)

function updateSearchText (event) {
    const value = event.target.value
    searchText = value
    debounce()
}

function debounce () {
    clearTimeout(debounceTimer)
    
    debounceTimer = setTimeout(() => {
        searchMovieHandler()
    } , 800)
}

function searchMovieHandler () {

    if (searchText.length === 0) return
    
    clearHeader()
    clearFilters()
    state = 'search'
    searchMovie(searchText)
    pageNumber = 1
    paginationButtonUpdate()

    const selectedOptions = document.querySelectorAll(`div[name=${state}]`)
    
    Array.from(leftBarOptions).forEach((leftBarOption) => {
        Array.from(leftBarOption.children).forEach((option) => {
            option.classList.remove('leftBar_options_one_selected')
        })  
    })
    Array.from(selectedOptions).forEach((selectedOption) => {
        selectedOption.classList.add('leftBar_options_one_selected')
    })
}

function createSearchMessageSection (message , count) {
    clearFilters()
    const seachMessageDiv = document.createElement('div')
    seachMessageDiv.classList.add('search_message')
    seachMessageDiv.textContent = message + ' ' + count
    filtersContainer.append(seachMessageDiv)
}

function clearSearch () {
    searchInput.value = ''
    searchText = ''
}