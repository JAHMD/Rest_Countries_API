const BASE_URL = "https://restcountries.com/v3/all";
const loader = document.getElementById("loader-container");
// header
const html = document.documentElement;
const header = document.getElementById("search-section");
const modeBtn = document.getElementById("mode-container");
const modeIcon = document.getElementById("mode-icon");
const modeText = document.querySelector("#mode-container #mode  span");
// search
const searchBar = document.getElementById("search-bar");
const searchInput = document.getElementById("search-input");
// filter
const regionsFilter = document.getElementById("region-filter");
const regionsMenu = document.getElementById("menu-container");
const regions = [...regionsMenu.querySelectorAll("li")];
// cards
const cardsContainer = document.getElementById("cards-container");
const noCardsFound = document.getElementById("no-countries");
// additional
const toTopBtn = document.getElementById("to-top-btn");
const footer = document.querySelector("footer");
const params = {
  url: BASE_URL,
  region: "All",
  searchValue: "",
  countries: [],
  foundCountries: [],
  countriesToShow: [],
  start: 0,
  end: 0,
  state: false,
};
// observer
const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};
const observer = new IntersectionObserver(handler, options);
observer.observe(footer);

// app starts here
document.addEventListener("loadstart", setTheMode());
startTheApp(params);

// change page mode
modeBtn.addEventListener("click", () => {
  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    modeIcon.classList.add("fa-moon");
    modeIcon.classList.remove("fa-sun");
    modeText.innerText = "Dark";
    window.localStorage.setItem("mode", "");
  } else {
    html.classList.add("dark");
    modeIcon.classList.remove("fa-moon");
    modeIcon.classList.add("fa-sun");
    modeText.innerText = "Light";
    window.localStorage.setItem("mode", "dark");
  }
});

// search bar function
searchInput.addEventListener("input", function () {
  params.searchValue = this.value;
  params.state = true;
  params.end = 0;
  cardsContainer.innerText = "";
  observer.observe(footer);
  showCards(params);
});

// toggling the regions menu and chose a region to show
regionsFilter.addEventListener("click", (e) => {
  regionsMenu.classList.toggle("active");
  regionsFilter.querySelector("i").classList.toggle("rotate-90");
  // change the filter name
  if (regions.includes(e.target)) {
    regionsFilter.querySelector("#filter p").innerText = e.target.innerText;
    const selectedRegion = e.target.innerText;
    params.region = selectedRegion;
    params.end = 0;
    cardsContainer.innerText = "";
    showCards(params);
  }
});

// show "to top" button
window.addEventListener("scroll", () => {
  if (scrollY >= 300) {
    toTopBtn.classList.remove("translate-x-16");
    toTopBtn.classList.add("translate-x-0");
  } else {
    toTopBtn.classList.add("translate-x-16");
    toTopBtn.classList.remove("translate-x-0");
  }
});

toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});

// go to country details
// card.addEventListener("click", () => {
//   window.location.assign("./detail.html");
// });

// the chosen mode function
function setTheMode() {
  html.className = localStorage.getItem("mode");
  html.classList.contains("dark")
    ? (modeText.innerText = "Light")
    : (modeText.innerText = "Dark");
}

// fetching rest countries api
async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

// generating and showing countries cards
async function startTheApp(params = {}) {
  const countries = await fetchData(params.url);
  params.countries = countries;
  params.foundCountries = [...countries];
  showCards(params);
}

// show data
function showCards(params = {}) {
  if (params.end <= params.foundCountries.length) {
    params.start = params.end;
    params.end = params.start + 10;
    // params.countriesToShow = [...params.countries].slice(
    //   params.start,
    //   params.end
    // );
    // generate cards
    const cards = createCards(params);
    // appending cards to the main container
    cardsContainer.append(cards);
    // content loaded? remove the loader
    loader.classList.add("hidden");
  }
}
// create cards
function createCards(params = {}) {
  findCountries(params);
  let newCountries = [...params.foundCountries].slice(params.start, params.end);
  const documentFragment = document.createDocumentFragment();
  if (params.foundCountries.length <= 10)
    newCountries = [...params.foundCountries];
  // show no results found
  if (newCountries.length === 0 && params.searchValue) {
    noCardsFound.classList.remove("hidden");
    return noCardsFound;
  }
  // looping through the countries
  for (let country of newCountries) {
    if (country.name.common === "Israel") continue;
    // card start's here
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card");
    // creating country flag
    const flag = createFlag(country);
    // creating country general info
    const generalInfo = createGeneralInfo(country);
    // appending country's info to country's card
    cardContainer.append(flag, generalInfo);
    // appending country's card to the document fragment
    documentFragment.append(cardContainer);
  }
  return documentFragment;
}

// creating the flag container
function createFlag(country) {
  // flag holder
  const flagContainer = document.createElement("div");
  flagContainer.classList.add(..."img-holder h-44 lg:h-40 flex".split(" "));
  // flag
  const flagImg = document.createElement("img");
  flagImg.classList.add(..."object-cover w-full h-full".split(" "));
  flagImg.alt = "flag";
  flagImg.src = country.flags[1];
  // appending the flag to its container
  flagContainer.append(flagImg);
  return flagContainer;
}

// creating country card's info
function createGeneralInfo(country) {
  const textContainer = document.createElement("div");
  textContainer.classList.add(..."text-container p-6".split(" "));
  // country's name
  const countryName = document.createElement("h3");
  countryName.classList.add(
    ..."country-name mb-6 font-extrabold text-xl text-light-300 dark:text-dark-300".split(
      " "
    )
  );
  countryName.innerText = country.name.common;
  // country info
  const infoContainer = document.createElement("div");
  infoContainer.classList.add(..."info-container space-y-2".split(" "));
  // country's population
  const populationCont = document.createElement("p");
  const population = document.createElement("span");
  populationCont.classList.add(
    ..."population text-base font-semibold tracking-wider".split(" ")
  );
  populationCont.innerText = "Population: ";
  population.classList.add("text-sm", "font-light");
  population.innerText = country.population;
  populationCont.append(population);
  // country's region
  const regionCont = document.createElement("p");
  const region = document.createElement("span");
  regionCont.classList.add(
    ..."region text-base font-semibold tracking-wider".split(" ")
  );
  regionCont.innerText = "Region: ";
  region.classList.add("text-sm", "font-light");
  region.innerText = country.region;
  regionCont.append(region);
  // country's capital
  const capitalCont = document.createElement("p");
  const capital = document.createElement("span");
  capitalCont.classList.add(
    ..."capital text-base font-semibold tracking-wider".split(" ")
  );
  capitalCont.innerText = "Capital: ";
  capital.classList.add("text-sm", "font-light", "leading-relaxed");
  capital.innerText = country?.capital?.join(", ") ?? "No capital";
  capitalCont.append(capital);
  // appending info to info container
  infoContainer.append(populationCont, regionCont, capitalCont);
  // appending the elements to the text container
  textContainer.append(countryName, infoContainer);
  return textContainer;
}

// find countries function
function findCountries(params = {}) {
  const foundCountries = [];
  let countryName = "";
  const userValue = params.searchValue.trim().toLowerCase();
  for (let country of params.countries) {
    if (country.name.common === "Israel") continue;
    countryName = country.name.common.toLowerCase();
    if (countryName.includes(userValue)) {
      if (country.region === params.region || params.region === "All")
        foundCountries.push(country);
    }
  }
  params.foundCountries = [...foundCountries];
}

// observer callback function
function handler(entries) {
  if (entries[0].isIntersecting) {
    showCards(params);
  }
}
