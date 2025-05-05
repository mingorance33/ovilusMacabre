const palabras = [
  "muerte", "sombras", "demonios", "infiernos", "presencias", "dolor",
  "gritos", "jose", "entidad", "lamentos"
];
let sonidoIniciado = false; // Variable para rastrear si el sonido se ha iniciado

function hablarPalabra() {
  const palabra = palabras[Math.floor(Math.random() * palabras.length)];
  document.getElementById("word").innerText = palabra;

  const utterance = new SpeechSynthesisUtterance(palabra);
  utterance.lang = "es-ES";
  utterance.rate = 0.6;
  utterance.pitch = 0.2;
  utterance.volume = 1;

  const voices = speechSynthesis.getVoices().filter(v => v.lang.includes("es"));
  if (voices.length > 0) {
    utterance.voice = voices.find(v => v.name.toLowerCase().includes("jorge")) || voices[0];
  }

  speechSynthesis.speak(utterance);
}

function iniciarSonido() {
  const noise = document.getElementById("noise");
  if (noise && noise.paused) {
    noise.volume = 0.05;
    noise.loop = true;
    noise.play().catch(err => console.error("Error al reproducir ruido blanco:", err));
  }
}

// Lanzar las voces cuando se cargan
window.onload = () => {
  speechSynthesis.onvoiceschanged = () => hablarPalabra();
};

// Primer toque: Inicia el ruido blanco
window.addEventListener("click", () => {
  if (!sonidoIniciado) {
    iniciarSonido();
    sonidoIniciado = true;
    console.log("Ruido blanco iniciado, toca nuevamente para escuchar las palabras.");
  }
}, { once: true });

// Segundo toque: Inicia la pronunciación de las palabras
window.addEventListener("touchstart", () => {
  if (sonidoIniciado) {
    hablarPalabra();
    setInterval(hablarPalabra, 8000); // Repite la pronunciación cada 8 segundos
    console.log("Palabras comenzaron a pronunciarse.");
  } else {
    console.log("Primero toca para iniciar el ruido blanco.");
  }
}, { once: true });
