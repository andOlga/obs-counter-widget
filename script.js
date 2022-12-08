let counter
let countername = 'counter'

function fadeOut (counter) {
  function fadeOutInner (counter) {
    if (Number(counter.style.opacity) === 0) {
      counter.style.display = 'none'
    } else {
      counter.style.opacity -= 0.01
      setTimeout(_ => fadeOutInner(counter), 10)
    }
  }
  setTimeout(_ => fadeOutInner(counter), 5000)
}

function generateCounterImage (value) {
  return String(value)
    .split('')
    .map(x => `<img src="digit/${x}.png">`)
    .join('')
}

function handleClick (event) {
  event.preventDefault()
  document.getElementById('instructions').style.display = 'none'
  counter.style.display = 'inline'
  counter.style.opacity = 1
  counter.dataset.value = +counter.dataset.value + 1
  counter.innerHTML = generateCounterImage(counter.dataset.value)
  window.localStorage.setItem(countername, counter.dataset.value)
  const audio = document.getElementById('audio')
  audio.currentTime = 0
  audio.play()
  fadeOut(counter)
}

document.addEventListener('DOMContentLoaded', event => {
  const params = new URLSearchParams(location.search)
  if (params.get('counter')) {
    countername = `counter_${params.get('counter')}`
  }
  counter = document.getElementById('counter')
  counter.dataset.value = window.localStorage.getItem(countername) || -1
  counter.innerHTML = generateCounterImage(counter.dataset.value)
  if (counter.dataset.value !== '-1') {
    document.getElementById('instructions').style.display = 'none'
    counter.style.display = 'inline'
    counter.style.opacity = 1
    fadeOut(counter)
  }

  document.addEventListener('click', handleClick)

  document.addEventListener('contextmenu', event => {
    event.preventDefault()
    document.removeEventListener('click', handleClick)
    document.getElementById('custom').style.display = 'block'
    document.getElementById('customValue').value = +counter.dataset.value
    document.getElementById('customValue').focus()
  })

  function updateCustom(event) {
    if (event.type === 'keydown' && event.key !== 'Enter') return
    event.preventDefault()
    const customCounter = document.getElementById('customValue').value
    if (
      customCounter !== null &&
      !isNaN(customCounter) &&
      +customCounter >= 0
    ) {
      counter.dataset.value = +customCounter - 1
      window.localStorage.setItem(countername, +customCounter - 1)
    }
    document.getElementById('custom').style.display = 'none'
    document.addEventListener('click', handleClick)
    if (event.type !== 'click') document.body.click()
  }

  document.getElementById('customValue').addEventListener('keydown', updateCustom)
  document.getElementById('customButton').addEventListener('click', updateCustom)
})
