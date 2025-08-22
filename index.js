
//Једна контролна структура (if или switch) 
// Једна петља (for, while или dowhile) GOTOVO 
// Један низ GOTOVO
// Минимум две функције са улазним параметрима и повратним вредностима GOTOVO
// Минимум два догађаја GOTOVO
// Промена стила елемената GOTOVO
// Преузимање података из форме 
// Додатна 2 поена: Методе са стринговима 
// Додатна 3 поена: Методе са низовима 
// Додатна 3 поена: Динамичко генерисање HTML кода
let players = [];
let no_of_players = 0;
let players_with_roles = {};
let player_shuffle = [];
let index = 0;
let buttonRole = true;

const roles = {
  1: { 
    role: "detective", 
    alignment: "town", 
    category: "investigative", 
    description: "Tokom noći može da otkrije ulogu jednog igrača." 
  },
  2: { 
    role: "doctor", 
    alignment: "town", 
    category: "protective", 
    description: "Tokom noći može da zaštiti jednog igrača od eliminacije." 
  },
  3: { 
    role: "villager", 
    alignment: "town", 
    category: "vanilla", 
    description: "Nema posebne moći, učestvuje samo u diskusiji i glasanju." 
  },
  4: { 
    role: "mafioso", 
    alignment: "mafia", 
    category: "killing", 
    description: "Svake noći, zajedno sa mafijom, bira žrtvu za eliminaciju." 
  },
  5: { 
    role: "godfather", 
    alignment: "mafia", 
    category: "killing", 
    description: "Vođa mafije, bira konačnu metu. Može izgledati nevino pri ispitivanju detektiva." 
  },
  6: { 
    role: "consigliere", 
    alignment: "mafia", 
    category: "investigative", 
    description: "Može istražiti igrače i saznati njihovu tačnu ulogu." 
  },
  7: { 
    role: "consort", 
    alignment: "mafia", 
    category: "support", 
    description: "Može blokirati jednog igrača svake noći i sprečiti ga da koristi moć." 
  },
  8: { 
    role: "serial killer", 
    alignment: "neutral", 
    category: "killing", 
    description: "Samostalno ubija jednog igrača svake noći. Njegov cilj je da bude poslednji preživeli." 
  },
  9: { 
    role: "jester", 
    alignment: "neutral", 
    category: "chaotic", 
    description: "Želi da ga selo pogrešno osudi na vešala tokom glasanja." 
  },
  10: { 
    role: "executioner", 
    alignment: "neutral", 
    category: "chaotic", 
    description: "Njegov cilj je da navede selo da osudi određenog igrača na vešala." 
  },
  11: { 
    role: "witch", 
    alignment: "neutral", 
    category: "control", 
    description: "Može kontrolisati poteze drugih igrača i preusmeravati njihove radnje." 
  },
  12: { 
    role: "arsonist", 
    alignment: "neutral", 
    category: "killing", 
    description: "Može polivati igrače benzinom i u jednoj noći ih sve zapaliti." 
  },
  13: { 
    role: "bodyguard", 
    alignment: "town", 
    category: "protective", 
    description: "Može da čuva jednog igrača tokom noći i žrtvuje se ako ga napadnu." 
  },
  14: { 
    role: "sheriff", 
    alignment: "town", 
    category: "investigative", 
    description: "Ispituje igrače tokom noći i saznaje da li su sumnjivi (mafija ili neutralni ubica)." 
  },
  15: { 
    role: "spy", 
    alignment: "town", 
    category: "investigative", 
    description: "Može prisluškivati poruke mafije i vidi koga oni napadaju." 
  },
  16: { 
    role: "tracker", 
    alignment: "town", 
    category: "investigative", 
    description: "Može pratiti jednog igrača i saznati koga je posetio te noći." 
  },
  17: { 
    role: "medium", 
    alignment: "town", 
    category: "support", 
    description: "Može komunicirati sa mrtvim igračima tokom noći." 
  },
  18: { 
    role: "escort", 
    alignment: "town", 
    category: "support", 
    description: "Može blokirati jednog igrača svake noći i sprečiti ga da koristi moć." 
  },
  19: { 
    role: "survivor", 
    alignment: "neutral", 
    category: "survival", 
    description: "Nema napadačke moći, cilj mu je samo da preživi do kraja igre." 
  },
  20: { 
    role: "amnesiac", 
    alignment: "neutral", 
    category: "flex", 
    description: "Može tokom igre odabrati da preuzme ulogu nekog već eliminisanog igrača." 
  }
};

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

const mainMenu = document.getElementById("mainMenu");
const selectionMenu = document.getElementById("roleSelection")

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = playerNameInput.value.trim();

    if (name !== "") {
        checkIfNameInList(name);
    } 
    else {
        ("Molimo unesite ime igrača!");
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

function rescaleFontOnDelete() {
    let fontSize = 6;
    playersList.style.fontSize = fontSize + "vh";

    while (playersListContainer.scrollHeight > playersListContainer.clientHeight && fontSize < 6) {
        fontSize += 0.1;
        playersList.style.fontSize = fontSize + "vh";
    }
};

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

    no_of_players += 1;

    playerNameInput.value = "";
    fitFontToList();

    if (no_of_players == 20) {
        inputManager(true);
    }
};

function inputManager(flip){
    playerNameInput.disabled = flip;
    inputButton.disabled = flip;
};

function removePlayer(item, name) {
    item.parentElement.remove();
    no_of_players -= 1;
    players = players.filter(item => item !== name);
    fitFontToList();
    inputManager(false);
};

start.addEventListener("click", function(e) {
    e.preventDefault();

    selectionMenu.style.display = "flex";
    mainMenu.style.display = "none";    

    shuffleArray(players);
    index = 0;
    playerName.textContent = players[index];
});

back.addEventListener("click", function(e) {
    e.preventDefault();

    selectionMenu.style.display = "none";
    mainMenu.style.display = "flex";

    player_shuffle = players;

    getRandomInt(no_of_players);
    shuffleArray(players);
});


reveal.addEventListener("click", function() {
    //e.preventDefault();

    if (buttonRole == true) {
        buttonRole = false;
        warning.style.display = "flex";
    }
    else {
        buttonRole = true;
        warning.style.display = "none";
        displayPlayer();
    }
});

function displayPlayer() {
    if (index == players.length - 1){
        warning.textContent = "Kliknite na dugme da sakrijete svoju ulogu i predajte telefon naratoru."
    }
    else {
        index ++;
        playerName.textContent = players[index];
    }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    console.log(array)
}