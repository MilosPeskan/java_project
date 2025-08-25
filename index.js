
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
let actionPickPlayer = false;
let actionShowRole = false;
let actionDousePlayer = false;
let actionBewitchPlayer = false;
let actionPickTarget = false;
let burning = false;
let ubijeni = [];

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
const infoRole = document.getElementById("infoRole");
const action = document.getElementById("action");
const backToManager = document.getElementById("backToManager");
const secondAction = document.getElementById("secondAction");

const mainMenu = document.getElementById("mainMenu");
const selectionMenu = document.getElementById("roleSelection");
const settingsMenu = document.getElementById("settingsMenu");
const managerMenu = document.getElementById("managerMenu");
const playerInfoMenu = document.getElementById("playerInfoMenu");
const nightMenu = document.getElementById("nightMenu");

const colorDead = "#4B4B4B";
const colorMafia = "#8f3636ff";
const colorNeutral = "#944fa0ff";
const colorTown = "#4CAF50";
const colorCard = "#f9f9f9";
const colorNonSelectable = "#000000ff";
const colorDoused = "#636819ff";
const colorBewitched = "#f1327bff";

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

    displayNoRolesAndPlayers();

    transitionMenu(mainMenu, settingsMenu, "grid") ;
});

function displayNoRolesAndPlayers () {
  start.textContent = `${rolePool.length} \\ ${players.length}`;
}

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
        displayNoRolesAndPlayers();
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
        displayNoRolesAndPlayers();
      }
    });

    if (roles[x].alignment === "Selo") {
      roleCard.style.backgroundColor = colorTown;
    } 
    else if (roles[x].alignment === "Mafija") {
      roleCard.style.background = colorMafia;
    } 
    else if (roles[x].alignment === "Neutralno") {
      roleCard.style.backgroundColor = colorNeutral;
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

function listManagerMenu(){
  playerHolder.innerHTML = ""; 
  for (let x in players) {

    const playerCard = document.createElement("button");
    playerCard.classList.add("card");
    playerCard.classList.add("infoCard")

    playerCard.dataset.status = "alive"
    playerCard.dataset.role = `${rolePool[x]}`
    playerCard.dataset.id = x;

    const cardTitle = document.createElement("h3");
    cardTitle.textContent = players[x];

    playerCard.addEventListener("click", () => {
      if (actionPickPlayer) {
        addStatus(playerCard, action.dataset.purpose);
        console.log(action.dataset.purpose)
        actionOnPlayer(managerMenu);
        addVisited(playerCard);
      }
      else if (actionDousePlayer) {
        addStatus(playerCard, action.dataset.purpose);
        actionOnPlayer(managerMenu);
        addVisited(playerCard);
        secondAction.style.display = "none";
      }
      else if (actionShowRole){
        transitionMenu(managerMenu, playerInfoMenu, "block")
        displayPlayerInfo(playerCard.dataset.id, cardTitle.textContent)
        addVisited(playerCard);
      }
      else if (actionBewitchPlayer){
        addStatus(playerCard, action.dataset.purpose);
        actionOnPlayer(managerMenu);
        actionPickTarget = true;
        addVisited(playerCard);
      }
      else if (actionPickTarget){
        addStatus(playerCard, action.dataset.purpose);
        actionOnPlayer(managerMenu);
        addVisited(playerCard);
      }
      else {
        transitionMenu(managerMenu, playerInfoMenu, "block")
        displayPlayerInfo(playerCard.dataset.id, cardTitle.textContent)
      }
    })

    playerCard.append(cardTitle);
    playerCard.classList.add("playerStats")
    playerHolder.append(playerCard);
  }
};

nightButton.addEventListener("click", () => {
  progressor = 0;
  transitionMenu(managerMenu, nightMenu, "block")
  roleOrder();
});

let lastRole;

function debugDataset() {
  for (let child of playerHolder.children) {
    console.log(`Element:`, child);

    const data = {};
    for (let key in child.dataset) {
      data[key] = child.dataset[key];
    }

    console.log("Dataset:", data);
  }
  console.log("-------------------")
}

function wakeUp() {
  if (progressor > sortedRoles.length) {
    transitionMenu(nightMenu, managerMenu, "grid")
  } 
  else if (progressor === sortedRoles.length) {
    calculateNight();
    if(ubijeni.length == 0){
      wakeUpRole.textContent = `Jutro je, niko nije ubijen`;
    }
    else if (ubijeni.length == 1) {
      wakeUpRole.textContent = listAllDead(ubijeni);
      setLastKilled();
    }
    else {
      wakeUpRole.textContent = listAllDead(ubijeni);
      setLastKilled();
    }
    progressor += 1;
    action.textContent = "Nazad"
    cleanup(lastRole);
  }
  else {
    lastRole = sortedRoles[progressor];
    action.disabled = false;
    secondAction.style.display = "none"
    secondAction.textContent = "Sledeći"

    if(checkIfBlocked(lastRole)){
      wakeUpRole.textContent = `BLOKIRAN Budi se ${roles[lastRole].role} \n BLOKIRAN`;
      action.disabled = true;
      secondAction.style.display = "block";
      secondAction.textContent = "Sledeći"
    }
    else if(checkIfDead(lastRole)){
      wakeUpRole.textContent = `Budi se ${roles[lastRole].role}`;
      action.disabled = true;
      secondAction.style.display = "block";
      secondAction.textContent = "Sledeći"
    } 
    else if (lastRole == "12"){
      secondAction.style.display = "block";
      secondAction.textContent = "Zapali sve";
      wakeUpRole.textContent = `Budi se ${roles[lastRole].role}`;
    }
    else {
      wakeUpRole.textContent = `Budi se ${roles[lastRole].role}`;
      secondAction.textContent = "Sledeći"
    }
    roleActionCheck();
    progressor += 1;
  }
  //debugDataset();
};

function listAllDead(arr) {
  if (arr.length === 0) return "";
  if (arr.length === 1) return "Jutro je, ubijen je " + players[arr[0]];
  if (arr.length === 2) return "Jutro je, ubijeni su " + players[arr[0]] + " i " + players[arr[1]];
  let newArr = [];
  for (let x of arr){
    newArr.push(players[arr[x]])
  }
  return "Jutro je, ubijeni su " + newArr.slice(0, -1).join(", ") + " i " + newArr[newArr.length - 1];
}

function checkIfDead(who){
  for (let x of playerHolder.children) {
    if (hasStatus(x, "dead") && x.dataset.role == who){
      return true;
    }
  }
  return false;
}

function checkIfBlocked(who) {
  for (let x of playerHolder.children) {
    if (hasStatus(x, "blokiraj") && x.dataset.role == who){
      return true;
    }
  }
  return false;
}

function setLastKilled(){
  for (let x of playerHolder.children) {
    if (x.dataset.id == ubijeni[ubijeni.length]){
      addStatus(x, "najskorijeUbijen")
    }
  }
}

function cleanup(lastRole) {
  //console.log("last role"+lastRole)
  for (let x of playerHolder.children) {
    //console.log(x.dataset.role)
    if (lastRole == x.dataset.role) {
      x.disabled = false;
      x.style.backgroundColor = colorCard;
    }
    removeStatus(x, "ubij")
    removeStatus(x, "zastiti")
    removeStatus(x, "blokiraj")
    removeStatus(x, "kontrolisi")
    removeStatus(x, "target")
    removeStatus(x, "zastitiZivotom")
    removeStatus(x, "mafijaNapada")
    removeStatus(x, "kogaPosetio")
    if (hasStatus(x, "dead")) {
      x.disabled = true;
      x.style.backgroundColor = colorDead;
    }
  }
  delete action.dataset.purpose;
}

function calculateNight() {
  ubijeni = [];
  for (var x of playerHolder.children){
    if (hasStatus(x, "ubij") && hasStatus(x, "zastitiZivotom") && !hasStatus(x, "zastiti")){
      for (var y of playerHolder.children){
        if (y.dataset.role === "13"){
          replaceStatus(y, "alive", "dead");
          ubijeni.push(y.dataset.id);
        }
      }
    }
    else if (hasStatus(x, "ubij") && !hasStatus(x, "zastiti")){
      replaceStatus(x, "alive", "dead");
      ubijeni.push(x.dataset.id);
    }
    else if (burning == true && hasStatus(x, "polij")) {
      replaceStatus(x, "alive", "dead");
      removeStatus(x, "polij");
      ubijeni.push(x.dataset.id);
    }
  }
}

backToManager.addEventListener("click", () => {
  if (actionShowRole){
    actionOnPlayer(playerInfoMenu);
  } else {
    transitionMenu(playerInfoMenu, managerMenu, "grid");
  }
})

function addVisited(who) {
  for (let x of playerHolder.children) {
    if (action.dataset.id == x.dataset.role) {
      addStatus(x, `Visited ${players[who.dataset.id]}`)
    }
  }
}

secondAction.addEventListener("click", () => {
  switch (action.dataset.purpose) {
    case "polij":
      burning = true;
      break;
    default:
      break;
  }
  wakeUp();
})

action.addEventListener("click", () => {
  nightMenu.style.display = "none";

  switch (action.dataset.purpose) {
    case "istrazi":
      selectPlayer("actionShowRole");
      break;
    case "zastiti":
      selectPlayer("actionPickPlayer");
      break;
    case "ubij":
      selectPlayer("actionPickPlayer");
      break;
    case "blokiraj":
      selectPlayer("actionPickPlayer");
      break;
    case "kontrolisi":
      selectPlayer("actionControlPlayer");
      break;
    case "polij":
      selectPlayer("actionDousePlayer");
      break;
    case "zastitiZivotom":
      selectPlayer("actionPickPlayer");
      break;
    case "mafijaNapada":
      selectPlayer("actionPickPlayer");
      break;
    case "kogaPosetio":
      selectPlayer("actionPickPlayer");
      break;
    case "najskorijeUbijen":
      selectPlayer("actionPickPlayer");
      break;
    case "setiSe":
      selectPlayer("actionPickPlayer");
      break;
    case "target":
      selectPlayer("actionPickTarget")
    default:
      wakeUp();
      break;
  }
});

function selectPlayer (whatAction) {
  transitionMenu(nightMenu, managerMenu, "grid");
  if (whatAction === "actionPickPlayer"){
    actionPickPlayer = true;
  } else if (whatAction === "actionShowRole"){
    actionShowRole = true;
  } else if (whatAction === "actionDousePlayer"){
    actionDousePlayer = true;
  } else if (whatAction === "actionControlPlayer")
  {
    actionBewitchPlayer = true;
  } else if (whatAction === "actionPickTarget")
  {
    actionPickTarget = true;
    actionBewitchPlayer = false;
  }
  console.log("akcija je " + whatAction)
  for (let x of playerHolder.children) {
    if (action.dataset.id == x.dataset.role) {
      x.disabled = true;
      x.style.backgroundColor = colorNonSelectable;
    }
    if (whatAction === "actionDousePlayer" && hasStatus(x, "polij") && !hasStatus(x, "dead")){
      x.disabled = true;
      x.style.backgroundColor = colorDoused;
    }
    if (hasStatus(x, "kontrolisi") && action.dataset.id == x.dataset.role){
      console.log("sad kontrolisani")
      for (let y of playerHolder.children) {
        if(!hasStatus(y, "target")) {
          y.disabled = true;
          y.style.backgroundColor = colorNonSelectable;
        }
      }
    }
    if (hasStatus(x, "kontrolisi") && action.dataset.id == 11){
      x.style.backgroundColor = colorBewitched;
      x.disabled = true;
    }
  }
};

function actionOnPlayer(hideMenu) {
  transitionMenu(hideMenu, nightMenu, "block");
  actionPickPlayer = false;
  actionShowRole = false;
  actionDousePlayer = false;
  for (let x of playerHolder.children) {
    if (action.dataset.id == x.dataset.role) {
      x.disabled = false;
      x.style.backgroundColor = colorCard;
    }
    if (hasStatus(x, "polij") && !hasStatus(x, "dead")){
      x.style.backgroundColor = colorCard;
      x.disabled = false;
    }
    if (!hasStatus(x, "kontrolisi")){
      for (let y of playerHolder.children) {
        if(!hasStatus(y, "target") && !hasStatus(y, "dead")) {
          y.style.backgroundColor = colorCard;
          y.disabled = false;
        }
      }
    }
  }
  if(!actionBewitchPlayer){
    wakeUp();
  }
  else {
    progressor -= 1;
    actionBewitchPlayer = false;
    actionPickTarget = true;
    console.log(actionBewitchPlayer, actionPickTarget)
    roleActionCheck();
  }
}

function roleActionCheck() {
  const roleId = sortedRoles[progressor];

  switch (roleId) {
    case 1:
      action.textContent = "Istraži";
      action.dataset.purpose = "istrazi";
      break;
    case 2:
      action.textContent = "Zaštiti";
      action.dataset.purpose = "zastiti";
      break;
    case 4:
      action.textContent = "Ubij";
      action.dataset.purpose = "ubij";
      break;
    case 6:
      action.textContent = "Istraži";
      action.dataset.purpose = "istrazi";
      break;
    case 7:
      action.textContent = "Blokiraj";
      action.dataset.purpose = "blokiraj";
      break;
    case 8:
      action.textContent = "Ubij";
      action.dataset.purpose = "ubij";
      break;
    case 11:
      if(actionPickTarget) {
        action.dataset.purpose = "target";
        action.textContent = "Na koga";
      } else {
        action.textContent = "Kontroliši";
        action.dataset.purpose = "kontrolisi";
      }
      break;
    case 12:
      action.textContent = "Polij";
      action.dataset.purpose = "polij";
      break;
    case 13:
      action.textContent = "Zaštiti životom";
      action.dataset.purpose = "zastitiZivotom";
      break;
    case 14:
      action.textContent = "Istraži";
      action.dataset.purpose = "istrazi";
      break;
    case 15:
      action.textContent = "Koga mafija napada";
      action.dataset.purpose = "mafijaNapada";
      break;
    case 16:
      action.textContent = "Koga je posetio";
      action.dataset.purpose = "kogaPosetio";
      break;
    case 18:
      action.textContent = "Blokiraj";
      action.dataset.purpose = "blokiraj";
      break;
    case 19:
      action.textContent = "Istraži";
      action.dataset.purpose = "najskorijeUbijen";
      break;
    case 20:
      action.textContent = "Seti se";
      action.dataset.purpose = "setiSe";
      break;
    default:
      action.textContent = "Budi sledećeg";
      action.dataset.purpose = "nista"
  }
  action.dataset.id = roleId;
}

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

function transitionMenu(hide, show, type){
  hide.style.display = "none";
  show.style.display = type;
};

function roleOrder() {
  sortedRoles = [...new Set(rolePool.map(Number))]
    .filter(ids => orderOfRoles.includes(ids))
    .sort((a, b) => orderOfRoles.indexOf(a) - orderOfRoles.indexOf(b))

  wakeUp();
}