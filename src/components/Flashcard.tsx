import React, { useState, useEffect } from "react";
import "./Flashcard.scss";
import { textToSpeech } from "../hooks/textToSpeech";

interface FlashcardData {
  id: string | number;
  word: string;
  simple_sentence: string;
  simple_sentence_spanish: string;
  complex_sentence: string;
  complex_sentence_spanish: string;
  pronunciation: string;
  spanish: string;
}

interface VocabularyType {
  label: string;
  value: string;
}

/* 
Phrasal verbs list con Be, Break, Bring, Call
Phrasal verbs list con Carry, Come, Cut, Do
Phrasal verbs list con Fall, Get, Give, Go, Keep
Phrasal verbs list con Look ,Make ,Move ,Pass
Phrasal verbs list con Pick, Put, Run, Set, See
Phrasal verbs list con Take, Turn, Work, Give
Phrasal verbs list con Hold, Check, Take, Bring
 */
const Flashcard: React.FC = () => {
  const [type, setType] = useState<string>(
    "vocabulary_adjectives_descriptions"
  );
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const typeList: VocabularyType[] = [
    {
      label: "Adjetivos y descripciones",
      value: "vocabulary_adjectives_descriptions",
    },
    { label: "Ropa y accesorios", value: "vocabulary_clothing_accessories" },
    { label: "Verbos comunes", value: "vocabulary_common_verbs" },
    {
      label: "Educación y aprendizaje",
      value: "vocabulary_education_learning",
    },
    { label: "Comida y cocina", value: "vocabulary_food_cooking" },
    { label: "Salud y bienestar", value: "vocabulary_health_wellness" },
    { label: "Hogar y muebles", value: "vocabulary_home_furniture" },
    { label: "Objetos cotidianos", value: "vocabulary_objects" },
    { label: "Lugares y viajes", value: "vocabulary_places_travel" },
    { label: "Tecnología", value: "vocabulary_technology" },
    { label: "Tiempos verbales", value: "vocabulary_verb_tenses" },
    { label: "Phrasal Verbs", value: "vocabulary_phrasal_verbs" },
  ];

  // Función para cargar las flashcards desde el archivo JSON
  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`/data/${type}.json`);
      //const response = await fetch(`http://localhost:3001/api/data/${type}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      //removeDuplicatesFromFile()
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // Función para eliminar duplicados en el archivo JSON
  /* const removeDuplicatesFromFile = async () => {
		try {
			//const response = await fetch(`http://localhost:3001/api/remove-duplicates/${type}.json`, {
			const response = await fetch(`http://localhost:3001/api/remove-duplicates/${type}.json`, {
				method: "POST",
			});
			
			// Verificar si la respuesta es JSON
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
	
			const result = await response.json();
			console.log("Updated Data:", result.data);
			setCards(result.data); // Actualiza el estado con los datos únicos
		} catch (error) {
			console.error("Error al eliminar duplicados:", error);
		}
	}; */

  useEffect(() => {
    fetchFlashcards();
  }, [type]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cards]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      handleNext();
    } else if (event.key === "ArrowLeft") {
      handlePrev();
    }
  };

  if (cards.length === 0) {
    return <div className="flashcard-container">Cargando tarjetas...</div>;
  }

  const removeDuplicates = (data: FlashcardData[]): FlashcardData[] => {
    const uniqueWords = new Set();
    return data.filter((item) => {
      if (!uniqueWords.has(item.word)) {
        uniqueWords.add(item.word);
        return true;
      }
      return false;
    });
  };

  const renderSentence = (
    text?: string,
    className?: string,
    isClickable = true
  ) => {
    return text ? (
      <div className="text-to-speech">
        {isClickable ? (
          <>
            <div className="button-speech">
              <img
                src="/images/normal.png"
                alt="icon"
                onClick={isClickable ? () => textToSpeech(text) : undefined}
              />
            </div>
            <div className="button-speech">
              <img
                src="/images/slow.png"
                alt="icon"
                onClick={
                  isClickable
                    ? () => textToSpeech(text, "en-US", 0.05)
                    : undefined
                }
              />
            </div>
          </>
        ) : null}
        <p className={className}>{text}</p>
      </div>
    ) : null;
  };

  return (
    <div className="wrapper">
      <div className="types">
        {typeList.map((type) => (
          <button
            key={type.value}
            onClick={() => {
              setType(type.value);
              setCurrentIndex(0);
            }}
          >
            {type.label}
          </button>
        ))}
      </div>
      <section className="container-flashcard">
        <div className="flashcard">
          <p className="number">{cards[currentIndex].id}</p>
          {renderSentence(cards[currentIndex].word, "word")}
          <p className="spanish">{cards[currentIndex].spanish}</p>
          <p className="pronunciation">{cards[currentIndex].pronunciation}</p>
          {renderSentence(
            cards[currentIndex].simple_sentence,
            "simple-sentence"
          )}
          {renderSentence(
            cards[currentIndex].simple_sentence_spanish,
            "simple-sentence-spanish",
            false
          )}
          {renderSentence(
            cards[currentIndex].complex_sentence,
            "complex-sentence"
          )}
          {renderSentence(
            cards[currentIndex].complex_sentence_spanish,
            "complex-sentence-spanish",
            false
          )}
        </div>

        <div className="controls">
          <button onClick={handlePrev}>Anterior</button>
          <button onClick={handleNext}>Siguiente</button>
        </div>
      </section>
    </div>
  );
};

export default Flashcard;
