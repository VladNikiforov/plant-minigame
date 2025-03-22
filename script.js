let count = 0
let state = 1
let isWatering = false
let cooldown = false

const raindropsContainer = document.getElementById('raindrops')
const countDisplay = document.getElementById('count')
const wateringCan = document.getElementById('wateringCan')
const canPlace = document.getElementById('canPlace')
const plant = document.getElementById('plant')

const canPosition = (function () {
  const rect = canPlace.getBoundingClientRect()
  return { top: rect.top + window.scrollY, left: rect.left + window.scrollX }
})()

Object.assign(wateringCan.style, {
  top: `${canPosition.top}px`,
  left: `${canPosition.left}px`,
})

function updateCount(value) {
  count = value
  countDisplay.innerText = count
}

function createRaindrop() {
  if (count >= 7) return

  const raindrop = document.createElement('div')
  raindrop.className = 'raindrop'
  raindrop.innerText = '💧'
  Object.assign(raindrop.style, {
    left: `${Math.random() * window.innerWidth}px`,
    top: '0px',
  })

  raindropsContainer.appendChild(raindrop)

  const fallInterval = setInterval(() => {
    const top = parseFloat(raindrop.style.top)
    if (top < window.innerHeight) {
      raindrop.style.top = `${top + 2}px`
    } else {
      clearInterval(fallInterval)
      raindrop.remove()
    }
  }, 20)

  raindrop.addEventListener('click', () => {
    updateCount(count + 1)
    raindrop.remove()
    clearInterval(fallInterval)
  })
}

setInterval(createRaindrop, 1000)

function updateWateringCanMirror() {
  const plantRect = plant.getBoundingClientRect()
  const canRect = wateringCan.getBoundingClientRect()

  if (wateringCan.classList.contains('watering')) {
    wateringCan.style.transform = 'rotate(-45deg)'
  } else {
    wateringCan.style.transform = canRect.left + canRect.width / 2 < plantRect.left + plantRect.width / 2 ? 'scaleX(-1)' : 'scaleX(1)'
  }
}

function startWatering() {
  if (isWatering || cooldown || state == 7 || count < 1) return

  updateCount(count - 1)
  isWatering = true
  wateringCan.classList.add('watering')
  plant.classList.add('watered')

  setTimeout(function () {
    plant.classList.remove('watered')
    wateringCan.classList.remove('watering')
    isWatering = false

    state++
    plant.src = `assets/plant/${state}.png`

    cooldown = true
    setTimeout(() => {
      cooldown = false
    }, 2000)
  }, 2000)
}

function onMouseMove(e, offsetX, offsetY) {
  canPosition.left = e.clientX - offsetX
  canPosition.top = e.clientY - offsetY

  Object.assign(wateringCan.style, {
    left: `${canPosition.left}px`,
    top: `${canPosition.top}px`,
  })

  updateWateringCanMirror()

  const plantRect = plant.getBoundingClientRect()
  const canRect = wateringCan.getBoundingClientRect()

  if (canRect.left < plantRect.right && canRect.right > plantRect.left && canRect.top < plantRect.bottom && canRect.bottom > plantRect.top) {
    startWatering()
  }
}

wateringCan.addEventListener('mousedown', (e) => {
  const offsetX = e.clientX - canPosition.left
  const offsetY = e.clientY - canPosition.top

  function moveHandler(moveEvent) {
    onMouseMove(moveEvent, offsetX, offsetY)
  }

  function upHandler() {
    document.removeEventListener('mousemove', moveHandler)
    document.removeEventListener('mouseup', upHandler)
  }

  document.addEventListener('mousemove', moveHandler)
  document.addEventListener('mouseup', upHandler)
})
