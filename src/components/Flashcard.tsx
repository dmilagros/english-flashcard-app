import React, { useState, useEffect } from "react";
import "./Flashcard.scss";

interface FlashcardData {
  id: string | number;
  word: string;
  simple_sentence: string;
  complex_sentence: string;
  pronunciation: string;
  spanish: string;
}

const Flashcard: React.FC = () => {
  const [type, setType] = useState<string>("vocabulary_adjectives_descriptions");
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cards]);

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

  return (
    <div className="flashcard-container">
			<div className="types">
        <button onClick={() => setType("vocabulary_adjectives_descriptions")}>Adjetivos y descripciones</button>
        <button onClick={() => setType("vocabulary_clothing_accessories")}>Ropa y accesorios</button>
        <button onClick={() => setType("vocabulary_common_verbs")}>Verbos comunes</button>
        <button onClick={() => setType("vocabulary_education_learning")}>Educación y aprendizaje</button>
        <button onClick={() => setType("vocabulary_food_cooking")}>Comida y cocina</button>
        <button onClick={() => setType("vocabulary_health_wellness")}>Salud y bienestar</button>
        <button onClick={() => setType("vocabulary_home_furniture")}>Hogar y muebles</button>
        <button onClick={() => setType("vocabulary_objects")}>Objetos cotidianos</button>
        <button onClick={() => setType("vocabulary_places_travel")}>Lugares y viajes</button>
        <button onClick={() => setType("vocabulary_technology")}>Tecnología</button>
        <button onClick={() => setType("vocabulary_verb_tenses")}>Tiempos verbales</button>
      </div>
      <div className="flashcard">
        <p className="word">
          {cards[currentIndex].id}. {cards[currentIndex].word}
        </p>
        <p className="spanish">{cards[currentIndex].spanish}</p>
        <p className="pronunciation">{cards[currentIndex].pronunciation}</p>
        <p className="simple-sentence">{cards[currentIndex].simple_sentence}</p>
        <p className="complex-sentence">
          {cards[currentIndex].complex_sentence}
        </p>
      </div>
      <div className="controls">
        <button onClick={handlePrev}>Anterior</button>
        <button onClick={handleNext}>Siguiente</button>
      </div>
    </div>
  );
};

export default Flashcard;
