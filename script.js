const bootText = `Initializing system... 
Loading kernel modules...
Booting Retro Terminal v1.0...

Ready.`;

const bootScreen = document.getElementById("boot-screen");
const terminal = document.getElementById("terminal");
const typeSound = document.getElementById("type-sound");
const responseSound = document.getElementById("response-sound");
const bootSound = document.getElementById("boot-sound");
const userInput = document.getElementById("user-input");
const output = document.getElementById("output");

let bootIndex = 0;

// Boot Sequence -----------------------------------
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

// Command system ---------------------------------------------------
const commands = {
    "hello": "Hello! How can I assist you today?",
    "help": "Available commands: hello, help, version, whoareyou",
    "version": "Retro Terminal v1.1",
    "hi mother": "INTERFACE 2037 READU FOR INQUIRY",
    "request clarification on science inability to neutralize alien": "UNABLE TO CLARIFY",
    "request enhancement": "NO FURTHER ENHANCEMENT\nSPECIAL ORDER 937\nSCIENCE OFFICER EYES ONLY\nEMERGENCY COMMAND OVERIDE 100375",
    "what is special order 937 ?": "NOSTROMO REROUTED\nTO NEW CO-ORDINATES.\nINVESTIGATE LIFE FORM. GATHER SPECIMEN.\nPRIORITY ONE\nINSURE RETURN OF ORGANISM\nFOR ANALYSIS.\nALL OTHER CONSIDERATIONS SECONDARY.\nCREW EXPENDABLE",
    "whoareyou": "I am your retro-style terminal assistant."
};

window.addEventListener("keydown", (e) => {
    if (terminal.classList.contains("hidden")) return;

    // Remove "last-char" before adding new character
    cleanLastHighlight();

    if (e.key.length === 1) {
        typeSound.currentTime = 0;
        typeSound.play();

        let text = userInput.textContent;
        userInput.textContent = "";

        // Rebuild characters so last one can be styled
        for (let i = 0; i < text.length; i++) {
            userInput.append(text[i]);
        }

        // Add new last char with highlight
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

        // Reset input
        userInput.textContent = "";
        cleanLastHighlight();
    }
});

function cleanLastHighlight() {
    const last = userInput.querySelector(".last");
    if (last) {
        last.classList.remove("last");
    }
}

// Process command logic ---------------------------
function processCommand(cmd) {
    output.textContent += `\n> ${cmd}`;

    const answer = commands[cmd.toLowerCase()] || "Unknown command.";

    setTimeout(() => {
        responseSound.currentTime = 0;
        responseSound.play();

        output.textContent += `\n${answer}\n`;
        output.scrollTop = output.scrollHeight;
    }, 200);
}

// CRT NOISE ---------------------------------------
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
