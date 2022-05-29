
const hash = function(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
  h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1>>>0);
};

function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}


const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 100
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
const answerBox = document.querySelector("[data-answer-box]")
const interfereGrid = document.querySelector("[data-interfere-grid]")
const offsetFromDate = new Date(2022, 0, 1)
const msOffset = Date.now() - offsetFromDate
const dayOffset = Math.floor(msOffset / 1000 / 60 / 60 / 24)
var targetWord = ""
const interfereWords = []
var saveAfterGuess = true
var loading = false
const share = document.querySelector('#share');

var lightmode = false
var highcontrast = false

document.getElementById("title").querySelectorAll(".tile").forEach((element) => {
  element.style.color = "white"
})

document.getElementById("rules").querySelectorAll("[data-state]").forEach((element) => {
  element.style.color = "white"
})

function getCSSProperty(prop) {
  return getComputedStyle(document.documentElement).getPropertyValue(prop)
}

function setCSSPropertyRaw(prop, val) {
  document.documentElement.style.setProperty(prop, val)
}

function setCSSProperty(prop, val) {
  document.documentElement.style.setProperty(prop, getCSSProperty(val))
}


function updateColours() {


  setCSSProperty("--correct", lightmode ? (highcontrast ? "--contrast-light-correct" : "--light-default-correct") : (highcontrast ? "--contrast-correct" : "--default-correct"))
  setCSSProperty("--wrong-location", lightmode ? (highcontrast ? "--contrast-light-wrong-location" : "--light-default-wrong-location") : (highcontrast ? "--contrast-wrong-location" : "--default-wrong-location"))
  setCSSProperty("--interfere", lightmode ? (highcontrast ? "--contrast-light-interfere" : "--light-default-interfere") : (highcontrast ? "--contrast-interfere" : "--default-interfere"))
  setCSSProperty("--wrong", lightmode ? (highcontrast ? "--contrast-light-wrong" : "--light-default-wrong") : (highcontrast ? "--contrast-wrong" : "--default-wrong"))
  setCSSProperty("--background", lightmode ? "--light-background" : "default-background")
  setCSSPropertyRaw("--font-colour", lightmode ? "black" : "white")

}

document.getElementById("switch-colours").onclick = () => {
    
  highcontrast = !highcontrast
  window.localStorage.setItem("colourblind", highcontrast)
  updateColours()
  
}

document.getElementById("switch-light").onclick = () => {
    
  lightmode = !lightmode
  window.localStorage.setItem("light", lightmode)

  updateColours()
  
}

window.onload = () => {
  if (window.localStorage.getItem("colourblind") == "true") {
    document.getElementById("switch-colours").setAttribute("checked", "")
    highcontrast = true
  }
  
  if (window.localStorage.getItem("light") == "true") {
    document.getElementById("switch-light").setAttribute("checked", "")
    lightmode = true
  }

  updateColours()
}


function setCharAt(str,index,chr) {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
}

function loadGame(game) {

  loading = true

  for (let c = 0; c < game.length; c += 5) {
    for (let letter = 0; letter < 5; letter++) {
      let index = c+letter
      if (!game[index]) {
        setTimeout(() => {
          loading = false
        },(c*100))
        return
      }
      setTimeout(()=>{pressKey(game[index])}, (c*100)+letter*25)
    }
    setTimeout(()=>{submitGuess(false, !game[c+5])}, (c*100)+100)
  }
}


function saveGame() {
  var newData = {}
  newData.date = dayOffset
  newData.game = []
  for (let c = 0; c < guessGrid.children.length; c++) {
    let tile = guessGrid.children[c]
    newData.game.push(tile.dataset.letter)
  }
  window.localStorage.setItem("game", JSON.stringify(newData))
}



function startInteraction() {
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
  if (loading) {
    return
  }
  e.target.blur()
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    e.target.blur()
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

function handleKeyPress(e) {
  if (loading) {
    return
  }
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey()
    return
  }

  if (e.key.match(/^[a-z]$/) || e.key.match(/^[A-Z]$/)) {
    pressKey(e.key)
    return
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= WORD_LENGTH) return
  const nextTile = guessGrid.querySelector(":not([data-letter])")
  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function submitGuess(save=true, checkWin=true) {

  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters")
    shakeTiles(activeTiles)
    return
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "")

  if (!dictionary.includes(guess)) {
    showAlert("Not in word list")
    shakeTiles(activeTiles)
    return
  }

  if (guess === "prnkl") {
    showAlert("What the...?", 5000)
  }

  stopInteraction()

  if (save && saveAfterGuess) {
    saveGame()
  }

  let filledLines = guessGrid.querySelectorAll("[data-letter]").length/5
  let interfereWord = interfereWords[filledLines-1].toLowerCase()
  let _targetWord = targetWord.toLowerCase()

  let tWord = guess.toLowerCase()

  let greens = 0
  for (let letter = 0; letter < guess.length; letter++) {
    if ((guess[letter] == _targetWord[letter]) || (guess[letter] == interfereWord[letter])) {
      tWord = setCharAt(tWord, letter, "@")
      if (guess[letter] == _targetWord[letter]) {
        _targetWord = setCharAt(_targetWord, letter, "-")
        greens+=1
      } else if (guess[letter] == interfereWord[letter]) {
        interfereWord = setCharAt(interfereWord, letter, "-")
        greens+=1
      }
    if (greens == 5 && guess != targetWord) {
      showAlert("Not Quite...",  5000)
    }
    }
  }

  //console.log(tWord, _targetWord, interfereWord)

  for (let letter = 0; letter < guess.length; letter++) {
    if ((_targetWord.includes(tWord[letter])) || (interfereWord.includes(tWord[letter]))) {
      
      if (_targetWord.includes(tWord[letter])) {
        _targetWord = setCharAt(_targetWord, _targetWord.indexOf(tWord[letter]), "-")
      } else if (interfereWord.includes(tWord[letter])) {
        interfereWord = setCharAt(interfereWord, interfereWord.indexOf(tWord[letter]), "-")

      }
      
      tWord = setCharAt(tWord, letter, "/")

    }
  }

  //console.log(tWord, _targetWord, interfereWord)

  getRevealTiles().forEach((tile, index, array) => {
    tile.textContent = interfereWords[filledLines-1].toUpperCase()[index]
    flipTile(tile, index, array, "interfere", checkWin)
  })

  activeTiles.forEach((tile, index, array) => {

    let key = keyboard.querySelector(`[data-key="${tile.dataset.letter}"i]`)
    key.classList.add("wrong")

    switch(tWord[index]) {
      case "/":
        flipTile(tile, index, array, "wrong-location", checkWin)
        break;
      case "@":
        flipTile(tile, index, array, "correct", checkWin)
        break;
      default:
        flipTile(tile, index, array, "wrong", checkWin)
    }


  })
  

}


function flipTile(tile, index, array, state, checkWin) {
  tile.dataset.state = "flipping"
  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener("transitionend", ()=>{
    tile.classList.remove("flip")
    tile.style.color = "white"
    tile.dataset.state = state
    tile.style.color = "--font-colour"
    if (state == "interfere") {
      return
    }
    if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction()
            if (checkWin) {
              checkWinLose(array)
            }
          }, {once:true}
        )  
      }
    }
  )
}


function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')
}

function getRevealTiles() {
  let filledLetters = guessGrid.querySelectorAll("[data-letter]").length-5
  let revealTiles = []

  for (let i = filledLetters; i < filledLetters+5; i++) {
    revealTiles.push(interfereGrid.children[i])
  }

  return revealTiles

}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (duration == null) return

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove()
    })
  }, duration)
}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake")
      },
      { once: true }
    )
  })
}


function checkWinLose(tiles) {

  let guess = tiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "")

  if (guess === targetWord) {
    showAlert("You Win", null)
    danceTiles(tiles)
    stopInteraction()
    win()
    return
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if ((remainingTiles.length === 0)) {
    showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
    lose()
  }
}

function win() {}
function lose() {}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance")
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}
