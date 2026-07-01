import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import { 
  getDatabase, 
  ref, 
  set,
  push,
  onDisconnect,
  onValue,
  onChildAdded,
  onChildRemoved
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

import { keyPressListener } from "./keyPressListener.js";

let playerID
let playerRef
let players = {}
let playerElements = {}

const loadingScreen = document.getElementById("loading-screen");
let assetsLoaded = false;
let authReady = false;
let playersLoaded = false;

function checkLoadingComplete() {
  if (assetsLoaded && authReady && playersLoaded) {
    loadingScreen?.classList.add("loading-hidden");
    setTimeout(() => loadingScreen?.remove(), 500);
  }
}

function preloadAssets() {
  const sources = ["/assets/character.png", "/assets/bush.png"];
  let loaded = 0;
  sources.forEach((src) => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loaded++;
      if (loaded === sources.length) {
        assetsLoaded = true;
        checkLoadingComplete();
      }
    };
    img.src = src;
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyByyBdiCaouJ9AFsMVkKis2IXqDk-MHZmE",
  authDomain: "arcadia-a0585.firebaseapp.com",
  databaseURL: "https://arcadia-a0585-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arcadia-a0585",
  storageBucket: "arcadia-a0585.firebasestorage.app",
  messagingSenderId: "725740498443",
  appId: "1:725740498443:web:5542842a11e96157c0610e"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");
let bubbleTimers = {};
const first = randomFromArray(["Sam", "Alex", "Charlie", "Jordan", "Taylor"]);
const last = randomFromArray(["Smith", "Johnson", "Brown", "Taylor", "Anderson"]);
const playerColors = ["red", "blue", "green", "yellow", "purple"];
const gameContainer = document.querySelector(".game-container");

signInAnonymously(auth).catch(console.error);

onAuthStateChanged(auth, (user) => {
  if (user) {
    playerID = user.uid;
    playerRef = ref(db, `players/${playerID}`);

    const name = prompt("Enter your name:") || `${first} ${last}`;

    set(playerRef, {
      id: playerID,
      name: name,
      direction:randomFromArray(["left", "right"]),
      color: randomFromArray(playerColors),
      x:0,
      y:0,
      coins:0,
    })

    onDisconnect(playerRef).remove();
    console.log("Logged in as:", playerID);
    authReady = true;
    checkLoadingComplete();
  } else {
    console.log("Logged out");
  }
});

initGame();
initChat();
preloadAssets();
function initChat() {
  const chatInput = document.getElementById("chat-input");

  document.addEventListener("keydown", (e) => {
  if (e.code === "KeyT" && document.activeElement !== chatInput) {
    e.preventDefault();
    chatInput.focus();
  }
});

  chatInput.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.code === "Enter") {
      const text = chatInput.value.trim();
      if (!text) return;
      push(messagesRef, {
        playerID: playerID,
        name: players[playerID]?.name || "Unknown",
        text: text
      });
      chatInput.value = "";
      chatInput.blur();
    }
  });

  onChildAdded(messagesRef, (snapshot) => {
    const message = snapshot.val();
    addChatLogLine(message);
    showBubble(message);
  });
}

function addChatLogLine(message) {
  const chatLog = document.getElementById("chat-log");
  const line = document.createElement("div");
  line.classList.add("chat-message");

  const author = document.createElement("span");
  author.classList.add("chat-author");
  author.innerText = `${message.name}: `;

  const body = document.createElement("span");
  body.innerText = message.text;

  line.appendChild(author);
  line.appendChild(body);
  chatLog.appendChild(line);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function showBubble(message) {
  const el = playerElements[message.playerID];
  if (!el) return;

  const bubble = el.querySelector(".character_bubble");
  bubble.innerText = message.text;
  bubble.classList.add("visible");

  clearTimeout(bubbleTimers[message.playerID]);
  bubbleTimers[message.playerID] = setTimeout(() => {
    bubble.classList.remove("visible");
  }, 5000);
}
function handleArrowPress(xChange, yChange) {
  const newX = players[playerID].x + xChange;
  const newY = players[playerID].y + yChange;
  if (true) {
    players[playerID].x = newX;
    players[playerID].y = newY;
    if (xChange === -1) {
      players[playerID].direction = "left";
    } else if (xChange === 1) {
      players[playerID].direction = "right";
    }
set(playerRef, players[playerID]);  }
}

function initGame() {
  new keyPressListener("ArrowUp", () => handleArrowPress(0, -1));
  new keyPressListener("KeyW", () => handleArrowPress(0, -1));
  new keyPressListener("ArrowDown", () => handleArrowPress(0, 1));
  new keyPressListener("KeyS", () => handleArrowPress(0, 1));
  new keyPressListener("ArrowLeft", () => handleArrowPress(-1, 0));
  new keyPressListener("KeyA", () => handleArrowPress(-1, 0));
  new keyPressListener("ArrowRight", () => handleArrowPress(1, 0));
  new keyPressListener("KeyD", () => handleArrowPress(1, 0));
  const allPlayersRef = ref(db, "players")
  const allCoinsRef = ref(db, "coins")

onValue(allPlayersRef, (snapshot) => {
  players = snapshot.val() || {};

  Object.keys(players).forEach((key) => {
    const characterState = players[key];
    let el = playerElements[key];

    if (el) {
      el.querySelector(".character_name").innerText = characterState.name;
      el.setAttribute("data-color", characterState.color);
      el.setAttribute("data-direction", characterState.direction);
      
      const left = 16 * characterState.x + "px";
      const top = (16 * characterState.y - 4) + "px";
      el.style.transform = `translate3d(${left}, ${top}, 0)`;
    }
  }); 

  if (!playersLoaded) {
    playersLoaded = true;
    checkLoadingComplete();
  }
});
  onChildAdded(allPlayersRef, (snapshot) => {
    const addedPlayer = snapshot.val();
    const characterElement = document.createElement("div");
    characterElement.classList.add("character", "grid-cell");
    if (addedPlayer.id === playerID) {
      characterElement.classList.add("you");
    }
characterElement.innerHTML = (`
  <div class="character_body">
    <div class="character_shadow grid-cell"></div>
    <div class="character_sprite grid-cell"></div>
    <div class="character_name_container">
      <span class="character_name"></span>
    </div>
  </div>
`)

      playerElements[addedPlayer.id] = characterElement;

      characterElement.querySelector(".character_name").innerText = addedPlayer.name;
      characterElement.setAttribute("data-color", addedPlayer.color);
      characterElement.setAttribute("data-direction", addedPlayer.direction);
      const left = 16 * addedPlayer.x + "px";
      const right = 16 * addedPlayer.y -4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${right}, 0)`;


      gameContainer.appendChild(characterElement);

  })

  onChildRemoved(allPlayersRef, (snapshot) => {
    const removedPlayer = snapshot.val();
    gameContainer.removeChild(playerElements[removedPlayer.id]);
    delete playerElements[removedPlayer.id];})

}

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getKeyString(x, y) {
  return `${x}x${y}`;
}
