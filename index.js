
//Једна контролна структура (if или switch) GOTOVO
// Једна петља (for, while или dowhile) GOTOVO 
// Један низ GOTOVO
// Минимум две функције са улазним параметрима и повратним вредностима GOTOVO
// Минимум два догађаја GOTOVO
// Промена стила елемената GOTOVO
// Преузимање података из форме 
// Додатна 2 поена: Методе са стринговима   GOTOVO
// Додатна 3 поена: Методе са низовима  GOTOVO
// Додатна 3 поена: Динамичко генерисање HTML кода  GOTOVO
let players = [];
let index = 0;
let buttonRole = true;
let noOfRoles = 0;
let rolePool = [];
let progressor = 0;
let orderOfRoles = [11, 18, 7, 15, 1, 14, 6, 19, 20, 17, 2, 13, 4, 8, 12, 16];
let sortedRoles = [];

const form = document.getElementById("playerInputForm");
const playerNameInput = document.getElementById("inputName");
const playersList = document.getElementById("listOfPlayers");
const playersListContainer = document.getElementById("playerListDivider");
const inputButton = document.getElementById("addPlayer");
const start = document.getElementById("startButton");
const back = document.getElementById("back");
const reveal = document.getElementById("revealRole");
const playerName = document.getElementById("player");
const roleHolder = document.getElementById("roleHolder");
const warning = document.getElementById("warning");
const settings = document.getElementById("settingsButton");
const cardHolder = document.getElementById("cardHolder")
const displayName = document.getElementById("displayName");
const displayAlignment = document.getElementById("displayAlignment");
const displayDesc = document.getElementById("displayDesc");
const playerHolder = document.getElementById("playerHolder");
const quit = document.getElementById("cancelManager");
const cancel = document.getElementById("cancel");
const nightButton = document.getElementById("nightButton");
const wakeUpRole = document.getElementById("wakeUpRole");
const wakeNext = document.getElementById("wakeNext");
const infoRole = document.getElementById("infoRole");
const addToAmnesiac = document.getElementById("addToAmnesiac");
const backToManager = document.getElementById("backToManager");

const mainMenu = document.getElementById("mainMenu");
const selectionMenu = document.getElementById("roleSelection");
const settingsMenu = document.getElementById("settingsMenu");
const managerMenu = document.getElementById("managerMenu");
const playerInfoMenu = document.getElementById("playerInfoMenu");
const nightMenu = document.getElementById("nightMenu");

import { roles } from "./data.js";

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = playerNameInput.value.trim();

    if (name !== "") {
        checkIfNameInList(name);
    } 
    else {
        window.alert("Molimo unesite ime igrača!");
    }
});

function checkIfNameInList(name){
    if (players.includes(name)) {
        throwNameExists(name);
        return;
    }

    addNameToList(name);
};

function throwNameExists(name){
    alert("Igrač " + name + " je već dodat u igru, molimo Vas koristite drugo ime!");

    playerNameInput.value = "";
};

function fitFontToList() {
    let fontSize = 6;
    playersList.style.fontSize = fontSize + "vh";

    while (playersListContainer.scrollHeight > playersListContainer.clientHeight && fontSize > 1) {
        fontSize -= 0.1;
        playersList.style.fontSize = fontSize + "vh";
    }
}

function addNameToList(name){
    const li = document.createElement("li");
    li.textContent = name;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = "X";
    deleteButton.id = "deleteButton";

    deleteButton.addEventListener("click", () => {
        const nameToDelete = li.firstChild.textContent.trim();
        removePlayer(deleteButton, nameToDelete);
    }
    );
    li.appendChild(deleteButton);

    playersList.appendChild(li);

    players.push(name);

    playerNameInput.value = "";
    fitFontToList();

    if (players.length == 20) {
        inputManager(true);
    }
};

function inputManager(flip){
    playerNameInput.disabled = flip;
    inputButton.disabled = flip;
};

function removePlayer(item, name) {
    item.parentElement.remove();
    players = players.filter(item => item !== name);
    fitFontToList();
    inputManager(false);
};

start.addEventListener("click", function(e) {
    e.preventDefault();

    if (noOfRoles != 0) {
      window.alert(`Potrebno je dodati još ${noOfRoles} uloga`)
    }
    else {
      selectionMenu.style.display = "flex";
      settingsMenu.style.display = "none";    

      shuffleArray(players);
      shuffleArray(rolePool);
      
      index = 0;
      playerName.textContent = players[index];
      displayRole(rolePool[index])
    }
});

function displayRole(index){
    displayName.textContent = `Uloga: ${roles[index].role}`;    
    displayAlignment.textContent = `Strana: ${roles[index].alignment}`;
    displayDesc.textContent = roles[index].description;
}

settings.addEventListener("click", function(e) {
    e.preventDefault();

    listRolesInSettings();

    transitionMenu(mainMenu, settingsMenu, "grid") ;
});

back.addEventListener("click", function(e) {
    e.preventDefault();

    transitionMenu(selectionMenu,mainMenu, "flex");

    shuffleArray(players);
    shuffleArray(rolePool);

    reset();
});

function reset() {
  warning.textContent = "Kliknite na dugme da sakrijete svoju ulogu i predajte telefon igraču koji je sledeći naveden";
  warning.style.display = "none";
};


reveal.addEventListener("click", function () {
    if (buttonRole) {
        showRole();
    } else {
        hideRole();
    }
    buttonRole = !buttonRole;
});

function showRole() {
    warning.style.display = "flex";
    roleHolder.style.display = "block";
    displayRole(rolePool[index]);

    if (index === players.length - 1) {
        warning.textContent = "Kliknite na dugme da sakrijete svoju ulogu i predajte uređaj naratoru";
    } else {
        warning.textContent = "Kliknite na dugme da sakrijete svoju ulogu i predajte uređaj sledećem igraču.";
    }
}

function hideRole() {
    transitionMenu(warning, roleHolder, "none")
    if (index === players.length - 1) {
        transitionMenu(selectionMenu, managerMenu, "grid")
        listManagerMenu();
    } else {
        displayPlayer();
    }
}

function displayPlayer() {
    index += 1;
    playerName.textContent = players[index];
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function listRolesInSettings() {
  cardHolder.innerHTML = ""; 
  for (const x in roles) {
    const id = x;
    
    const roleCard = document.createElement("div");
    roleCard.classList.add("card");

    const roleName = document.createElement("h3");
    roleName.textContent = roles[x].role;
    roleName.classList.add("roleName");

    const roleAlignment = document.createElement("p");
    roleAlignment.textContent = `Strana: ${roles[x].alignment}`;
    roleAlignment.classList.add("roleAlignment");

    const roleCategory = document.createElement("p");
    roleCategory.textContent = `Tip: ${roles[x].category}`;
    roleCategory.classList.add("roleCategory");

    const roleDescription = document.createElement("p");
    roleDescription.textContent = roles[x].description;
    roleDescription.classList.add("roleDescription");

    const numberDiv = document.createElement("div");
    numberDiv.classList.add("numberDiv")

    const addRole = document.createElement("button");
    addRole.classList.add("addRole");

    const counter = document.createElement("p");
    counter.textContent = 0;
    counter.classList.add("counter");

    const removeRole = document.createElement("button");
    removeRole.classList.add("removeRole");

    noOfRoles = players.length - rolePool.length;

    addRole.addEventListener("click", () => {
      let value = parseInt(counter.textContent);
      if (value < players.length && noOfRoles > 0) {
        counter.textContent = value + 1;
        noOfRoles -= 1;
        rolePool.push(id);
      }
      else {
        window.alert("Dodavanjem ove uloge bilo bi više uloga nego igrača!")
      }
    });

    removeRole.addEventListener("click", () => {
      let value = parseInt(counter.textContent);
      if (value > 0) {
        counter.textContent = value - 1;
        noOfRoles += 1;
        if ( rolePool.includes(id)){
          removeFirstMatchInPlace(rolePool, id)
        }
      }
    });

    if (roles[x].alignment === "Selo") {
      roleCard.style.backgroundColor = "#6b9cd1ff";
    } 
    else if (roles[x].alignment === "Mafija") {
      roleCard.style.background = "#f38891ff";
    } 
    else if (roles[x].alignment === "Neutralno") {
      roleCard.style.backgroundColor = "#e2c76dff";
    }

    numberDiv.append(removeRole, counter, addRole)
    roleCard.append(roleName, roleAlignment, roleCategory, roleDescription, numberDiv);

    cardHolder.appendChild(roleCard);
  }
}

function removeFirstMatchInPlace(array, search) {
  const index = array.indexOf(search);
  array.splice(index, 1);
  return array;
}

cancel.addEventListener("click", () =>{
    transitionMenu(settingsMenu, mainMenu, "flex")
})

quit.addEventListener("click", () =>{
  transitionMenu(managerMenu,mainMenu, "flex");
})

function listManagerMenu(){
  playerHolder.innerHTML = ""; 
  for (let x in players) {
    const playerId = x;

    const playerCard = document.createElement("button");
    playerCard.classList.add("card");

    playerCard.dataset.status = "alive"

    const cardTitle = document.createElement("h3");
    cardTitle.textContent = players[x];

    playerCard.addEventListener("click", () => {
      transitionMenu(managerMenu, playerInfoMenu, "block")
      displayPlayerInfo(playerId, cardTitle.textContent)
    })

    playerCard.append(cardTitle);
    playerCard.classList.add("playerStats")
    playerHolder.append(playerCard);
  }
};

function displayPlayerInfo (id, name) {
  infoRole.innerHTML = ""; 

  const infoName = document.createElement("h3");
  infoName.textContent = name;

  const roleInfo = document.createElement("h3");
  roleInfo.textContent = roles[rolePool[id]].role;
  //name.classList.add("roleName");

  const alignment = document.createElement("p");
  alignment.textContent = `Strana: ${roles[rolePool[id]].alignment}`;
  //roleAlignment.classList.add("roleAlignment");

  //const roleCategory = document.createElement("p");
  //roleCategory.textContent = `Tip: ${roles[x].category}`;
  //roleCategory.classList.add("roleCategory");

  const infoDescription = document.createElement("p");
  infoDescription.textContent = roles[rolePool[id]].description;
  //roleDescription.classList.add("roleDescription");

  infoRole.append(infoName, roleInfo, alignment, infoDescription)
}

function transitionMenu(hide, show, type){
  hide.style.display = "none";
  show.style.display = type;
};

nightButton.addEventListener("click", () => {
  progressor = 0;
  transitionMenu(managerMenu, nightMenu, "block");
  roleOrder();
});

function roleOrder() {
  sortedRoles = [...new Set(rolePool.map(Number))]
    .filter(ids => orderOfRoles.includes(ids))
    .sort((a, b) => orderOfRoles.indexOf(a) - orderOfRoles.indexOf(b))

  wakeUp();
}

wakeNext.addEventListener("click", () => {
  wakeUp();
})

function wakeUp() {
  if (progressor === sortedRoles.length) {
    transitionMenu(nightMenu, managerMenu, "grid")
  }
  else {
    let roleId = sortedRoles[progressor];

    wakeUpRole.textContent = `Budi se ${roles[roleId].role}`;
    progressor += 1;
  }
};

backToManager.addEventListener("click", () => {
  transitionMenu(playerInfoMenu, managerMenu, "grid")
})

function addStatus(playerCard, status) {
  let statuses = playerCard.dataset.status ? playerCard.dataset.status.split(" ") : [];
  if (!statuses.includes(status)) {
    statuses.push(status);
    playerCard.dataset.status = statuses.join(" ");
  }
}

function removeStatus(playerCard, status) {
  let statuses = playerCard.dataset.status ? playerCard.dataset.status.split(" ") : [];
  statuses = statuses.filter(s => s !== status);
  playerCard.dataset.status = statuses.join(" ");
}

function replaceStatus(playerCard, oldStatus, newStatus) {
  let statuses = playerCard.dataset.status ? playerCard.dataset.status.split(" ") : [];
  statuses = statuses.map(s => s === oldStatus ? newStatus : s);
  playerCard.dataset.status = statuses.join(" ");
}

function hasStatus(playerCard, status) {
  let statuses = playerCard.dataset.status ? playerCard.dataset.status.split(" ") : [];
  return statuses.includes(status);
}
