document.addEventListener("DOMContentLoaded", function() {
  const detailElements = document.querySelectorAll("[data-action='item-columns-change-details']")
  detailElements.forEach(element => element.addEventListener("click", changeDetails))

  const categoryElements = document.querySelectorAll("[data-action='item-columns-change-category']")
  categoryElements.forEach(element => element.addEventListener("click", changeCategory))

  const viewDetailsElements = document.querySelectorAll("[data-action='item-columns-view-details']")
  viewDetailsElements.forEach(element => element.addEventListener("click", viewingDetails))

  const viewItemsElements = document.querySelectorAll("[data-action='item-columns-view-items']")
  viewItemsElements.forEach(element => element.addEventListener("click", viewingItems))

  const viewItemsCategories = document.querySelectorAll("[data-action='item-columns-view-categories']")
  viewItemsCategories.forEach(element => element.addEventListener("click", viewingCategories))

  document.addEventListener("setCompare", viewingItems)

  setColumnWidth()

  if (!detailElements.length) return

  if (document.body.clientWidth > 1100) document.querySelector("[data-action='item-columns-change-details']").click()
})

window.addEventListener("resize", setColumnWidth)

function changeCategory(event) {
  event.preventDefault()

  const blocks = document.querySelectorAll("[item-columns-target]")
  blocks.forEach(block => {
    block.style.display = "none"
    block.querySelector(".item-columns__detail").style.display = "none"
  })

  const target = this.dataset.target
  const targetElement = document.querySelector(`[item-columns-target='${ target }']`)
  targetElement.style.display = "flex"

  const activeClass = "item-columns__sidebar-item--is-active"
  const currentActive = document.querySelector(`.${ activeClass }`)
  if (currentActive) currentActive.classList.remove(activeClass)
  this.classList.add(activeClass)

  if (document.body.clientWidth > 1100) targetElement.querySelector("[data-action='item-columns-change-details']").click()

  viewingItems(event)

  document.dispatchEvent(new CustomEvent("changeCategory"))
}

function changeDetails(event) {
  const isTarget = event.target.closest("a")
  if (isTarget) {
    if (isTarget.href != "#") return
  }

  event.preventDefault()

  const data = JSON.parse(this.dataset.columnsData)

  const targetParent = this.closest("[item-columns-target]").querySelector("[data-role='item-columns-details']")
  if (targetParent.style.display != "block") targetParent.style.display = "block"

  if (this.classList.contains("item-columns__item--is-active")) return

  setActiveItem(this)
  setActiveExtraStaticContent(targetParent, data["name"].toLowerCase().replace(" ", "_"))

  changeBarGraphs(targetParent, data)
  changeCircleGraphs(targetParent, data)
  changeStaticValues(targetParent, data)
  changeIcon(targetParent, this.dataset.iconSource)

  viewingDetails(event)

  document.dispatchEvent(new CustomEvent("changeItem", {
    detail: {
      name: data["name"].toLowerCase().replace(" ", "_"),
      detailElement: targetParent
    }
  }))
}

function changeIcon(parent, image) {
  const iconElement = parent.querySelector("[data-role='item-columns-detail-icon']")
  iconElement.src = image
}

function changeStaticValues(parent, data) {
  const elements = parent.querySelectorAll("[data-role='static-value']")

  elements.forEach(element => {
    const target = element.dataset.target
    const value = data[target]

    element.innerHTML = value

    const parent = element.closest(".item-columns__data")

    if (!parent) return

    if (value == undefined) {
      parent.style.display = "none"
    } else {
      parent.style = ""
    }
  })
}

function changeBarGraphs(parent, data) {
  const graphs = parent.querySelectorAll("[data-role='bar-graph']")

  graphs.forEach(graph => {
    const dataTarget = graph.dataset.target
    const barElement = graph.querySelector("[data-role='bar-graph-bar']")
    const valueElement = graph.querySelector("[data-role='bar-graph-value']")

    valueElement.innerHTML = data[dataTarget]

    setBarWidth(barElement, data[dataTarget])
  })
}

function setBarWidth(barElement, value) {
  const lineElement = barElement.querySelector("[data-role='bar-graph-line']")
  const maxValue = barElement.dataset.max
  const valuePercentage = (value / maxValue) * 100

  lineElement.style.width = valuePercentage + "%"
}

function changeCircleGraphs(parent, data) {
  const graphs = parent.querySelectorAll("[data-role='circle-graph']")

  graphs.forEach(graph => {
    const dataTarget = graph.dataset.target
    const barElement = graph.querySelector("[data-role='circle-graph-bar']")
    const valueElement = graph.querySelector("[data-role='circle-graph-value']")
    const damageModifierElement = graph.querySelector("[data-role='damage-modifier']")
    const extraDamageElement = graph.querySelector("[data-role='extra-damage']")

    valueElement.innerHTML = data[dataTarget]

    if (data.damage_modifier && damageModifierElement) {
      damageModifierElement.innerHTML = "x" + data.damage_modifier
    } else if (damageModifierElement) {
      damageModifierElement.innerHTML = ""
    }

    if (data.extra_damage && extraDamageElement) {
      extraDamageElement.innerHTML = data.extra_damage
    } else if (extraDamageElement) {
      extraDamageElement.innerHTML = ""
    }

    setCircleValue(barElement, data[dataTarget])
  })
}

function setCircleValue(barElement, value) {
  const maxValue = barElement.dataset.max
  const valuePercentage = (value / maxValue) * 100
  const currentValue = parseFloat(barElement.style.getPropertyValue("--value"))

  if (currentValue) {
    const difference = valuePercentage - currentValue

    if (Math.round(difference) != 0) {
      const transitionDuration = 200
      const fps = 20
      const interval = transitionDuration / fps
      const step = difference / interval
      let currentStep = currentValue

      let iteration = 0
      const intervalTimer = setInterval(() => {
        iteration++
        currentStep = currentStep + step

        barElement.style.setProperty("--value", currentStep)

        if (iteration == interval) {
          barElement.style.setProperty("--value", valuePercentage)
          clearInterval(intervalTimer)
        }
      }, interval)
    }
  } else {
    barElement.style.setProperty("--value", valuePercentage)
  }
}

function makeAttachmentsTable(parentElement, data) {
  const tableElement = parentElement.querySelector("[data-role='attachments-table']")
  if (!tableElement || !data) return

  tableElement.innerHTML = ""
  attachmentIcons = JSON.parse(tableElement.dataset.iconUrls)

  Object.values(data).forEach(attachmentType => {
    const attachmentTypeElement = document.createElement("div")
    attachmentTypeElement.classList.add("attachments-table__item")
    attachmentTypeElement.setAttribute("data-action", "toggle-dropdown")

    const attachmentTypeIcon = document.createElement("img")
    attachmentTypeIcon.setAttribute("src", attachmentIcons[attachmentType[0]])

    const dropdownElement = document.createElement("div")
    dropdownElement.classList.add("attachments-table__dropdown")
    dropdownElement.setAttribute("data-dropdown", "")
    dropdownElement.addEventListener("click", toggleDropdown)

    attachmentTypeElement.append(attachmentTypeIcon)
    attachmentTypeElement.append(dropdownElement)
    tableElement.append(attachmentTypeElement)
  })
}

function setActiveItem(item) {
  const activeClass = "item-columns__item--is-active"
  const currentActive = document.querySelector(`.${ activeClass }`)
  if (currentActive) currentActive.classList.remove(activeClass)

  setTimeout(() => {item.classList.add(activeClass)})
}

function setActiveExtraStaticContent(parentElement, id) {
  const activeClass = "item-columns__detail-extra-static-content--is-active"
  const contentElement = parentElement.querySelector(`[data-extra-static-content="${ id }"]`)
  const currentActive = document.querySelector(`.${ activeClass }`)

  if (currentActive) currentActive.classList.remove(activeClass)
  contentElement.classList.add(activeClass)
}

function viewingCategories(event) {
  const element = event.target.closest("[data-item-columns-main]")
  const activeItem = document.querySelector(".item-columns__item--is-active")

  element.classList.remove("item-columns--viewing-details")
  element.classList.remove("item-columns--viewing-items")

  if (activeItem) activeItem.classList.remove("item-columns__item--is-active")
}

function viewingItems(event) {
  let element = ""
  if (event.detail.element) {
    element = event.detail.element
  } else {
    element = event.target.closest("[data-item-columns-main]")
  }
  const activeItem = document.querySelector(".item-columns__item--is-active")

  element.classList.remove("item-columns--viewing-details")
  element.classList.add("item-columns--viewing-items")

  if (activeItem) activeItem.classList.remove("item-columns__item--is-active")
}

function viewingDetails(event) {
  const element = event.target.closest("[data-item-columns-main]")

  element.classList.remove("item-columns--viewing-items")
  element.classList.add("item-columns--viewing-details")
}

function setColumnWidth() {
  const mainElement = document.querySelector("[data-item-columns-main]")
  if (!mainElement) return
  const mainElementWidth = mainElement.offsetWidth

  let modifier = 1
  if (document.body.clientWidth > 640) modifier = 2
  if (document.body.clientWidth > 1100) modifier = 3

  const elements = mainElement.querySelectorAll(".item-columns__sidebar, .item-columns__center, .item-columns__detail")
  elements.forEach(element => element.style.width = mainElementWidth / modifier + "px")

  const contentElements = mainElement.querySelectorAll(".item-columns__content")
  contentElements.forEach(element => element.style.width = mainElementWidth / modifier * 2 + "px")
}
