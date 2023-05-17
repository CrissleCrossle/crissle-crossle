var craig = "CRAIG"
var nextCraig = 0


// if (e.key === "Backspace" || e.key === "Delete") {
//     deleteKey()
//     return
// }

document.onkeydown = function(keyboardEvent) {
    // console.log(keyboardEvent.key)
    // console.log(keyboardEvent.key.toLowerCase().match(/^[a-z]$/))
    if (keyboardEvent.key.toLowerCase().match(/^[a-z]$/)) {
        // console.log("success")
        if (keyboardEvent.key.toUpperCase() == craig[nextCraig]) {
            nextCraig == 4 ? nextCraig = 0 : nextCraig++
            document.getElementById("craigletter").innerHTML = craig[nextCraig]
            if (keyboardEvent.key.toUpperCase() == "G") {
                document.getElementById("score").innerHTML++
            }
        } else {
            document.getElementsByTagName("body")[0].style = "background-color: red"
            setTimeout(() => {
                document.getElementsByTagName("body")[0].style = "background-color: black"
            }, 400);
        }
    }
}