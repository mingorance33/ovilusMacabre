// app.js

// ===========================
// CONFIGURACIÓN BÁSICA
// ===========================

// Array de palabras: si las cargas desde words.json, asegúrate de que
// en index.html o en otro script se defina "palabras" global.
let palabras = window.palabras || palabras;

// Intervalo global
let intervaloHablar = null;

// ===========================
// LÓGICA QUINTA PALABRA
// ===========================

const PALABRA_ESPECIAL = "SIETE DE COPAS"; // cámbiala por la que quieras
const CONTADOR_KEY = "ovilus_contador_palabras";
const ESPECIAL_KEY = "ovilus_palabra_especial_mostrada";

function getContador() {
  return parseInt(localStorage.getItem(CONTADOR_KEY) || "0", 10);
}

function setContador(n) {
  localStorage.setItem(CONTADOR_KEY, String(n));
}

function yaSeMostroEspecial() {
  return localStorage.getItem(ESPECIAL_KEY) === "true";
}

function marcarEspecialMostrada() {
  localStorage.setItem(ESPECIAL_KEY, "true");
}

// ===========================
// FUNCIÓN PRINCIPAL
// ===========================

function hablarPalabra() {
  if (!palabras || !Array.isArray(palabras) || palabras.length === 0) {
    console.warn("No hay palabras definidas.");
    return;
  }

  // Actualizar contador total de palabras en este navegador
  let contador = getContador();
  contador++;

  let palabra;

  if (!yaSeMostroEspecial() && contador === 5) {
    // Quinta palabra -> forzamos la especial
    palabra = PALABRA_ESPECIAL;
    marcarEspecialMostrada();
  } else {
    // Lógica normal: palabra aleatoria
    palabra = palabras[Math.floor(Math.random() * palabras.length)];
  }

  setContador(contador);

  // Mostrar palabra en pantalla
  const wordEl = document.getElementById("word");
  if (wordEl) {
    wordEl.innerText = palabra;
  }

  // Configurar el ruido blanco
  const noiseEl = document.getElementById("noise");
  if (noiseEl) {
    noiseEl.volume = 0.003; // Controlado desde el HTML
  }

  // Crear la utterance (lo que se va a decir)
  const utterance = new SpeechSynthesisUtterance(palabra);

  utterance.lang = "es-ES";
  utterance.rate = 0.6;  // Más lento
  utterance.pitch = 0.2; // Más grave
  utterance.volume = 1;  // Volumen más alto

  // Obtener voces en español
  const voices = speechSynthesis.getVoices().filter(v => v.lang.includes("es"));

  // Selección aleatoria entre voz grave y voz de niña
  const randomVoice = Math.random() < 0.5
    ? (voices.find(v => v.name.toLowerCase().includes("jorge")) || voices[0])
    : (voices.find(v => v.name.toLowerCase().includes("maría")) || voices[0]);

  if (randomVoice) {
    if (randomVoice.name.toLowerCase().includes("jorge")) {
      utterance.pitch = 0.2; // Grave
      utterance.rate = 0.5;  // Más lenta
    } else if (randomVoice.name.toLowerCase().includes("maría")) {
      utterance.pitch = 1.2; // Aguda (niña)
      utterance.rate = 0.6;  // Relativamente lenta
    }

    utterance.voice = randomVoice;
  }

  // Hablar la palabra
  speechSynthesis.speak(utterance);
}

// ===========================
// CONTROL: INICIAR / DETENER
// ===========================

function iniciarOvilus() {
  if (!intervaloHablar) {
    // Primera palabra inmediata
    hablarPalabra();
    // Luego cada 15 segundos
    intervaloHablar = setInterval(hablarPalabra, 15000);
  }

  const startBtn = document.getElementById("button");
  const stopBtn = document.getElementById("stopButton");
  if (startBtn) startBtn.style.display = "none";
  if (stopBtn) stopBtn.style.display = "inline-block";
}

function detenerOvilus() {
  speechSynthesis.cancel();

  if (intervaloHablar) {
    clearInterval(intervaloHablar);
    intervaloHablar = null;
  }

  const wordEl = document.getElementById("word");
  if (wordEl) wordEl.innerText = "—";

  const startBtn = document.getElementById("button");
  const stopBtn = document.getElementById("stopButton");
  if (startBtn) startBtn.style.display = "inline-block";
  if (stopBtn) stopBtn.style.display = "none";
}

// 👇 Añade esto al final de app.js
window.addEventListener("load", () => {
  const noiseEl = document.getElementById("noise");
  if (noiseEl) {
    noiseEl.volume = 0.002; // MUY bajo
  }

// ===========================
// INICIALIZACIÓN
// ===========================

window.addEventListener("load", () => {
  // Asegurar que las voces se cargan
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices();
    };
  }

  const startBtn = document.getElementById("button");
  const stopBtn = document.getElementById("stopButton");

  if (startBtn) {
    startBtn.addEventListener("click", iniciarOvilus);
  }
  if (stopBtn) {
    stopBtn.addEventListener("click", detenerOvilus);
  }
});
