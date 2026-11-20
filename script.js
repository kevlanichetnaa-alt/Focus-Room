// ==============================
// Virtual Study Room Application
// ==============================

/* -------- Pomodoro Timer -------- */

const TIMER_STUDY = 25 * 60; // 25 minutes in seconds
const TIMER_BREAK = 5 * 60; // 5 minutes in seconds

let timerMode = "study"; // "study" or "break"
let timerSeconds = TIMER_STUDY;
let timerInterval = null;
let timerRunning = false;
let sessionCount = 0;
let dailyGoalCount = 0;

const timerDisplay = document.getElementById("timerDisplay");
const timerLabel = document.getElementById("timerLabel");
const startTimerBtn = document.getElementById("startTimerBtn");
const pauseTimerBtn = document.getElementById("pauseTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");
const timerProgressCircle = document.querySelector(".timer-progress");
const sessionCountSpan = document.getElementById("sessionCount");
const dailyGoalCountSpan = document.getElementById("dailyGoalCount");
const alertAudio = document.getElementById("alertAudio");

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return m.toString().padStart(2, '0') + ":" +
        s.toString().padStart(2, '0');
}

function updateTimerUI() {
    timerDisplay.textContent = formatTime(timerSeconds);

    timerLabel.textContent =
        timerMode === "study" ? "Study" : "Break";

    // Progress circle
    const total = timerMode === "study" ?
        TIMER_STUDY : TIMER_BREAK;

    const pct = timerSeconds / total;

    timerProgressCircle.setAttribute(
        "stroke-dashoffset",
        314 * (1 - pct)
    );
}

/* Save session and daily goal counters in localStorage */

function saveCounters() {
    localStorage.setItem("sessionCount", sessionCount);
    localStorage.setItem("dailyGoalCount", dailyGoalCount);
}

/* Load session and daily goal counters */

function loadCounters() {
    sessionCount = Number(localStorage.getItem("sessionCount")) || 0;
    dailyGoalCount = Number(localStorage.getItem("dailyGoalCount")) || 0;

    sessionCountSpan.textContent = sessionCount;
    dailyGoalCountSpan.textContent = dailyGoalCount;
}

loadCounters();

function startTimer() {
    if (timerRunning) return;

    timerRunning = true;

    timerInterval = setInterval(() => {
        timerSeconds--;

        updateTimerUI();

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;

            alertAudio.currentTime = 0;
            alertAudio.play();

            // Pomodoro session end logic
            if (timerMode === "study") {
                sessionCount++;
                dailyGoalCount++;

                sessionCountSpan.textContent = sessionCount;
                dailyGoalCountSpan.textContent = dailyGoalCount;

                saveCounters();

                timerMode = "break";
                timerSeconds = TIMER_BREAK;

            } else {
                timerMode = "study";
                timerSeconds = TIMER_STUDY;
            }

            setTimeout(() => startTimer(), 1000);
            // Start next automatically after brief alert
        }

    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
}

function resetTimer() {
    pauseTimer();

    timerMode = "study";
    timerSeconds = TIMER_STUDY;

    updateTimerUI();
}

/* Timer controls events */

startTimerBtn.onclick = () => startTimer();
pauseTimerBtn.onclick = () => pauseTimer();
resetTimerBtn.onclick = () => resetTimer();

/* Initial timer */

updateTimerUI();


/* -------- Motivational Quotes -------- */

const quotesArr = [
    "Believe in yourself. You are capable of amazing things!",
    "Don't watch the clock. Do what it does. Keep going.",
    "Success is the sum of small efforts repeated every day.",
    "Focus on progress, not perfection.",
    "Discipline is the bridge between goals and accomplishment.",
    "Small steps every day lead to big results.",
    "The best way to get things done is simply to begin.",
    "Stay positive, work hard, make it happen."
];

const quoteText = document.getElementById("quoteText");
const changeQuoteBtn = document.getElementById("changeQuoteBtn");

function showRandomQuote() {
    const idx = Math.floor(Math.random() * quotesArr.length);

    quoteText.textContent = quotesArr[idx];
}

changeQuoteBtn.onclick = showRandomQuote;

showRandomQuote();


/* --------- Study Music Player --------- */

const studyAudio = document.getElementById("studyAudio");
const musicPlayBtn = document.getElementById("musicPlayBtn");
const musicMuteBtn = document.getElementById("musicMuteBtn");
const musicStatus = document.getElementById("musicStatus");

let musicPlaying = false;
let musicMuted = false;

musicPlayBtn.onclick = () => {
    if (musicPlaying) {
        studyAudio.pause();

        musicPlayBtn.textContent = "▶️";
        musicStatus.textContent = "Paused";

        musicPlaying = false;

    } else {
        studyAudio.play();

        musicPlayBtn.textContent = "⏸️";
        musicStatus.textContent = "Playing";

        musicPlaying = true;
    }
};

musicMuteBtn.onclick = () => {
    musicMuted = !musicMuted;

    studyAudio.muted = musicMuted;

    musicMuteBtn.textContent = musicMuted ? "🔇" : "🔈";
};

studyAudio.onended = () => {
    musicPlayBtn.textContent = "▶️";
    musicStatus.textContent = "Paused";

    musicPlaying = false;
};

// Pause music on page unload

window.addEventListener('beforeunload', () => {
    studyAudio.pause();
});


/* ----------- To-Do List ----------- */

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

const TODO_STORAGE_KEY = "studyRoomTodoList";

let todos = [];

function loadTodos() {
    const stored = localStorage.getItem(TODO_STORAGE_KEY);

    todos = stored ? JSON.parse(stored) : [];
}

function saveTodos() {
    localStorage.setItem(
        TODO_STORAGE_KEY,
        JSON.stringify(todos)
    );
}

function renderTodos() {
    todoList.innerHTML = "";

    if (todos.length === 0) {
        todoList.innerHTML =
            `<li style="opacity:.5;text-align:center;">
                No tasks yet.
            </li>`;

        return;
    }

    todos.forEach((todo, idx) => {

        const li = document.createElement("li");

        li.className = todo.completed ? "completed" : "";

        // Complete checkbox
        const checkBtn = document.createElement("span");

        checkBtn.className = "todo-check";

        checkBtn.innerHTML = todo.completed ? "✔️" : "⬜";

        checkBtn.onclick = () => {
            todos[idx].completed = !todo.completed;

            saveTodos();
            renderTodos();
        };

        li.appendChild(checkBtn);

        // Task text
        li.appendChild(document.createTextNode(todo.text));

        // Delete button
        const delBtn = document.createElement("span");

        delBtn.className = "todo-delete";
        delBtn.innerHTML = "✖";

        delBtn.onclick = () => {
            todos.splice(idx, 1);

            saveTodos();
            renderTodos();
        };

        li.appendChild(delBtn);

        todoList.appendChild(li);
    });
}

todoForm.addEventListener("submit", e => {
    e.preventDefault();

    const val = todoInput.value.trim();

    if (!val) return;

    todos.push({
        text: val,
        completed: false
    });

    saveTodos();
    renderTodos();

    todoInput.value = "";
});

// Startup: load and render todo

loadTodos();
renderTodos();


/* ----------- Live Clock ----------- */

const clockDisplay = document.getElementById("clockDisplay");

function updateClock() {
    const now = new Date();

    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");

    clockDisplay.textContent = `${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);

updateClock();


/* ---------- Dark/Light Mode ---------- */

const modeToggle = document.getElementById("modeToggle");

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    localStorage.setItem('studyRoomTheme', theme);

    modeToggle.textContent =
        theme === 'dark' ? '☀️' : '🌙';
}

modeToggle.onclick = function () {
    const cur =
        document.documentElement.getAttribute('data-theme');

    setTheme(cur === 'dark' ? 'light' : 'dark');
};

(function () {
    const theme =
        localStorage.getItem('studyRoomTheme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light');

    setTheme(theme);
})();


/* ---------- Fullscreen Focus Mode ---------- */

const fullscreenBtn = document.getElementById("fullscreenBtn");

fullscreenBtn.onclick = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();

        fullscreenBtn.textContent = "❌";

    } else {
        document.exitFullscreen();

        fullscreenBtn.textContent = "⛶";
    }
};

document.addEventListener('fullscreenchange', () => {
    fullscreenBtn.textContent =
        document.fullscreenElement ? "❌" : "⛶";
});