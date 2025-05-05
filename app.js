const palabras = [
  "muerte", "sombra", "demonio", "infierno", "presencia", "dolor",
  "gritos", "oscuridad", "entidad", "lamento"
];

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

  // Asegurarse de que la voz esté completamente cargada antes de hablar
  setTimeout(() => {
    speechSynthesis.speak(utterance);
  }, 500); // Retraso para asegurarse de que las voces se cargan correctamente
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

// Añadir eventos para interactuar tanto con el click como el touch
window.addEventListener("click", () => {
  iniciarSonido();
  // Añadir un retraso antes de empezar a hablar para asegurar que el sonido blanco haya comenzado
  setTimeout(() => {
    hablarPalabra();
    setInterval(hablarPalabra, 8000);
  }, 500); // Retraso para evitar que la voz y el ruido blanco se mezclen
}, { once: true });

window.addEventListener("touchstart", () => {
  iniciarSonido();
  setTimeout(() => {
    hablarPalabra();
    setInterval(hablarPalabra, 8000);
  }, 500); // Retraso para dispositivos móviles
}, { once: true });
