/*
    Voir le readme.md pour une description complète des différentes
    fonctionnalités et des descriptions de fonction.
    Voir le CR.pdf pour une description du projet, des bugs rencontrés etc...
*/

const TARGET_WIDTH = 40;
const TARGET_HEIGHT = 40;

// Gestion chrono
let time = 0;
let chronoTimer = null;
let intervalId;

//  Arthur DEFAIX


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("create").addEventListener('click', onClickButtonOneTarget);
    document.getElementById("start").addEventListener('click', onClickButtonStart);

    createAlertBox("WinningAlertBox", "Bravo !", "Vous avez gagné en : <span id='AlertMinute'></span>' <span id='AlertSecond'></span>'' <span id='AlertTenth'></span> !<br>Félicitations !");
    createAlertBox("ErrAlertBox", "", "", "none");
});

/* Gestion d'une cible */

// Fonction gérant le bouton "Une cible" quand cliqué
function onClickButtonOneTarget() {
    const target = document.querySelectorAll(".target");
    if (target.length === 0) {
        targetCreator();
    } else {
        console.error("ERROR : 1 seul cible à la fois.");
    }
}

// Fonction de création des cibles
function targetCreator() {
    const zoneDeJeu = document.getElementById("terrain");
    const target = document.createElement("div");
    const positionX = Math.random() * (zoneDeJeu.offsetWidth - TARGET_WIDTH);
    const positionY = Math.random() * (zoneDeJeu.offsetHeight - TARGET_HEIGHT);

    target.classList.add("target");
    target.style.left = `${positionX}px`;
    target.style.top = `${positionY}px`;
    target.style.opacity = 1;

    zoneDeJeu.appendChild(target);

    target.addEventListener('click', onClickTarget);
    target.addEventListener('mouseenter', () => target.classList.add("on"));
    target.addEventListener('mouseleave', () => target.classList.remove("on"));
}

// Fonction qui fait disparaître la cible une fois touchée
function onClickTarget() {
    const targets = document.querySelectorAll(".target");
    targets.forEach(target => removeElementWithDelay(target, 300));
}

// Fonction permettant d'attendre le délai avant de supprimer l'élément
function removeElementWithDelay(element, delay) {
    element.classList.add('hit');
    setTimeout(() => element.remove(), delay);
}

/* Gestion du temps */

// Fonction mettant à jour le timer
function updateTimer(buttonTime) {
    const currentTime = Date.now();
    chronoTimer = currentTime - buttonTime;

    const totalSeconds = Math.floor(chronoTimer / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const tenth = Math.floor((chronoTimer % 1000) / 100);

    document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").textContent = (totalSeconds % 60).toString().padStart(2, '0');
    document.getElementById("tenth").textContent = tenth;
}

// Arrête le jeu et le timer
function stopTimer() {
    clearInterval(intervalId);
}

/* Gestion des cibles multiples après clic sur démarrer */

function onClickButtonStart() {
    const nbrtarget = parseInt(document.getElementById("nbtargets").value);
    if (nbrtarget === 0) {
        ErrAlertBoxCreator('Attention !', 'Le nombre de cibles ne peut pas être égal à 0...');
        return;
    }

    const targetRemaining = document.getElementById("remaining");
    targetRemaining.textContent = nbrtarget;

    document.querySelectorAll(".target").forEach(target => target.remove());

    if (intervalId) stopTimer();
    time = Date.now();
    intervalId = setInterval(() => updateTimer(time), 10);

    multipleTargetCreator(nbrtarget);
}

function multipleTargetCreator(nbrtarget) {
    const zoneDeJeu = document.getElementById("terrain");

    for (let i = 1; i <= nbrtarget; i++) {
        const target = document.createElement("div");
        const positionX = Math.random() * (zoneDeJeu.offsetWidth - TARGET_WIDTH);
        const positionY = Math.random() * (zoneDeJeu.offsetHeight - TARGET_HEIGHT);
        const targetRemaining = document.getElementById("remaining");

        target.classList.add("target");
        target.id = `target${i}`;
        target.style.left = `${positionX}px`;
        target.style.top = `${positionY}px`;
        target.style.opacity = 1;

        zoneDeJeu.appendChild(target);

        target.addEventListener('click', (event) => {
            if (!event.target.classList.contains("hit")) {
                targetRemaining.textContent = parseInt(targetRemaining.textContent) - 1;
                if (targetRemaining.textContent == 0) win();
                removeElementWithDelay(event.target, 300);
            }
        });
        target.addEventListener('mouseenter', () => target.classList.add("on"));
        target.addEventListener('mouseleave', () => target.classList.remove("on"));
    }
}

/* Autres */

function win() {
    const minute = document.getElementById("minutes").textContent;
    const seconds = document.getElementById("seconds").textContent;
    const tenth = document.getElementById("tenth").textContent;

    stopTimer();

    document.getElementById("AlertMinute").textContent = minute;
    document.getElementById("AlertSecond").textContent = seconds;
    document.getElementById("AlertTenth").textContent = tenth;

    showMyAlert("WinningAlertBox");
}

// MyAlerts
function createAlertBox(id, header, message, displayState = "none") {
    const alertbox = document.createElement('div');
    alertbox.innerHTML = `<h2>${header}</h2><p>${message}</p><button onclick="closeMyAlert()">Fermer</button>`;
    alertbox.id = id;
    alertbox.className = 'myAlertBox';
    alertbox.style.display = displayState;
    document.body.appendChild(alertbox);
}

function ErrAlertBoxCreator(header, msg) {
    const alertbox = document.getElementById('ErrAlertBox');
    alertbox.querySelector('h2').textContent = header;
    alertbox.querySelector('p').textContent = msg;
    showMyAlert('ErrAlertBox');
}

function showMyAlert(id) {
    document.getElementById(id).style.display = '';
}

function closeMyAlert() {
    document.querySelectorAll('.myAlertBox').forEach(element => element.style.display = 'none');
}
