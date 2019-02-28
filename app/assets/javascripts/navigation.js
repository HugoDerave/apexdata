document.addEventListener("DOMContentLoaded", function() {
  const elements = document.querySelectorAll("[data-action='toggle-navigation']")

  elements.forEach((element) => element.removeEventListener("click", toggleNavigation))
  elements.forEach((element) => element.addEventListener("click", toggleNavigation))
})

function toggleNavigation(event) {
  event.preventDefault()

  const target = document.querySelector("[data-target='navigation']")

  target.classList.toggle("active")
}
