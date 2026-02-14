// app.js

// Cargar palabras desde words.json
let palabras = [];

async function cargarPalabras() {
  try {
    const response = await fetch('words.json');
    const data = await response.json();
    palabras = data.words || data;
  } catch (error) {
    console.error('Error cargando words.json:', error);
  }
}

// Contador de palabras y palabra especial (solo 1 vez en 5.º lugar)
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

// Función principal para hablar una palabra
function hablarPalabra() {
  if (!palabras || palabras.length === 0) {
    console.warn("No hay palabras cargadas todavía.");
    return;
  }

  // Actualizar contador
  let contador = getContador();
  contador++;

  let palabra;

  // Si aún no se mostró la especial y estamos en la 5.ª palabra, forzarla
  if (!yaSeMostroEspecial() && contador === 5) {
    palabra = PALABRA_ESPECIAL;
    marcarEspecialMostrada();
  } else {
    // Lógica normal: palabra aleatoria del listado
    palabra = palabras[Math.floor(Math.random() * palabras.length)];
  }

  setContador(contador);

  // Mostrar palabra en la pantalla
  const wordEl = document.getElementById("word");
  if (wordEl) {
    wordEl.innerText = palabra;
  }

  // Reproducir ruido blanco (volumen controlado desde HTML)
  const noiseEl = document.getElementById("noise");
  if (noiseEl) {
    noiseEl.volume = 0.01;
  }

  // Crear la utterance (lo que se va a decir)
  const utterance = new SpeechSynthesisUtterance(palabra);
  utterance.lang = "es-ES";
  utterance.rate = 0.6;  // Más lento
  utterance.pitch = 0.2; // Más grave
  utterance.volume = 1;  // Volumen más alto

  // Obtener la lista de voces disponibles en español
  const voices = speechSynthesis.getVoices().filter(v => v.lang.includes("es"));

  // Selección aleatoria de voz entre grave (masculina) y niña (femenina)
  const randomVoice = Math.random() < 0.5
    ? (voices.find(v => v.name.toLowerCase().includes("jorge")) || voices[0])
    : (voices.find(v => v.name.toLowerCase().includes("maría")) || voices[0]);

  // Ajustar propiedades según la voz elegida
  if (randomVoice && randomVoice.name.toLowerCase().includes("jorge")) {
    utterance.pitch = 0.2; // Mantener grave
    utterance.rate = 0.5;  // Más lento
  } else if (randomVoice && randomVoice.name.toLowerCase().includes("maría")) {
    utterance.pitch = 1.2; // Aguda (niña)
    utterance.rate = 0.6;  // Relativamente lenta
  }

  if (randomVoice) {
    utterance.voice = randomVoice;
  }

  // Hablar la palabra seleccionada
  speechSynthesis.speak(utterance);
}

// Intervalo de habla
let intervaloHablar = null;

// Iniciar Ovilus (desde el botón de tu index.html)
async function iniciarOvilus() {
  await cargarPalabras();

  // Asegurar que no haya intervalos duplicados
  if (!intervaloHablar) {
    // Primera palabra inmediata
    hablarPalabra();
    // Luego cada 15 segundos (ajusta si quieres)
    intervaloHablar = setInterval(hablarPalabra, 15000);
  }

  // Ocultar botón de inicio y mostrar stop si lo tienes
  const startBtn = document.getElementById("button");
  const stopBtn = document.getElementById("stopButton");
  if (startBtn) startBtn.style.display = "none";
  if (stopBtn) stopBtn.style.display = "inline-block";
}

// Detener todo y volver al estado inicial
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

// Listeners al cargar la página
window.addEventListener("load", () => {
  // Algunos navegadores cargan las voces de forma asíncrona
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.onvoiceschanged = () => {
      // Solo para asegurarse de que las voces están disponibles
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
