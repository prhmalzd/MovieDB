function filterSelectFunc (event) {

    const name = event.target.name
    const options = event.target
    
    if (name === 'arrange') {
        felterArrangeSelectFunc(options)
    }
    else if (name === 'genres') {
        felterGenreSelectFunc(options)
    }
    else if (name === 'year') {
        felterYearSelectFunc(options)
    }
    else if (name === 'vote') {
        felterVoteSelectFunc(options)
    }

    checkSessionStorage()
    window.scrollTo({top: 0 , behavior : 'smooth'})
}

function felterArrangeSelectFunc (options) {
    

    Array.from(options).forEach((option , index) => {
        if (option.selected) {
            if (index === 0) {
                filterOption.arrange = ['Popular' ,'popularity.desc']
            }
            else if (index === 1) {
                filterOption.arrange = ['Top Rated' ,'vote_average.desc']
            }
            else if (index === 2) {
                filterOption.arrange = ['Upcoming' ,'primary_release_date.desc']
            }
            return
        }
    })
}
function felterGenreSelectFunc (options) {

    Array.from(options).forEach((option , index) => {
        if (option.selected) {
            let id = Number(option.id)
            
            
            if (index === 1) {
                filterOption.genres = ['All' , '']
                filterOption.genresNames = []
                filterOption.genresIDs = []
            }
            else {

                for (genre of genres) {
                    if (genre.id === id) {
                        filterOption.genres = [genre.name ,id]
                        if (!filterOption.genresNames.includes(genre.name)) {
                            filterOption.genresNames.push(genre.name)
                            filterOption.genresIDs.push(genre.id)
                        }
                        
                    }
                }
            }
            return
        }
    })
}
function felterYearSelectFunc (options) {

    Array.from(options).forEach((option , index) => {
        if (option.selected) {
            
            if (index === 0) {
                filterOption.year = ['All' , '']
            }
            else {
                filterOption.year = [ option.value , option.value]
            }
            return
        }
    })
}
function felterVoteSelectFunc (options) {
    Array.from(options).forEach((option , index) => {
        option.removeAttribute('selected')
        if (option.selected) {
            option.setAttribute('selected' , true)
            if (index === 0) {
                filterOption.vote = ['All' , '']
            }
            else {
                filterOption.vote = [ option.value , option.value]
            }
            return
        }
    })
}