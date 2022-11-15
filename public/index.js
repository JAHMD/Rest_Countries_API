const html = document.documentElement;
const modeBtn = document.getElementById("mode-container");
const modeIcon = document.getElementById("mode-icon");
const modeText = document.querySelector("#mode-container #mode  span");
const regionFilter = document.getElementById("region-filter");
const regionsMenu = document.getElementById("regions");
const card = document.querySelector("#cards-container .card");

// assign the chosen mode to the page
window.addEventListener("load", () => {
  html.className = localStorage.getItem("mode");
  html.classList.contains("dark")
    ? (modeText.innerText = "Light")
    : (modeText.innerText = "Dark");
});

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

// toggling the regions menu and chose a region to show
regionFilter.addEventListener("click", (e) => {
  regionsMenu.classList.toggle("active");
  regionFilter.querySelector("i").classList.toggle("rotate-90");
  const regions = regionsMenu.querySelectorAll("li");
  if ([...regions].includes(e.target)) {
    regionFilter.querySelector("#filter p").textContent = e.target.textContent;
  }
});

// go to country details
card.addEventListener("click", () => {
  location.assign("../detail.html");
});
