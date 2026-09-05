const butLogo = document.getElementById('logo');
const logoPressSfx = new Audio("audio/logo-click-sound.mp3");
const butPressSfx = new Audio("audio/click-sound.mp3");
let sfxActive = true;

butPressSfx.volume = 0.3;

logoPressSfx.volume = 0.3;

butLogo.addEventListener("click", function(){

    logoPressSfx.play();

});

butLogo.addEventListener("click", function() {
    butLogo.classList.add("clicked");

    setTimeout(function() {
        butLogo.classList.remove("clicked");
    }, 80);
});

//main functions:
const startBut = document.getElementById("startBut");
const tasksBut = document.getElementById("tasksBut");
const notesBut = document.getElementById("notesBut");
const settingsBut = document.getElementById("settingsBut");

const mainWindow = document.getElementById("mainWindow");
const settingsWindow = document.getElementById("settingsWindow");
const tasksWindow = document.getElementById("tasksWindow");
const notesWindow = document.getElementById("notesWindow");



startBut.addEventListener("click", function() {

    mainWindow.style.display = "block";
    tasksWindow.style.display = "none";
    notesWindow.style.display = "none";
    settingsWindow.style.display = "none";

});

tasksBut.addEventListener("click", function() {

    mainWindow.style.display = "none";
    tasksWindow.style.display = "block";
    notesWindow.style.display = "none";
    settingsWindow.style.display = "none";

});


notesBut.addEventListener("click", function() {

    mainWindow.style.display = "none";
    tasksWindow.style.display = "none";
    notesWindow.style.display = "block";
    settingsWindow.style.display = "none";

});

settingsBut.addEventListener("click", function() {

    mainWindow.style.display = "none";
    tasksWindow.style.display = "none";
    notesWindow.style.display = "none";
    settingsWindow.style.display = "block";

});


const buttons = document.querySelectorAll("button");

buttons.forEach(function(button) {

        button.addEventListener("click", function() {

        const clickSound = new Audio("audio/click-sound.mp3");
        clickSound.volume = 0.5;
        if (sfxActive) {
            clickSound.play();    
        }
        
        button.classList.add("clicked");

        setTimeout(function() {
            button.classList.remove("clicked");
        }, 80);

    });
});


//settings screen
const toggleSfxBut = document.getElementById("soundButton");

toggleSfxBut.addEventListener("click", toggleSfx);

function toggleSfx() {
    if (sfxActive) {
        sfxActive = false;
    } else {
        sfxActive = true;
    }
}