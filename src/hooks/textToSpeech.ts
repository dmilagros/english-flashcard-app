export const textToSpeech = (
  text: string,
  lang: string = "en-US",
  rate?: number
): void => {
  // Verifica si el navegador soporta la API de texto a voz
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // Opcional: Puedes modificar el tono, la velocidad y el volumen
    utterance.pitch = 1; // Rango entre 0 y 2
    utterance.rate = rate || 0.8; // Velocidad entre 0.1 y 10
    utterance.volume = 1; // Volumen entre 0 y 1

    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Texto a voz no es soportado en este navegador.");
  }
};
