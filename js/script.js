const butLogo = document.getElementById('logo');
const logoPressSfx = new Audio("/audio/logo-click-sound.mp3");
const butPressSfx = new Audio("/audio/click-sound.mp3");
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
const accountSettingsBut = document.getElementById("accountSettingsBut");

const mainWindow = document.getElementById("mainWindow");
const settingsWindow = document.getElementById("settingsWindow");
const tasksWindow = document.getElementById("tasksWindow");
const notesWindow = document.getElementById("notesWindow");
const accountSettingsWindow = document.getElementById("accountWindow");



startBut.addEventListener("click", function() {

    mainWindow.style.display = "block";
    tasksWindow.style.display = "none";
    notesWindow.style.display = "none";
    settingsWindow.style.display = "none";
    accountSettingsWindow.style.display = "none";

});

tasksBut.addEventListener("click", function() {

    mainWindow.style.display = "none";
    tasksWindow.style.display = "block";
    notesWindow.style.display = "none";
    settingsWindow.style.display = "none";
    accountSettingsWindow.style.display = "none";

});


notesBut.addEventListener("click", function() {

    mainWindow.style.display = "none";
    tasksWindow.style.display = "none";
    notesWindow.style.display = "block";
    settingsWindow.style.display = "none";
    accountSettingsWindow.style.display = "none";

});

settingsBut.addEventListener("click", function() {

    mainWindow.style.display = "none";
    tasksWindow.style.display = "none";
    notesWindow.style.display = "none";
    settingsWindow.style.display = "block";
    accountSettingsWindow.style.display = "none";

});

accountSettingsBut.addEventListener("click", function(){
    mainWindow.style.display = "none";
    tasksWindow.style.display = "none";
    notesWindow.style.display = "none";
    settingsWindow.style.display = "none";
    accountSettingsWindow.style.display = "block";
})

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

//menu opening and closing mobile thingy ig
const menuButton = document.getElementById("menuButton");
const nav = document.querySelector("nav");

menuButton.addEventListener("click", function() {
    nav.classList.toggle("open");
});

//task thingies

const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");


function createTaskElement(taskData) {

    const task = document.createElement("div");
    task.classList.add("task");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const taskText = document.createElement("span");
    taskText.textContent = taskData.task;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Task";

    checkbox.checked = taskData.completed;

    if (taskData.completed) {
        task.classList.add("completed");
    }

    taskList.appendChild(task);
    task.appendChild(checkbox);
    task.appendChild(taskText);
    task.appendChild(deleteButton);

    deleteButton.addEventListener("click", function() {

    const clickSound = new Audio("/audio/click-sound.mp3");
    clickSound.volume = 0.5;

    if (sfxActive) {
        clickSound.play();
    }

    deleteButton.classList.add("clicked");

        setTimeout(function() {
            deleteButton.classList.remove("clicked");
        }, 80);

        fetch("/tasks", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: taskData.id
            })
        })
        .then(response => response.text())
        .then(data => {

            console.log(data);

            task.remove();
            updateTaskCounter();
        });
    });

   checkbox.addEventListener("change", function() {
        task.classList.toggle("completed");
        updateTaskCounter();

        let completed = 0;

        if (checkbox.checked) {
            completed = 1;
        }

        fetch("/tasks", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: taskData.id,
                completed: completed
            })
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        });
    });
}

function addTask() {

    if (taskInput.value === "") {
        return;
    }

    fetch("/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            task: taskInput.value
        })
    })
    .then(response => response.json())
    .then(data => {

        console.log(data);

        const taskData = {
            id: data.id,
            task: taskInput.value,
            completed: 0
        };

        createTaskElement(taskData);

        taskInput.value = "";

        updateTaskCounter();
    });
}

addTaskButton.addEventListener("click", function () {
    addTask();
});

//add also when enter is pressed
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

fetch("/tasks")
    .then(response => response.json())
    .then(data => {

        data.forEach(function(taskData) {
            createTaskElement(taskData);
        });

        updateTaskCounter();
    });

//task counter
const taskCounter = document.getElementById("taskCounter");
const progressFil = document.getElementById("progressFill");

function updateTaskCounter() {
    const totalTasks = document.querySelectorAll(".task").length;
    const completedTasks = document.querySelectorAll(".task.completed").length;

    taskCounter.textContent = completedTasks + " / " + totalTasks;

    //task progress bar :)
    let progress = 0;

    if (totalTasks > 0) {
        progress = completedTasks / totalTasks * 100;
    }

    progressFil.style.width = progress + "%"
    console.log(progress);
}

updateTaskCounter();

//aero account thingies
const logOutButton = document.getElementById("logOutButton");

logOutButton.addEventListener("click", function() {

    fetch("/logout", {
        method: "POST"
    })
    .then(response => response.text())
    .then(data => {

        console.log(data);

        if (data === "Logout succesfull!") {
            window.location.href = "/sign-in.html";
        }

    });

});

const usernameDisplay = document.getElementById("usernameDisplay");

fetch("/me")
    .then(response => response.text())
    .then(data => {

        usernameDisplay.textContent = data;

    });