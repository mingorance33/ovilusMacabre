const palabras = [
  "muerte", "sombra", "demonio", "infierno", "presencia", "dolor", "gritos", "oscuridad", "entidad", "lamento"
];

function hablarPalabra() {
  const palabra = palabras[Math.floor(Math.random() * palabras.length)];
  document.getElementById("word").innerText = palabra;
	document.getElementById("noise").volume = 0.05;


  const utterance = new SpeechSynthesisUtterance(palabra);
  utterance.lang = "es-ES";
  utterance.rate = 0.6;      // Más lento
  utterance.pitch = 0.2;     // Más grave
  utterance.volume = 1;    // Volumen más alto posible

  // Intentar seleccionar una voz grave en español, si existe
  const voices = speechSynthesis.getVoices().filter(v => v.lang.includes("es"));
  if (voices.length > 0) {
    utterance.voice = voices.find(v => v.name.toLowerCase().includes("jorge")) || voices[0];
  }

  speechSynthesis.speak(utterance);
}

setInterval(hablarPalabra, 8000);
window.onload = () => {
  // Para asegurar que las voces están cargadas
  speechSynthesis.onvoiceschanged = () => hablarPalabra();
};