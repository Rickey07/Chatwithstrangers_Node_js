
const chatForm = document.querySelector(".chat-form");
const chatMessageContainer = document.querySelector(".chat-messages-container");
const msgLeft = document.querySelector(".left");
const msgRight = document.querySelector(".right");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userName = urlParams.get("userName");
const typingFunctionality = document.querySelector(".typing");
const userMsg = document.querySelector(".usermsg");
var audio = new Audio('../notification.mp3');

// Intialize the height of the scoll bar 
chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight

const append = (message, position) => {
  const messageElment = document.createElement("div");
  messageElment.innerText = message;
  messageElment.classList.add("message");
  messageElment.classList.add(position);
  chatMessageContainer.append(messageElment);
  if (position == "left") {
    audio.play();
  }
};

// set up the client connection to receive the updates
var socket = io.connect("https://chatwithstrangers0.herokuapp.com");

socket.emit("new-connection", userName);

// Welcome message for the user
socket.on("welcome", (userName) => {
  let speak = ` Welcome ${userName} !`;
  responsiveVoice.speak(userName);
  append(`Admin: ${speak}`, "left");
});

// Send to everybody except the user
socket.on("user-connection", (userName) => {
  let speak = `${userName} joined the chat`;
  responsiveVoice.speak(speak);
  append(`${userName} joined the chat`, "right");
});

// Show the sent message to the user DOM
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  socket.emit("sendMsg", userMsg.value);
  append(`You:${userMsg.value}`, "right");

  userMsg.value = "";
});

// Show the recieve message to everyuser DOM
socket.on("receiveMsg", (data) => {
  append(`${data.userMsg}: ${data.userName}`, "left");
});
// Send to everybody when user left the chat except the user
socket.on("left", (userName) => {
  let speak = `${userName} has left the chat`;
  responsiveVoice.speak(speak);
  append(`${userName} has left the chat`, "left");
});

userMsg.addEventListener("keypress", () => {
  socket.emit("typing", userName);
});

// catching is typing event
socket.on("isTyping", (userName) => {
  typingFunctionality.textContent = `${userName} is Typing`;
  setTimeout(() => {
    typingFunctionality.textContent = "";
  }, 5000);
});

// Toggling the Dark theme event

const btn = document.querySelector(".btn");
btn.addEventListener("click", () => {
  let body = document.body;
  //    let msg = document.querySelectorAll('.message');
  body.classList.toggle("dark-mode-bodyCol");
  chatMessageContainer.classList.toggle("chat-messages-container-dark");
});

// Features Needs to be added 
// 1. Photo and video sending 
// 2. Video calling 
// 3. Database for storing messages 
