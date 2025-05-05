function hablarPalabra() {
  // Elige una palabra aleatoria
  const palabra = palabras[Math.floor(Math.random() * palabras.length)];
  document.getElementById("word").innerText = palabra;

  // Configurar el ruido blanco
  document.getElementById("noise").volume = 0.01;

  // Crear la utterance (lo que se va a decir)
  const utterance = new SpeechSynthesisUtterance(palabra);
  utterance.lang = "es-ES";
  utterance.rate = 0.6;  // Más lento
  utterance.pitch = 0.2; // Más grave
  utterance.volume = 1;  // Volumen más alto posible

  // Obtener la lista de voces disponibles
  const voices = speechSynthesis.getVoices().filter(v => v.lang.includes("es"));

  // Selección aleatoria de voz entre grave (masculina) y niña (femenina)
  const randomVoice = Math.random() < 0.5 ? 
    // Voz masculina, más grave y lenta
    voices.find(v => v.name.toLowerCase().includes("jorge")) || voices[0] :
    // Voz femenina de niña, más aguda y espeluznante
    voices.find(v => v.name.toLowerCase().includes("maría")) || voices[0];

  // Ajustar las propiedades de la voz
  if (randomVoice.name.toLowerCase().includes("jorge")) {
    utterance.pitch = 0.2;  // Mantener grave
    utterance.rate = 0.5;   // Más lento
  } else if (randomVoice.name.toLowerCase().includes("maría")) {
    utterance.pitch = 1.2;  // Aguda (niña)
    utterance.rate = 0.6;   // Relativamente lenta
  }

  utterance.voice = randomVoice;

  // Hablar la palabra seleccionada
  speechSynthesis.speak(utterance);
}
