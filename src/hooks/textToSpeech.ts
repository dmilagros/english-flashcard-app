export const textToSpeech = (
  text: string,
  lang: string = "en-US",
  rate?: number
): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Filtra las voces por idioma
    const selectedVoice = voices.find((voice) => voice.lang === lang && voice.name.includes("Google"));
    
    // Asigna la voz seleccionada, si está disponible
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = lang;
    utterance.pitch = 1;
    utterance.rate = rate || 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Texto a voz no es soportado en este navegador.");
  }
};
