if (window.localStorage.getItem("unusedSongs") == null) {
  var numbers = [0,1,2];
  window.localStorage.setItem("unusedSongs",numbers);
} else if ((window.localStorage.getItem("unusedSongs") == "")) {
  var numbers = [];
} else {
  var numbers = window.localStorage.getItem("unusedSongs").split(",");
};

if (window.localStorage.getItem("currentLeft") == null) {
  var number = Math.floor(Math.random()*numbers.length);
  document.getElementById("left-img").src = images[numbers[number]];
  document.getElementById("left-artist").innerHTML = artists[numbers[number]];
  document.getElementById("left-title").innerHTML = titles[numbers[number]];
  document.getElementById("left-audio").src = audios[numbers[number]];
  window.localStorage.setItem("currentLeft",numbers[number]);
  numbers.splice(number,1);
  window.localStorage.setItem("unusedSongs",numbers)
} else {
  document.getElementById("left-img").src = images[window.localStorage.getItem("currentLeft")];
  document.getElementById("left-artist").innerHTML = artists[window.localStorage.getItem("currentLeft")];
  document.getElementById("left-title").innerHTML = titles[window.localStorage.getItem("currentLeft")];
  document.getElementById("left-audio").src = audios[window.localStorage.getItem("currentLeft")];
};

if (window.localStorage.getItem("currentRight") == null) {
  var number = Math.floor(Math.random()*numbers.length);
  document.getElementById("right-img").src = images[numbers[number]];
  document.getElementById("right-artist").innerHTML = artists[numbers[number]];
  document.getElementById("right-title").innerHTML = titles[numbers[number]];
  document.getElementById("right-audio").src = audios[numbers[number]];
  window.localStorage.setItem("currentRight",numbers[number]);
  numbers.splice(number,1);
  window.localStorage.setItem("unusedSongs",numbers)
} else {
  document.getElementById("right-img").src = images[window.localStorage.getItem("currentRight")];
  document.getElementById("right-artist").innerHTML = artists[window.localStorage.getItem("currentRight")];
  document.getElementById("right-title").innerHTML = titles[window.localStorage.getItem("currentRight")];
  document.getElementById("right-audio").src = audios[window.localStorage.getItem("currentRight")];
};

function update() {
  if (numbers.length == 0) {
    console.log("end")
    document.getElementById("game").style = "display: none";
    document.getElementById("game-over").style = "display: inherit";
    document.getElementById("left-audio").pause();
    document.getElementById("right-audio").pause();
  } else {
  var number = Math.floor(Math.random()*numbers.length);
  document.getElementById("right-img").src = images[numbers[number]];
  document.getElementById("right-artist").innerHTML = artists[numbers[number]];
  document.getElementById("right-title").innerHTML = titles[numbers[number]];
  document.getElementById("right-audio").src = audios[numbers[number]];
  window.localStorage.setItem("currentRight",numbers[number]);
  numbers.splice(number,1);
  window.localStorage.setItem("unusedSongs",numbers);
  };
};

document.getElementById("right-img").ondragstart = document.getElementById("left-img").ondragstart = () => {
  return false;
};

var left_playing = false
document.getElementById("left-img").onclick = () => {
  if (!left_playing) {
    document.getElementById("right-audio").pause()
    document.getElementById("right-audio").currentTime = 0;
    document.getElementById("left-audio").play();
    left_playing = true
  } else {
    document.getElementById("left-audio").pause();
    document.getElementById("left-audio").currentTime = 0;
  };
  // left_playing = !left_playing;
};

document.getElementById("left-audio").onpause = () => {
  left_playing = false;
};

var right_playing = false
document.getElementById("right-img").onclick = () => {
  if (!right_playing) {
    document.getElementById("left-audio").pause();
    document.getElementById("left-audio").currentTime = 0;
    document.getElementById("right-audio").play();
    right_playing = true
  } else {
    document.getElementById("right-audio").pause();
    document.getElementById("right-audio").currentTime = 0;
  };
};

document.getElementById("right-audio").onpause = () => {
  right_playing = false;
};

document.getElementById("left-vote").onclick = () => {
  left_playing = right_playing = false;
  update();
}

document.getElementById("right-vote").onclick = () => {
  left_playing = right_playing = false;
  document.getElementById("left-img").src = document.getElementById("right-img").src;
  document.getElementById("left-artist").innerHTML = document.getElementById("right-artist").innerHTML;
  document.getElementById("left-title").innerHTML = document.getElementById("right-title").innerHTML;
  document.getElementById("left-audio").src = document.getElementById("right-audio").src;
  window.localStorage.setItem("currentLeft",window.localStorage.getItem("currentRight"));
  update()
}