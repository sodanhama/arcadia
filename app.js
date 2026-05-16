  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

// Auth specific functions come from firebase-auth.js
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

// Database specific functions come from firebase-database.js
import { 
  getDatabase, 
  ref, 
  set,
  onDisconnect,
  onValue,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

let playerID
let playerRef
let playerElements = {}

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
const first = randomFromArray(["Sam", "Alex", "Charlie", "Jordan", "Taylor"]);
const last = randomFromArray(["Smith", "Johnson", "Brown", "Taylor", "Anderson"]);
const playerColors = ["red", "blue", "green", "yellow", "purple"];
const gameContainer = document.querySelector(".game-container");


signInAnonymously(auth).catch(console.error);

onAuthStateChanged(auth, (user) => {
  if (user) {
    playerID = user.uid;
    playerRef = ref(db, `players/${playerID}`);

    const name = `${first} ${last}`;

    set(playerRef, {
      id: playerID,
      name: name,
      direction:"right",
      color: randomFromArray(playerColors),
      x:0,
      y:0,
      coins:0,
    })

    onDisconnect(playerRef).remove();
    console.log("Logged in as:", playerID);
  } else {
    console.log("Logged out");
  }
});

initGame();

function initGame() {
  const allPlayersRef = ref(db, "players")
  const allCoinsRef = ref(db, "coins")

  onValue(allPlayersRef, (snapshot) => {})
  onChildAdded(allPlayersRef, (snapshot) => {
    const addedPlayer = snapshot.val();
    const characterElement = document.createElement("div");
    characterElement.classList.add("character", "grid-cell");
    if (addedPlayer.id === playerID) {
      characterElement.classList.add("you");
    }
    characterElement.innerHTML = (`
      <div class="character_shadow grid-cell"></div>
      <div class="character_sprite grid-cell"></div>
      <div class="character_name_container">
      <span class="character_name"></span>
      <span class="character_coins">0</span>
      </div>
      <div class="character_you_arrow"></div>
      `)

      playerElements[addedPlayer.id] = characterElement;

      characterElement.querySelector(".character_name").innerText = addedPlayer.name;
      characterElement.querySelector(".character_coins").innerText = addedPlayer.coins;
      characterElement.setAttribute("data-color", addedPlayer.color);
      characterElement.setAttribute("data-direction", addedPlayer.direction);
      const left = 16 * addedPlayer.x + "px";
      const right = 16 * addedPlayer.y -4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${right}, 0)`;


      gameContainer.appendChild(characterElement);

  })

}

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getKeyString(x, y) {
  return `${x}x${y}`;
}

