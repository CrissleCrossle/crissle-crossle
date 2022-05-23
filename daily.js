let tempInterfere = targetWords

targetWord = targetWords[dayOffset]

tempInterfere.splice(dayOffset, 1)

for (let i = 0; i < 7; i++) {
  let index = Math.floor(mulberry32(parseInt(String(dayOffset)+"1111"+String(i)))()*(2315-i))
  let word = tempInterfere[index]
  tempInterfere.splice(index, 1)
  interfereWords.push(word)
}

interfereWords.push("#####")

startInteraction()

let data = window.localStorage.getItem("game")
if (data) {
  data = JSON.parse(data)
  if (data.date == dayOffset) {
    loadGame(data.game)
  }

}

const shareColours = {
  "correct":"🟩",
  "wrong-location":"🟨",
  "wrong":"⬜",
}


document.getElementById("share").onclick = () => {
  let shareText = "Crissle Crossle " + String(dayOffset) + " p/8\n" 
  let tiles = guessGrid.querySelectorAll(".tile")
  for (let i = 0; i < tiles.length; i++) {
    if (!tiles[i].dataset.state) {
      shareText = shareText.replace("p", String((i/5)))
      break
    } else {
      shareText = shareText.concat("", shareColours[tiles[i].dataset.state])
      if ((i+1) % 5 == 0) {
        shareText = shareText.concat("", "\n")
      }
    }
  }
  shareText = shareText.replace("p", "X")

  navigator.clipboard.writeText(shareText)
  showAlert("Copied Result To Clipboard")
}

var pastGames = window.localStorage.getItem("pastGames")

if (pastGames) {
  pastGames = JSON.parse(pastGames)
} else {
  pastGames = {}
}

configureGraph(pastGames)

function configureGraph(data, current=null) {

  let winrate = 0
  let played = Object.keys(data).length

  document.getElementById("played").textContent = String(played)


  let distro = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0}

  let wins = 0
  Object.keys(data).forEach((key) => {
    if (data[key] != "X") {
      wins += 1
      distro[data[key]] += 1
    }
  })

  winrate = Math.floor((wins/played)*100)

  document.getElementById("winrate").textContent = String(winrate)

  let bars = document.getElementsByClassName("bar")

  for (let b = 0; b < bars.length; b++) {
    let bar = bars[b]
    bar.textContent = String(distro[b+1])
    bar.style.width = String(Math.max((distro[b+1]/played)*100, 8))+"%"
    if (((distro[b+1]/played)*100) <= 8) {
      bar.style["padding-right"] = "0em"
      bar.style["justify-content"] = "center"
    } else {
      bar.style["padding-right"] = "1em"
      bar.style["justify-content"] = "flex-end"
    }
  }

  if (current) {
    document.getElementById("bar"+String(current)).style["background-color"] = getComputedStyle(document.documentElement).getPropertyValue("--correct")
  }

}

win = () => {
  share.style.display = "initial"
  let tiles = guessGrid.querySelectorAll(".tile")
  let score = 8

  for (let i = 0; i < tiles.length; i++) {
  if (!tiles[i].dataset.state) {
    score = i/5
    break
    }
  }

  pastGames[String(dayOffset)] = String(score)
  window.localStorage.setItem("pastGames", JSON.stringify(pastGames))
  configureGraph(pastGames, score)

  if (document.getElementById('rules').style.display == 'none') {
    setTimeout(() => {
      document.getElementById('settings').style.display = 'none'
      document.getElementById("stats").style.display = 'inherit'
    }, 1000) }

}

lose = () => {
  share.style.display = "initial"
  pastGames[String(dayOffset)] = "X"
  window.localStorage.setItem("pastGames", JSON.stringify(pastGames))

  configureGraph(pastGames)

  if (document.getElementById('rules').style.display == 'none') {
    setTimeout(() => {
      document.getElementById('settings').style.display = 'none'
      document.getElementById("stats").style.display = 'inherit'
    }, 1000) }

}