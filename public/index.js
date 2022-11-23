const BASE_URL = "https://restcountries.com/v3/all";
const homePageLoader = document.getElementById("loader-container");
// header
const html = document.documentElement;
const pageHeader = document.getElementById("page-header");
const modeBtn = document.getElementById("mode-btn");
const modeIcon = document.getElementById("mode-icon");
const modeText = document.querySelector("#mode-btn #mode-text  span");
// main section
const main = document.querySelector("main");
// search
const searchBar = document.getElementById("search-bar");
const searchInput = document.getElementById("search-input");
// filter
const regionsFilterBtn = document.getElementById("filter-btn");
const regionsMenu = document.getElementById("menu-container");
const regions = [...document.querySelectorAll("#menu-container li")];
const allowedElementsArray = [
  regionsFilterBtn,
  regionsMenu,
  ...regionsFilterBtn.children,
];
// countries's cards
const cardsContainer = document.getElementById("cards-container");
const noCardsFound = document.getElementById("no-countries");
// country details
const countryDetailsSection = document.getElementById("details-section");
const countryDetailsContainer = document.getElementById(
  "country-details-container"
);
const detailsContent = document.getElementById("country-details-content");
const backBtn = document.getElementById("back-btn");
// additional
const toTopBtn = document.getElementById("to-top-btn");
const footer = document.querySelector("footer");
const params = {
  url: BASE_URL,
  region: "All",
  searchValue: "",
  countries: [],
  foundCountries: [],
  start: 0,
  end: 0,
  state: false,
};
// observer
const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.75,
};
const observer = new IntersectionObserver(observerHandler, options);

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
  showCards(params);
});

// toggling the regions menu
document.addEventListener("click", (e) => {
  if (!allowedElementsArray.includes(e.target)) {
    regionsMenu.classList.remove("active");
    regionsFilterBtn.querySelector("i").classList.remove("rotate-90");
    return;
  } else if (e.target !== regionsMenu) {
    regionsMenu.classList.toggle("active");
    regionsFilterBtn.querySelector("i").classList.toggle("rotate-90");
  }
});

// choosing a region to show
regions.forEach((region) => {
  region.addEventListener("click", (e) => {
    // change the filter name
    regionsFilterBtn.querySelector(".filter-text").innerText =
      e.target.innerText;
    const selectedRegion = e.target.innerText;
    params.region = selectedRegion;
    params.end = 0;
    cardsContainer.innerText = "";
    showCards(params);
  });
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
backBtn.addEventListener("click", closeDetailsWindow);

// functions go here --------------------------------------------
// the chosen mode function
function setTheMode() {
  html.className = localStorage.getItem("mode");
  html.classList.contains("dark")
    ? (modeText.innerText = "Light")
    : (modeText.innerText = "Dark");
}

// observer callback function
function observerHandler(entries) {
  if (entries[0].isIntersecting) {
    showCards(params);
  }
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
  for (let country of countries) {
    if (country.name.common === "Israel") continue;
    params.countries.push(country);
  }
  params.foundCountries = [...params.countries];
  // start observing and showing cards
  observer.observe(footer);
  showCards(params);
}

// show data
function showCards(params = {}) {
  if (params.end <= params.foundCountries.length) {
    params.start = params.end;
    params.end = params.start + 10;
    const cards = createCards(params);
    // appending cards to the main container
    cardsContainer.append(cards);
    countryDetailsWindow();
    // content loaded? remove the loader
    homePageLoader.classList.add("hidden");
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
    // card start's here
    const cardContainer = document.createElement("article");
    cardContainer.classList.add("card");
    cardContainer.id = country.name.common.replaceAll(" ", "-");
    // creating country flag
    const flag = createFlag(country);
    flag.className = "img-holder h-44 lg:h-40 flex";
    // creating country general info
    const countryName = createCountryName(country);
    countryName.className =
      "mb-5 font-extrabold text-xl text-light-300 dark:text-dark-300";
    // other info
    const generalInfo = createGeneralInfo(country);
    generalInfo.classList.add("p-6");
    generalInfo.prepend(countryName);
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
  // flag
  const flagImg = document.createElement("img");
  flagImg.className = "object-cover w-full h-full";
  flagImg.alt = `${country.name.common} flag`;
  flagImg.src = country.flags[1];
  // appending the flag to its container
  flagContainer.append(flagImg);
  return flagContainer;
}

// creating country card's info
function createCountryName(country) {
  const countryName = document.createElement("h2");
  countryName.classList.add("country-name");
  countryName.innerText = country.name.common;
  return countryName;
}

function createGeneralInfo(country, subRegion = "") {
  // country info
  const generalInfoContainer = document.createElement("ul");
  generalInfoContainer.className = "general-info-container space-y-2";
  // country's population
  const populationCont = document.createElement("li");
  const population = document.createElement("span");
  populationCont.className =
    "population text-base font-semibold tracking-wider";
  populationCont.innerText = "Population: ";
  population.classList.add("text-sm", "font-light");
  population.innerText = country.population;
  populationCont.append(population);
  // country's capital
  const capitalCont = document.createElement("li");
  const capital = document.createElement("span");
  capitalCont.className = "capital text-base font-semibold tracking-wider";
  capitalCont.innerText = "Capital: ";
  capital.classList.add("text-sm", "font-light", "leading-relaxed");
  capital.innerText = country?.capital?.join(", ") ?? "No capital";
  capitalCont.append(capital);
  // country's region
  const regionCont = document.createElement("li");
  const region = document.createElement("span");
  regionCont.className = "region text-base font-semibold tracking-wider";
  regionCont.innerText = "Region: ";
  region.classList.add("text-sm", "font-light");
  region.innerText = country.region;
  regionCont.append(region);
  // appending info to info container
  generalInfoContainer.append(populationCont, capitalCont, regionCont);
  // subregion
  if (subRegion) {
    const subregionCon = document.createElement("li");
    subregionCon.className = "text-base font-semibold tracking-wider";
    subregionCon.innerText = "Subregion: ";
    const subregion = document.createElement("span");
    subregion.className = "text-sm font-light";
    subregion.innerText = subRegion;
    subregionCon.append(subregion);
    generalInfoContainer.append(subregionCon);
  }
  return generalInfoContainer;
}

// create additional info
function createAdditionalInfo(country) {
  const additionalInfoContainer = document.createElement("ul");
  additionalInfoContainer.className = "mt-10 sm:mt-0 space-y-2 max-w-[250px]";
  // top level domain
  const topLevelDomainCon = document.createElement("li");
  topLevelDomainCon.innerText = "Top Level Domain: ";
  const topLevelDomain = document.createElement("span");
  const tldValue = country?.tld?.join(", ") ?? "Unknown";
  topLevelDomain.innerText = `(${tldValue})`;
  topLevelDomainCon.append(topLevelDomain);
  // currencies
  const currenciesCon = document.createElement("li");
  currenciesCon.innerText = "Currencies: ";
  const currencies = document.createElement("span");
  const currenciesArray = [];
  for (let i in country.currencies) {
    currenciesArray.push(country.currencies[i].name);
  }
  currencies.innerText = currenciesArray.join(", ");
  currenciesCon.append(currencies);
  // languages
  const languagesCon = document.createElement("li");
  languagesCon.innerText = "Languages: ";
  const languages = document.createElement("span");
  const languagesArray = [];
  for (let i in country.languages) {
    languagesArray.push(country.languages[i]);
  }
  languages.innerText = languagesArray;
  languagesCon.append(languages);
  // adding style to the elements
  [topLevelDomainCon, currenciesCon, languagesCon].forEach(
    (container) =>
      (container.className = "text-base font-semibold tracking-wider")
  );
  [topLevelDomain, currencies, languages].forEach(
    (span) => (span.className = "text-sm font-light")
  );
  // appending the elements to the container
  additionalInfoContainer.append(
    topLevelDomainCon,
    currenciesCon,
    languagesCon
  );
  return additionalInfoContainer;
}

// find countries function
function findCountries(params = {}) {
  const foundCountries = [];
  let countryName = "";
  const userValue = params.searchValue.trim().toLowerCase();
  for (let country of params.countries) {
    countryName = country.name.common.toLowerCase();
    if (countryName.includes(userValue)) {
      if (country.region === params.region || params.region === "All")
        foundCountries.push(country);
    }
  }
  params.foundCountries = [...foundCountries];
}

// country details
function countryDetailsWindow() {
  const countriesCards = document.querySelectorAll(".card");
  countriesCards.forEach((countryCard) => {
    countryCard.addEventListener("click", function () {
      const countryName = this.id.replaceAll("-", " ");
      countryDetails(countryName);
      countryDetailsSection.classList.add("active");
      pageHeader.classList.remove("relative");
      pageHeader.classList.add(..."fixed w-full".split(" "));
      document.body.classList.add("overflow-y-hidden");
      main.classList.add("pt-32");
    });
  });
}

// closing the details window
function closeDetailsWindow() {
  countryDetailsSection.classList.remove("active");
  pageHeader.classList.add("relative");
  pageHeader.classList.remove(..."fixed w-full".split(" "));
  document.body.classList.remove("overflow-y-hidden");
  main.classList.remove("pt-32");
}

// adding selected country details
function countryDetails(countryName) {
  countryDetailsContainer.innerText = "";
  detailsContent.innerText = "";
  const infoContainer = document.createElement("div");
  infoContainer.id = "info-container";
  infoContainer.className =
    "w-full flex flex-wrap sm:gap-4 justify-between items-center text-light-text dark:text-dark-text";

  for (let country of params.countries) {
    if (country.name.common === countryName) {
      // creating country flag
      const flag = createFlag(country);
      flag.className =
        "img-holer rounded-md shrink-0 overflow-hidden shadow-md";
      // country name
      const countryName = createCountryName(country);
      countryName.className = "mb-6 w-full font-extrabold text-2xl";
      // country info
      const generalInfo = createGeneralInfo(country, country.subregion ?? "");
      const additionalInfo = createAdditionalInfo(country);
      infoContainer.append(generalInfo, additionalInfo);
      detailsContent.append(countryName, infoContainer);
      // border countries
      if (country.borders) {
        const borderCountriesContainer = createBorderCountries(country.borders);
        detailsContent.append(borderCountriesContainer);
      }
      countryDetailsContainer.append(flag, detailsContent);
    }
  }
}

// border countries
function createBorderCountries(borderCountries) {
  const borderCountriesSection = document.createElement("div");
  borderCountriesSection.id = "border-countries-container";
  borderCountriesSection.className = "w-full mt-10";
  // border countries header
  const bordersHeader = document.createElement("h3");
  bordersHeader.className = "header mb-4 text-lg font-semibold";
  bordersHeader.innerText = "Border Countries: ";
  // border countries
  const borderCountriesContainer = document.createElement("div");
  borderCountriesContainer.className =
    "flex gap-4 flex-wrap text-sm select-none";
  for (let countryAbbr of borderCountries) {
    const countryBtn = document.createElement("button");
    countryBtn.className = "country btn";
    countryBtn.type = "button";
    for (let country of params.countries) {
      if (country.cca3 === countryAbbr) {
        countryBtn.innerText = country.name.common;
        borderCountriesContainer.append(countryBtn);
      }
    }
  }
  changeCountryDetails([...borderCountriesContainer.children]);
  borderCountriesSection.append(bordersHeader, borderCountriesContainer);
  return borderCountriesSection;
}

// change the country details according to the selected border country
function changeCountryDetails(borderCountries) {
  borderCountries.forEach((borderCountry) => {
    borderCountry.addEventListener("click", function () {
      countryDetails(this.innerText);
    });
  });
}
