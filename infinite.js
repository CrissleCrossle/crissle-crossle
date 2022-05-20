saveAfterGuess = false

let tempInterfere = targetWords

var i = Math.floor(Math.random()*2315)
targetWord = targetWords[i]
tempInterfere.splice(i, 1)

for (let i = 0; i < 7; i++) {
  let index = Math.floor(Math.random()*(2315-i))
  let word = tempInterfere[index]
  tempInterfere.splice(index, 1)
  interfereWords.push(word)
}

interfereWords.push("#####")

startInteraction()

document.getElementById("restart").onclick = () => {

  location.reload()

}

win = lose = () => {
  document.getElementById("infinite-restart").style.visibility = "visible"
}