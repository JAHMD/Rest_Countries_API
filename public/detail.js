import { params } from "./index.js";
const html = document.documentElement;
const modeBtn = document.getElementById("mode-container");
const modeIcon = document.getElementById("mode-icon");
const modeText = document.querySelector("#mode-container #mode  span");

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
console.log(params);
