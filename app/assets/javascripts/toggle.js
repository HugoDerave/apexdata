document.addEventListener("DOMContentLoaded", function() {
  const elements = document.querySelectorAll("[data-action='toggle']")

  elements.forEach((element) => element.removeEventListener("click", moreDetails))
  elements.forEach((element) => element.addEventListener("click", moreDetails))
})

function moreDetails(event) {
  event.preventDefault()

  const target = this.dataset.target
  const targetElement = document.querySelector(`[data-is=${ target }]`)
  const display = (window.getComputedStyle ? getComputedStyle(targetElement, null) : targetElement.currentStyle).display
  if (display == "none") {
    targetElement.style.display = "block";
  } else {
    targetElement.style.display = "none";
  }
}