nextPageBTN.addEventListener('click' , () => {
    pageNumber++
    if (state === 'home') {
        checkSessionStorage()
    }
    else if (state === 'favorites') {
        createFavoriteSection()
    }
    else if (state === 'search') {
        searchMovie(searchText)
    }
    window.scrollTo({top: 0 , behavior : 'smooth'})
})

prevPageBTN.addEventListener('click' , () => {
    if (pageNumber === 1) return
    pageNumber--
    if (state === 'home') {
        checkSessionStorage()
    }
    else if (state === 'favorites') {
        createFavoriteSection()
    }
    else if (state === 'search') {
        searchMovie(searchText)
    }
    window.scrollTo({top: 0 , behavior : 'smooth'})
})

function paginationButtonUpdate () {

    prevPageBTN.style.display = 'block'
    nextPageBTN.style.display = 'block'
    
    const moviesContainerLength = moviesContainer.children.length


    if (state === 'nothing' || state === 'error' || state === 'oneMovie') {
        nextPageBTN.style.display = 'none'
        prevPageBTN.style.display = 'none'
        return
    }

    if ( moviesContainerLength < 20) {
        nextPageBTN.style.display = 'none'
        prevPageBTN.style.display = 'none'
    }

    if (pageNumber === 1) {
        prevPageBTN.style.display = 'none'
    }
    if (pageNumber > 1) {
        prevPageBTN.style.display = 'block'
    }
}