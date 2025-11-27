// -------- Boot Sequence -------- 
const bootText = `MO-TH-ER 7000
Initializing system... 
Loading kernel modules...
Booting Terminal...

Ready.`;

const bootScreen = document.getElementById("boot-screen");
const terminal = document.getElementById("terminal");
const typeSound = document.getElementById("type-sound");
const responseSound = document.getElementById("response-sound");
const bootSound = document.getElementById("boot-sound");
const userInput = document.getElementById("user-input");
const output = document.getElementById("output");

let bootIndex = 0;
let firstPromptEntered = false; // tracks if "hi mother" was entered
let qaCount = 0;               // number of Q/A pairs displayed

// -------- Inactivity timer --------
let inactivityTimer;
const INACTIVITY_LIMIT = 10000; // 10 seconds

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        returnToBoot();
    }, INACTIVITY_LIMIT);
}

function returnToBoot() {
    output.innerHTML = "";
    userInput.textContent = "";
    firstPromptEntered = false;
    qaCount = 0;

    terminal.classList.add("hidden");
    bootScreen.classList.remove("hidden");
    bootIndex = 0;
    playBoot();
}

// -------- Boot animation --------
function playBoot() {
    bootSound.play();

    const interval = setInterval(() => {
        bootScreen.textContent = bootText.substring(0, bootIndex++);
        if (bootIndex > bootText.length) {
            clearInterval(interval);
            setTimeout(() => {
                bootScreen.classList.add("hidden");
                terminal.classList.remove("hidden");
                resetInactivityTimer();
            }, 800);
        }
    }, 40);
}

// -------- Terminal Commands --------
const commands = {
    "hello": "Hello! How can I assist you today?",
    "help": "Available commands: hello, help, version, whoareyou",
    "version": "Retro Terminal v1.1",
    "whoareyou": "I am your retro-style terminal assistant",
    "hi mother": "INTERFACE 2037 READY FOR INQUIRY",
    "request clarification on science inability to neutralize alien": "UNABLE TO CLARIFY",
    "request enhancement": "NO FURTHER ENHANCEMENT\nSPECIAL ORDER 937\nSCIENCE OFFICER EYES ONLY\nEMERGENCY COMMAND OVERIDE 100375",
    "what is special order 937 ?": "NOSTROMO REROUTED\nTO NEW CO-ORDINATES.\nINVESTIGATE LIFE FORM. GATHER SPECIMEN.PRIORITY ONE\nINSURE RETURN OF ORGANISM\nFOR ANALYSIS.\nALL OTHER CONSIDERATIONS SECONDARY.\nCREW EXPENDABLE"
};

// -------- User Input Handling --------
window.addEventListener("keydown", (e) => {
    resetInactivityTimer(); // Reset inactivity timer on keypress

    if (terminal.classList.contains("hidden")) return;

    const lastChar = userInput.querySelector(".last");
    if (lastChar) lastChar.classList.remove("last");

    if (e.key.length === 1) {
        typeSound.currentTime = 0;
        typeSound.play();

        const text = userInput.textContent;
        userInput.textContent = "";

        for (let i = 0; i < text.length; i++) {
            userInput.append(text[i]);
        }

        const span = document.createElement("span");
        span.classList.add("last");
        span.textContent = e.key;
        userInput.append(span);
    }

    if (e.key === "Backspace") {
        userInput.textContent = userInput.textContent.slice(0, -1);
    }

    if (e.key === "Enter") {
        const cmd = userInput.textContent.trim();
        processCommand(cmd);
        userInput.textContent = "";
    }
});

window.addEventListener("click", resetInactivityTimer);

// -------- Process Commands --------
function processCommand(cmd) {
    cmd = cmd.trim();

    if (!firstPromptEntered) {
        if (cmd.toLowerCase() === "hi mother") {
            firstPromptEntered = true;
            appendQA("> " + cmd, "INTERFACE 2037 READY FOR INQUIRY");
        } else {
            appendQA("> " + cmd, "You must type 'hi mother' as the first prompt.");
        }
        return;
    }

    const answer = commands[cmd.toLowerCase()] || "Unknown command.";
    appendQA("> " + cmd, answer);
}

// -------- Append a Q/A pair --------
function appendQA(questionText, answerText) {
    const qaPair = document.createElement("div");
    qaPair.classList.add("qa-pair");

    const qDiv = document.createElement("div");
    qDiv.classList.add("question");
    qDiv.textContent = questionText;
    qaPair.appendChild(qDiv);

    const aDiv = document.createElement("div");
    aDiv.classList.add("answer");
    aDiv.style.position = "relative"; // ensure sweep positions correctly
    qaPair.appendChild(aDiv);

    output.appendChild(qaPair);
    scrollTerminal();

    // --- Sweep BEFORE typing answer ---
    const sweep = document.createElement("div");
    sweep.classList.add("sweep");

    // Set sweep height based on font size
    const lineHeight = parseInt(window.getComputedStyle(aDiv).fontSize) * 1.2;
    sweep.style.height = lineHeight + "px";

    aDiv.appendChild(sweep);

    sweep.addEventListener("animationend", () => {
        sweep.remove();
        typeAnswer(aDiv, answerText);
    });

    qaCount++;
    if (qaCount >= 3) {
        setTimeout(() => {
            output.innerHTML = "";
            userInput.textContent = "";
            qaCount = 0;
        }, 7000);
    }
}

// -------- Typewriter effect --------
function typeAnswer(answerDiv, text) {
    let i = 0;
    function typeChar() {
        if (i < text.length) {
            answerDiv.textContent += text[i];
            responseSound.currentTime = 0;
            responseSound.play();
            i++;
            scrollTerminal();
            setTimeout(typeChar, 25);
        }
    }
    typeChar();
}

// -------- Scroll terminal to bottom --------
function scrollTerminal() {
    terminal.scrollTop = terminal.scrollHeight;
}

// -------- CRT Noise --------
const crt = document.getElementById("crt");
const ctx = crt.getContext("2d");
crt.width = window.innerWidth;
crt.height = window.innerHeight;

function drawCRT() {
    const imageData = ctx.createImageData(crt.width, crt.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 40;
        imageData.data[i] = noise;
        imageData.data[i+1] = noise;
        imageData.data[i+2] = noise;
        imageData.data[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(drawCRT);
}

drawCRT();

// -------- Start terminal on click or key --------
window.addEventListener("click", startTerminal, { once: true });
window.addEventListener("keydown", startTerminal, { once: true });

function startTerminal() {
    playBoot();
}
