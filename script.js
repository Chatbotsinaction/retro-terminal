// -------- Boot Sequence -------- 
startHeavyInterference(4500);
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
    "what is special order 937 ?": "NOSTROMO REROUTED\nTO NEW CO-ORDINATES.\nINVESTIGATE LIFE FORM. GATHER SPECIMEN.PRIORITY ONE\nINSURE RETURN OF ORGANISM\nFOR ANALYSIS.\nALL OTHER CONSIDERATIONS SECONDARY.\nCREW EXPENDABLE",
    "what is the purpose of special order 937 ?": "UNABLE TO COMPUTE",
    "what is the meaning of the message sent on lv-426 ?": "UNABLE TO COMPUTE"
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
        }, 5000);
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
//const crt = document.getElementById("crt");
//const ctx = crt.getContext("2d");
//crt.width = window.innerWidth;
//crt.height = window.innerHeight;
//
//function drawCRT() {
//  const imageData = ctx.createImageData(crt.width, crt.height);
//  for (let i = 0; i < imageData.data.length; i += 4) {
//      const noise = Math.random() * 40;
//      imageData.data[i] = noise;
//      imageData.data[i+1] = noise;
//      imageData.data[i+2] = noise;
//      imageData.data[i+3] = 255;
//  }
//  ctx.putImageData(imageData, 0, 0);
//  requestAnimationFrame(drawCRT);
//}
//
//drawCRT();

// -------- Start terminal on click or key --------
window.addEventListener("click", startTerminal, { once: true });
window.addEventListener("keydown", startTerminal, { once: true });

function startTerminal() {
    playBoot();
}

/* -----------------------------------------------------------
   OPTION C — HEAVY INTERFERENCE (FULL SIGNAL BREAKDOWN)
----------------------------------------------------------- */

function startHeavyInterference(duration = 4000) {
    const layer = document.getElementById("interference-layer");

    // Create RGB offset layers
    const red = document.createElement("div");
    red.classList.add("rgb-offset", "red");
    const blue = document.createElement("div");
    blue.classList.add("rgb-offset", "blue");
    layer.appendChild(red);
    layer.appendChild(blue);

    // Create static noise
    const noise = document.createElement("div");
    noise.classList.add("static-noise");
    layer.appendChild(noise);

    // Create tearing bands
    const bands = [];
    for (let i = 0; i < 6; i++) {
        const b = document.createElement("div");
        b.classList.add("interference-band");
        layer.appendChild(b);
        bands.push(b);
    }

    // Animate the chaos
    const interval = setInterval(() => {
        // RGB separation
        red.style.opacity = 0.4;
        red.style.transform = `translate(${Math.random() * 8}px, ${Math.random() * 4}px)`;

        blue.style.opacity = 0.4;
        blue.style.transform = `translate(${-Math.random() * 8}px, ${-Math.random() * 4}px)`;

        // Heavy noise pulsing
        noise.style.opacity = Math.random() * 0.45;

        // Tearing bands
        bands.forEach(b => {
            b.style.top = Math.random() * 100 + "vh";
            b.style.opacity = Math.random() > 0.5 ? 1 : 0;
            b.style.transform = `translateX(${(Math.random() * 80) - 40}px)
                                 skewX(${(Math.random() * 30) - 15}deg)`;
            b.style.height = (6 + Math.random() * 14) + "vh";
            b.style.background = `rgba(0, ${150 + Math.random()*105}, 0, ${0.25 + Math.random()*0.2})`;
        });

    }, 80);

    // Stop after duration
    setTimeout(() => {
        clearInterval(interval);
        layer.style.opacity = 0;
        setTimeout(() => layer.remove(), 1200);
    }, duration);
}

/* -----------------------------------------------------------
   SOUND DISTORTION FOR HEAVY INTERFERENCE
----------------------------------------------------------- */
function startSoundDistortion(duration = 4000) {

    const staticNoise = document.getElementById("distort-static");
    const pop = document.getElementById("distort-pop");
    const hum = document.getElementById("distort-hum");
    const bootSound = document.getElementById("boot-sound");

    // Volume setup
    staticNoise.volume = 0.45;
    hum.volume = 0.25;

    staticNoise.play();
    hum.play();

    // Boot sound pitch glitch
    const origPlaybackRate = bootSound.playbackRate;
    bootSound.playbackRate = 0.55 + Math.random() * 0.4;

    // Random popping generator
    const popTimer = setInterval(() => {
        pop.volume = 0.2 + Math.random() * 0.5;
        pop.currentTime = 0;
        pop.play();
    }, 300 + Math.random() * 200);

    // Hum detuning wobble
    const humTimer = setInterval(() => {
        hum.playbackRate = 0.9 + Math.random() * 0.3;
    }, 150);

    // Stop everything
    setTimeout(() => {
        staticNoise.pause();
        hum.pause();
        clearInterval(popTimer);
        clearInterval(humTimer);

        staticNoise.currentTime = 0;
        hum.currentTime = 0;

        bootSound.playbackRate = origPlaybackRate;

    }, duration);
}
