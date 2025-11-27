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

const userInput = document.getElementById("user-input");
const output = document.getElementById("output");

let typingTimeout;

const commands = {
    "hello": "Hello, user. How can I assist you?",
    "help": "Available commands: hello, help, version",
    "version": "Retro Terminal v1.0"
};

window.addEventListener("keydown", (e) => {
    if (terminal.classList.contains("hidden")) return;

    userInput.classList.remove("finished");

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        userInput.classList.add("finished");
    }, 800);

    if (e.key.length === 1) {
        userInput.textContent += e.key;
        typeSound.currentTime = 0;
        typeSound.play();
    }

    if (e.key === "Backspace") {
        userInput.textContent = userInput.textContent.slice(0, -1);
    }

    if (e.key === "Enter") {
        processCommand(userInput.textContent);
        userInput.textContent = "";
        userInput.classList.remove("finished");
    }
});

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
