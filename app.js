const status = document.getElementById("status");
const messages = document.getElementById("messages");
const input = document.getElementById("input");
const send = document.getElementById("send");
const chat = document.querySelector(".chat");

var HOST = `https://simple-chattik.herokuapp.com`.replace(/^https/, "wws");
var ws = new WebSocket(HOST);

const user = prompt("Enter your name") || `U:${new Date().getTime()}`;

console.log(user);

function setStatus(value) {
  status.children[0].setAttribute("class", value.toLowerCase());
  status.children[0].innerText = value;
}

function printMessage(value) {
  const li = document.createElement("li");

  li.innerHTML = value;
  messages.appendChild(li);
}

send.onclick = (event) => {
  ws.send(`${user}: ${input.value}`);
  input.value = "";
};

input.onkeydown = (event) => {
  if (event.keyCode === 13) {
    ws.send(`${user}: ${input.value}`);
    input.value = "";
  }
};

ws.onopen = () => setStatus("ONLINE");

ws.onclose = () => setStatus("DISC");
ws.onmessage = (res) => printMessage(res.data);

chat.onmousedown = (e) => {
  var coords = getCoords(chat);
  var shiftX = e.pageX - coords.left;
  var shiftY = e.pageY - coords.top;

  moveAt(e);

  chat.style.zIndex = 1000; // над другими элементами

  function moveAt(e) {
    chat.style.left = e.pageX - shiftX + "px";
    chat.style.top = e.pageY - shiftY + "px";
  }

  document.onmousemove = function (e) {
    moveAt(e);
  };

  chat.onmouseup = function () {
    document.onmousemove = null;
    chat.onmouseup = null;
  };
};

chat.ondragstart = function () {
  return false;
};

function getCoords(elem) {
  // кроме IE8-
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
  };
}
