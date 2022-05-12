
document.getElementById("how").onclick = () => {
  console.log("what")
}

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

