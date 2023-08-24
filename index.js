// const API_URL =
//   "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=507b4d14bf6757bbbed6cadcff6168ec&";

let page = 1;
let API_URL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&api_key=507b4d14bf6757bbbed6cadcff6168ec&`;

const IMG_PATH = `https://image.tmdb.org/t/p/w1280`;
const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?include_adult=false&api_key=507b4d14bf6757bbbed6cadcff6168ec&query="';

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const flix = document.getElementById("flix");
const next = document.querySelector(".nextBtn");
const previous = document.querySelector(".previousBtn");
const pageNumber = document.querySelector(".pageNumber");

getMovies(API_URL);

next.addEventListener("click", pageUp);
previous.addEventListener("click", pageDown);

function pageUp() {
  page++;
  API_URL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&api_key=507b4d14bf6757bbbed6cadcff6168ec&`;
  getMovies(API_URL);
}
function pageDown() {
  page--;
  API_URL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&api_key=507b4d14bf6757bbbed6cadcff6168ec&`;
  getMovies(API_URL);
}

flix.addEventListener("click", () => {
  window.location.reload();
});

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  console.log(data)
  showMovies(data.results);
}

async function searchMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  console.log(data)
  if (data.total_results === 0) {
    alert('No Results!')
  } else {
    pageNumber.style.visibility = 'hidden'
    next.style.visibility = "hidden";
    previous.style.visibility = "hidden";
  showMovies(data.results);
  }
}

function showMovies(movies) {
  checkPage(movies);
  main.innerHTML = "";

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;

    const voteShort = Math.floor(vote_average * 10) / 10
  

    const movieEl = document.createElement("div");

    movieEl.classList.add("movie");

    movieEl.innerHTML = `
        <img
          src="${IMG_PATH + poster_path}"
          alt=""
        />
        <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(voteShort)}">${voteShort}</span>
        </div>
        <div class="overview">
          <h3>Overview</h3>
            ${overview}
        </div>
        `;
    main.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

function checkPage(movies) {
  pageNumber.innerText = `Page: ${page}`;
  if (page === 1) {
    previous.style.cursor = "not-allowed";
    previous.removeEventListener("click", pageDown);
  } else if (page === movies.length) {
    next.style.cursor = "not-allowed";
    next.removeEventListener("click", pageUp);
  } else {
    next.style.cursor = "pointer";
    next.addEventListener("click", pageUp);
    previous.style.cursor = "pointer";
    previous.addEventListener("click", pageDown);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;

  if (searchTerm && searchTerm !== "") {
    searchMovies(SEARCH_API + searchTerm);
    search.value = "";
  } else {
    window.location.reload();
  }
});
