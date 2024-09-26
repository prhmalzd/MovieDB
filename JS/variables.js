const searchInput = document.getElementById('searchInput')
const searchBTN = document.getElementById('searchBTN')


const leftBarBig = document.getElementById('leftBar')
const leftBarLittle = document.getElementById('leftBarLittle')

const leftBarBTNs = document.querySelectorAll('.leftBar_options_one_title')

const leftBarOptions = document.querySelectorAll('.leftBar_options')

const changeLeftBarShowBTN = document.getElementById('leftBarShow')
const changeLeftBarHideBTN = document.getElementById('leftBarHide')

const container = document.querySelector('.container')

const movieHeader = document.querySelector('.header')
const headerContainer = document.querySelector('.header_container')

const filtersContainer = document.querySelector('.filters')

const moviesContainer = document.querySelector('.moveies')

const nextPageBTN = document.getElementById('next')
const prevPageBTN = document.getElementById('prev')

let genres = []
let peoples

let showSlideBarMovies = true
let pageNumber = 1
let state = 'home'

let isLoading = false

let searchText = ''
let debounceTimer

let headerChangeInterval
let headerIndex = 0

const filterOption = {
    vote: ['All' , ''],
    year : ['All' , ''],
    genres : ['All' , ''],
    genresNames : [],
    genresIDs : [],
    arrange : ['Popular' , 'popularity.desc'],
}

const filtersOptions = ['genres' , 'vote' , 'year' , 'arrange']

const carouselBTNs = []

let favedMovies = {}

const stringMessages = {
    searchMessageBasic : 'لطفا چیزی برای سرچ تایپ کنید',
    searchMessageResult : 'نتیجه پیدا شده است',
    errorMessageNoConnection : 'خطایی در ارتباط رخ داده است، لطفا مجدد تلاش کنید',
    errorMessage404 : 'پیدا نشد',
    errorImageLoad : 'تصویر بارگذاری نشده است'
}

let yearNumbersOnFirstLoad = [1994 , 2003 , 2013 , '']
let yearMoviesOnFirstLoad = {}