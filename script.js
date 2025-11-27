// -------- Boot Sequence -------- 
const bootText = `Initializing system... 
Loading kernel modules...
Booting Retro Terminal v1.0...

Ready.`;

const bootScreen = document.getElementById("boot-screen");
const terminal = document.getElementById("terminal");
const typeSound = document.getElementById("type-sound");
const responseSound = document.getElementById("response-sound");
const bootSound = document.getElementById("boot-sound");

let bootIndex = 0;

function playBoot() {
    bootSound.play();

    const interval = setInterval(() => {
        bootScreen.textContent = bootText.substring(0, bootIndex++);
        if (bootIndex > bootText.length) {
            clearInterval(interval);
            setTimeout(() => {
                bootScreen.classList.add("hidden");
                terminal.classList.remove("hidden");
            }, 800);
        }
    }, 40);
}

window.addEventListener("click", startTerminal, { once: true });
window.addEventListener("keydown", startTerminal, { once: true });

function startTerminal() {
    playBoot();
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
const userInput = document.getElementById("user-input");
const output = document.getElementById("output");

let firstPromptEntered = false; 
let interactionCount = 0; // <--- NEW

window.addEventListener("keydown", (e) => {
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

// -------- Process Commands --------
function processCommand(cmd) {
    cmd = cmd.trim();

    if (!firstPromptEntered) {
        if (cmd.toLowerCase() === "hi mother") {
            firstPromptEntered = true;
            appendOutput("> " + cmd);
            typeResponse("INTERFACE 2037 READY FOR INQUIRY");
        } else {
            appendOutput("> " + cmd);
            typeResponse("You must type 'hi mother' as the first prompt.");
        }
        return;
    }

    appendOutput("> " + cmd);

    const answer = commands[cmd.toLowerCase()] || "Unknown command.";
    typeResponse(answer);

    interactionCount++;

    // ---- NEW: Clear screen after 3 Q/A pairs ----
    if (interactionCount >= 3) {
        setTimeout(() => wipeScreenAndReset(), 300);
        interactionCount = 0;
        return;
    }
}

// -------- Append output instantly --------
function appendOutput(text) {
    const line = document.createElement("div");
    line.classList.add("output-line");
    line.textContent = text;
    output.appendChild(line);
    scrollTerminal();
}

// -------- Typewriter effect with sweep --------
function typeResponse(answer) {

    const answerLine = document.createElement("div");
    answerLine.classList.add("output-line");
    output.appendChild(answerLine);
    scrollTerminal();

    const sweep = document.createElement("div");
    sweep.classList.add("sweep");
    answerLine.appendChild(sweep);

    sweep.addEventListener("animationend", () => {
        sweep.remove();

        let i = 0;

        function typeChar() {
            if (i < answer.length) {
                answerLine.textContent += answer[i];
                responseSound.currentTime = 0;
                responseSound.play();
                i++;
                scrollTerminal();
                setTimeout(typeChar, 25);
            }
        }
        typeChar();
    });
}

// -------- Scroll terminal to bottom --------
function scrollTerminal() {
    terminal.scrollTop = terminal.scrollHeight;
}

// -------- NEW: Wipe screen and reset cursor at top --------
function wipeScreenAndReset() {
    output.innerHTML = "";

    const newPrompt = document.createElement("div");
    newPrompt.classList.add("output-line");
    newPrompt.innerHTML = "> ";
    output.appendChild(newPrompt);

    userInput.textContent = "";

    terminal.scrollTop = 0;
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
