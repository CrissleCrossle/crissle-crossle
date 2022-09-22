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

document.getElementById("restart").onclick = document.getElementById("re").onclick = () => {

  location.reload()

}

win = lose = () => {
  document.getElementById("hide-keyboard").style.visibility = "visible"
  document.getElementById("restart").style.visibility = "visible"

      
}