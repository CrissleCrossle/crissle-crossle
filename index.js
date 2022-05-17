var clicked = false

if (window.localStorage.getItem("colourblind") == "true") {
    document.getElementById("switch-colours").click()
}

document.getElementById("switch-colours").onclick = () => {
    
    if (clicked) {
      return
    }
  
    clicked = true

    if (window.localStorage.getItem("colourblind") == "true") {
        switchColours(false)
    } else {
        switchColours(true)

    }
  
  
  }
  
  document.getElementById("switch-colours").onmouseup = () => {
    clicked = false
  }