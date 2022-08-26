let counter

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
    .map(x => `<img src="${x}.png">`)
    .join('')
}

function handleClick (event) {
  event.preventDefault()
  document.getElementById('instructions').style.display = 'none'
  counter.style.display = 'inline'
  counter.style.opacity = 1
  counter.dataset.value = +counter.dataset.value + 1
  counter.innerHTML = generateCounterImage(counter.dataset.value)
  window.localStorage.setItem('counter', counter.dataset.value)
  const audio = document.getElementById('audio')
  audio.currentTime = 0
  audio.play()
  fadeOut(counter)
}

document.addEventListener('DOMContentLoaded', event => {
  if (new URLSearchParams(location.search).get('green')) {
    document.body.classList.replace('transparent', 'green')
  }
  counter = document.getElementById('counter')
  counter.dataset.value = window.localStorage.getItem('counter') || -1
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

  document.getElementById('customButton').addEventListener('click', event => {
    event.preventDefault()
    const customCounter = document.getElementById('customValue').value
    if (
      customCounter !== null &&
      !isNaN(customCounter) &&
      +customCounter >= 0
    ) {
      counter.dataset.value = +customCounter - 1
      window.localStorage.setItem('counter', +customCounter - 1)
    }
    document.getElementById('custom').style.display = 'none'
    document.addEventListener('click', handleClick)
  })
})
