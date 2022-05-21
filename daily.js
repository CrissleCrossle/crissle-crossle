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

  navigator.clipboard.writeText(shareText)
  showAlert("Copied Result To Clipboard")
}

