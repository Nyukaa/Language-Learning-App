import { useState, useEffect, useMemo } from "react";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { CardList } from "./components/CardList";
import { TextReader } from "./components/TextReader";
import { CardDetail } from "./components/CardDetail";
import { Dictionary } from "./components/Dictionary";
import { Progress } from "./components/Progress";
import { AddCardModal } from "./components/AddCardModal";
import { AddTextModal } from "./components/AddTextModal";

export interface FlashCard {
  id: string;
  word: string;
  lemma: string;
  wordForms: string[]; //all forms of the word (for better search and recognition)
  translation: string;
  category: string;
  contexts: string[];
  language: string;
  knowledgeLevel: 0 | 1 | 2; // 0: Don't know, 1: Almost, 2: Know
  repetitions: number;
  lastReviewed: Date | null;
  createdAt: Date;
}

export interface TextEntry {
  id: string;
  title: string;
  content: string;
  language: string;
  createdAt: Date;
}

export type Language = "ru" | "fi" | "en";
export type Screen = "main" | "card-detail" | "dictionary" | "progress";
export type MainView = "cards" | "text";

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("ru");
  const [currentScreen, setCurrentScreen] = useState<Screen>("main");
  const [mainView, setMainView] = useState<MainView>("cards");
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [texts, setTexts] = useState<TextEntry[]>([]);
  const [selectedCard, setSelectedCard] = useState<FlashCard | null>(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddTextModal, setShowAddTextModal] = useState(false);
  //const [vocabulary, setVocabulary] = useState<Set<string>>(new Set());
  const normalize = (text: string) => text.trim().toLowerCase();

  // Load data from localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem("languageCards");
    const savedTexts = localStorage.getItem("languageTexts");

    if (savedCards) {
      const parsedCards = JSON.parse(savedCards);

      setCards(
        parsedCards.map((card: any) => ({
          ...card,
          wordForms: card.wordForms || [card.word?.toLowerCase?.() || ""], // миграция
          contexts: card.contexts || [card.context],
          lemma: card.lemma || card.word,
          translation: card.translation || "",
          category: card.category || "",
          lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
          createdAt: new Date(card.createdAt),
        }))
      );
    }

    if (savedTexts) {
      const parsedTexts = JSON.parse(savedTexts);
      setTexts(
        parsedTexts.map((text: any) => ({
          ...text,
          createdAt: new Date(text.createdAt),
        }))
      );
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("languageCards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("languageTexts", JSON.stringify(texts));
  }, [texts]);

  const addCard = (word: string, context: string) => {
    const normalizedWord = normalize(word);

    const newCard: FlashCard = {
      id: Date.now().toString(),
      word,
      lemma: word,
      wordForms: [normalizedWord],
      translation: "",
      category: "",
      contexts: [context],
      language: currentLanguage,
      knowledgeLevel: 0,
      repetitions: 0,
      lastReviewed: null,
      createdAt: new Date(),
    };

    setCards((prev) => [newCard, ...prev]);
  };

  //
  const updateKnowledgeLevel = (cardId: string, level: 0 | 1 | 2) => {
    setCards((prev) => {
      const newCards = prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              knowledgeLevel: level,
              repetitions: card.repetitions + 1,
              lastReviewed: new Date(),
            }
          : card
      );
      // Обновляем selectedCard, если это она
      if (selectedCard?.id === cardId) {
        setSelectedCard(newCards.find((c) => c.id === cardId) || null);
      }
      return newCards;
    });
  };

  const addText = (title: string, content: string) => {
    const newText: TextEntry = {
      id: Date.now().toString(),
      title,
      content,
      language: currentLanguage,
      createdAt: new Date(),
    };
    setTexts([newText, ...texts]);
  };

  //   const existingCard = cards.find(
  //     (card) =>
  //       card.lemma.toLowerCase() === lemma.toLowerCase() &&
  //       card.language === currentLanguage
  //   );

  //   if (existingCard) {
  //     const contextExists = existingCard.contexts.some(
  //       (ctx) => ctx.trim().toLowerCase() === context.trim().toLowerCase()
  //     );

  //     if (contextExists) {
  //       alert("Этот контекст уже добавлен к карточке");
  //       return;
  //     }

  //     setCards(
  //       cards.map((card) =>
  //         card.id === existingCard.id
  //           ? { ...card, contexts: [...card.contexts, context] }
  //           : card
  //       )
  //     );

  //     // Добавляем новое исходное слово в vocabulary для подсветки
  //     setVocabulary(new Set([...vocabulary, word.toLowerCase()]));
  //   } else {
  //     const newCard: FlashCard = {
  //       id: Date.now().toString(),
  //       word,
  //       lemma,
  //       translation: "",
  //       category: "",
  //       contexts: [context],
  //       language: currentLanguage,
  //       knowledgeLevel: 0,
  //       repetitions: 0,
  //       lastReviewed: null,
  //       createdAt: new Date(),
  //     };
  //     setCards([newCard, ...cards]);
  //     setVocabulary(new Set([...vocabulary, word.toLowerCase()]));
  //   }
  // };
  const addWordFromText = (word: string, lemma: string, context: string) => {
    console.log("=== ADD WORD DEBUG ===");
    console.log("word:", word);
    console.log("lemma:", lemma);
    console.log("context:", context);
    console.log("currentLanguage:", currentLanguage);
    console.log("existing cards:", cards);

    const normalizedLemma = normalize(lemma);
    const normalizedWord = normalize(word);
    const normalizedContext = normalize(context);

    setCards((prevCards) => {
      const existingCard = prevCards.find((card) => {
        if (card.language !== currentLanguage) return false;

        const cardLemma = normalize(card.lemma);
        const cardForms = (card.wordForms || []).map(normalize);
        console.log("checking card:", card.word);
        console.log("cardLemma:", cardLemma);
        console.log("cardForms:", cardForms);
        return (
          cardLemma === normalizedLemma || cardForms.includes(normalizedWord)
        );
      });

      if (existingCard) {
        return prevCards.map((card) => {
          if (card.id !== existingCard.id) return card;

          const safeWordForms = card.wordForms || [];
          const safeContexts = card.contexts || [];
          console.log("existing contexts:", safeContexts);
          const wordExists = safeWordForms
            .map(normalize)
            .includes(normalizedWord);
          console.log("normalizedContext:", normalizedContext);
          console.log(
            "normalized existing contexts:",
            safeContexts.map(normalize)
          );
          const contextExists = safeContexts
            .map(normalize)
            .includes(normalizedContext);

          return {
            ...card,
            wordForms: wordExists
              ? safeWordForms
              : [...safeWordForms, normalizedWord],
            contexts: contextExists ? safeContexts : [...safeContexts, context],
          };
        });
      }

      const newCard: FlashCard = {
        id: Date.now().toString(),
        word,
        lemma,
        wordForms: [normalizedWord],
        translation: "",
        category: "",
        contexts: [context],
        language: currentLanguage,
        knowledgeLevel: 0,
        repetitions: 0,
        lastReviewed: null,
        createdAt: new Date(),
      };

      return [newCard, ...prevCards];
    });
  };

  const updateCard = (cardId: string, updates: Partial<FlashCard>) => {
    setCards(
      cards.map((card) => (card.id === cardId ? { ...card, ...updates } : card))
    );

    if (selectedCard?.id === cardId) {
      setSelectedCard({ ...selectedCard, ...updates });
    }
  };

  const deleteCard = (cardId: string) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const filteredCards = cards.filter(
    (card) => card.language === currentLanguage
  );
  // vocabulary is all word forms of all cards in the current language, used for highlighting in TextReader
  const vocabulary = useMemo(() => {
    return new Set(
      cards
        .filter((c) => c.language === currentLanguage)
        .flatMap((c) => c.wordForms)
    );
  }, [cards, currentLanguage]);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onAddCard={() => setShowAddCardModal(true)}
        onAddText={() => setShowAddTextModal(true)}
        showAddButtons={currentScreen === "main"}
      />

      <main className="flex-1 pb-20">
        {currentScreen === "main" && mainView === "cards" && (
          <CardList
            cards={filteredCards}
            onCardClick={(card) => {
              setSelectedCard(card);
              setCurrentScreen("card-detail");
            }}
            onUpdateKnowledge={updateKnowledgeLevel}
          />
        )}

        {currentScreen === "main" && mainView === "text" && (
          <TextReader
            texts={texts.filter((t) => t.language === currentLanguage)}
            vocabulary={vocabulary}
            cards={filteredCards}
            onAddWord={addWordFromText}
          />
        )}

        {currentScreen === "card-detail" && selectedCard && (
          <CardDetail
            card={selectedCard}
            onUpdateKnowledge={updateKnowledgeLevel}
            onUpdateCard={updateCard}
            onBack={() => setCurrentScreen("main")}
            onDelete={deleteCard}
          />
        )}

        {currentScreen === "dictionary" && (
          <Dictionary
            cards={filteredCards}
            onCardClick={(card) => {
              setSelectedCard(card);
              setCurrentScreen("card-detail");
            }}
            onDeleteCard={deleteCard}
          />
        )}

        {currentScreen === "progress" && <Progress cards={filteredCards} />}
      </main>

      <BottomNav
        currentScreen={currentScreen}
        onScreenChange={(screen) => {
          setCurrentScreen(screen);
          if (screen === "main") {
            setSelectedCard(null);
          }
        }}
        mainView={mainView}
        onMainViewChange={setMainView}
      />

      {showAddCardModal && (
        <AddCardModal
          onAdd={addCard}
          onClose={() => setShowAddCardModal(false)}
        />
      )}

      {showAddTextModal && (
        <AddTextModal
          onAdd={addText}
          onClose={() => setShowAddTextModal(false)}
        />
      )}
    </div>
  );
}
