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
import { supabase } from "../supabaseClient";
import {
  createFlashcard,
  updateFlashcard,
  getFlashcards,
  deleteFlashcard,
  updateFlashcardKnowledge,
  addContextToFlashcard,
} from "./api";

import { getTexts, createText, updateText, deleteText } from "./textsApi";
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
  // for logging in with Google OAuth using Supabase
  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Login error:", error.message);
    }
  };
  // After login , get the access token and send it to the backend
  // useEffect(() => {
  //   const handleAuth = async () => {
  //     // 1️⃣ Обрабатываем OAuth redirect
  //     const { data, error } = await supabase.auth.exchangeCodeForSession(
  //       window.location.href
  //     );

  //     if (error) {
  //       console.error("Exchange error:", error.message);
  //     }

  //     // 2️⃣ Получаем session
  //     const { data: sessionData } = await supabase.auth.getSession();

  //     if (!sessionData.session) return;

  //     const token = sessionData.session.access_token;

  //     console.log("Token:", token);

  //     // 3️⃣ Отправляем в backend
  //     await fetch("http://localhost:4000/api/protected", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   };

  //   handleAuth();
  // }, []);
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        return;
      }
      console.log("TOKEN:", data.session?.access_token);
      if (data.session) {
        const token = data.session.access_token;

        await fetch("http://localhost:4000/api/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    };

    checkSession();
  }, []);

  // Load data from localStorage
  // useEffect(() => {
  //   const savedCards = localStorage.getItem("languageCards");
  //   const savedTexts = localStorage.getItem("languageTexts");

  //   if (savedCards) {
  //     const parsedCards = JSON.parse(savedCards);

  //     setCards(
  //       parsedCards.map((card: any) => ({
  //         ...card,
  //         wordForms: card.wordForms || [card.word?.toLowerCase?.() || ""], // миграция
  //         contexts: card.contexts || [card.context],
  //         lemma: card.lemma || card.word,
  //         translation: card.translation || "",
  //         category: card.category || "",
  //         lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
  //         createdAt: new Date(card.createdAt),
  //       }))
  //     );
  //   }

  //   if (savedTexts) {
  //     const parsedTexts = JSON.parse(savedTexts);
  //     setTexts(
  //       parsedTexts.map((text: any) => ({
  //         ...text,
  //         createdAt: new Date(text.createdAt),
  //       }))
  //     );
  //   }
  // }, []);
  // Load texts from backend on mount
  useEffect(() => {
    const loadTexts = async () => {
      try {
        const result = await getTexts();
        setTexts(
          result.texts.map((t) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    loadTexts();
  }, []);

  // Example usage
  const addTextHandler = async (
    title: string,
    content: string
    // language: string
  ) => {
    try {
      const result = await createText(title, content, currentLanguage);
      setTexts((prev) => [result.text, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        const result = await getFlashcards();

        const formatted = result.flashcards.map((card: any) => ({
          id: card.id,
          word: card.word,
          lemma: card.word,
          wordForms: [card.word.toLowerCase()],
          translation: card.translation,
          category: "",
          contexts: card.contexts.map((c: any) => c.sentence),
          language: "en",
          knowledgeLevel: card.learning_progress?.[0]?.level ?? 0,
          repetitions: card.learning_progress?.[0]?.repetitions ?? 0,
          lastReviewed: card.learning_progress?.[0]?.last_reviewed ?? null,
          createdAt: new Date(card.created_at),
        }));

        setCards(formatted);
      } catch (error) {
        console.error(error);
      }
    };

    loadFlashcards();
  }, []);

  // Save data to localStorage
  // useEffect(() => {
  //   localStorage.setItem("languageCards", JSON.stringify(cards));
  // }, [cards]);

  // useEffect(() => {
  //   localStorage.setItem("languageTexts", JSON.stringify(texts));
  // }, [texts]);

  // const addCard = (word: string, context: string) => {
  //   const normalizedWord = normalize(word);

  //   const newCard: FlashCard = {
  //     id: Date.now().toString(),
  //     word,
  //     lemma: word,
  //     wordForms: [normalizedWord],
  //     translation: "",
  //     category: "",
  //     contexts: [context],
  //     language: currentLanguage,
  //     knowledgeLevel: 0,
  //     repetitions: 0,
  //     lastReviewed: null,
  //     createdAt: new Date(),
  //   };

  //   setCards((prev) => [newCard, ...prev]);
  // };
  const addCard = async (word: string, context: string) => {
    try {
      const normalizedWord = normalize(word);

      // calling backend to create flashcard and context in the database
      const result = await createFlashcard(word, "", context);

      const newCard: FlashCard = {
        id: result.flashcard.id,
        word,
        lemma: word,
        wordForms: [normalizedWord],
        translation: result.flashcard.translation || "",
        category: "",
        contexts: [context],
        language: currentLanguage,
        knowledgeLevel: 0,
        repetitions: 0,
        lastReviewed: null,
        createdAt: new Date(result.flashcard.created_at),
      };

      setCards((prev) => [newCard, ...prev]);
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  //
  const updateKnowledgeLevel = async (cardId: string, level: 0 | 1 | 2) => {
    try {
      await updateFlashcardKnowledge(cardId, level);

      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId
            ? {
                ...card,
                knowledgeLevel: level,
                repetitions: card.repetitions + 1,
                lastReviewed: new Date(),
              }
            : card
        )
      );

      if (selectedCard?.id === cardId) {
        setSelectedCard((prev) => prev && { ...prev, knowledgeLevel: level });
      }
    } catch (error) {
      console.error(error);
    }
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
  // const addWordFromText = (word: string, lemma: string, context: string) => {
  //   console.log("=== ADD WORD DEBUG ===");
  //   console.log("word:", word);
  //   console.log("lemma:", lemma);
  //   console.log("context:", context);
  //   console.log("currentLanguage:", currentLanguage);
  //   console.log("existing cards:", cards);

  //   const normalizedLemma = normalize(lemma);
  //   const normalizedWord = normalize(word);
  //   const normalizedContext = normalize(context);

  //   setCards((prevCards) => {
  //     const existingCard = prevCards.find((card) => {
  //       if (card.language !== currentLanguage) return false;

  //       const cardLemma = normalize(card.lemma);
  //       const cardForms = (card.wordForms || []).map(normalize);
  //       console.log("checking card:", card.word);
  //       console.log("cardLemma:", cardLemma);
  //       console.log("cardForms:", cardForms);
  //       return (
  //         cardLemma === normalizedLemma || cardForms.includes(normalizedWord)
  //       );
  //     });

  //     if (existingCard) {
  //       return prevCards.map((card) => {
  //         if (card.id !== existingCard.id) return card;

  //         const safeWordForms = card.wordForms || [];
  //         const safeContexts = card.contexts || [];
  //         console.log("existing contexts:", safeContexts);
  //         const wordExists = safeWordForms
  //           .map(normalize)
  //           .includes(normalizedWord);
  //         console.log("normalizedContext:", normalizedContext);
  //         console.log(
  //           "normalized existing contexts:",
  //           safeContexts.map(normalize)
  //         );
  //         const contextExists = safeContexts
  //           .map(normalize)
  //           .includes(normalizedContext);

  //         return {
  //           ...card,
  //           wordForms: wordExists
  //             ? safeWordForms
  //             : [...safeWordForms, normalizedWord],
  //           contexts: contextExists ? safeContexts : [...safeContexts, context],
  //         };
  //       });
  //     }

  //     const newCard: FlashCard = {
  //       id: Date.now().toString(),
  //       word,
  //       lemma,
  //       wordForms: [normalizedWord],
  //       translation: "",
  //       category: "",
  //       contexts: [context],
  //       language: currentLanguage,
  //       knowledgeLevel: 0,
  //       repetitions: 0,
  //       lastReviewed: null,
  //       createdAt: new Date(),
  //     };

  //     return [newCard, ...prevCards];
  //   });
  // };
  const addWordFromText = async (
    word: string,
    lemma: string,
    context: string,
    textId?: string
  ) => {
    const normalizedWord = normalize(word);
    const normalizedLemma = normalize(lemma);
    const normalizedContext = normalize(context);

    // find existing card first
    const existingCard = cards.find((card) => {
      if (card.language !== currentLanguage) return false;
      const cardForms = card.wordForms.map(normalize);
      return (
        normalize(card.lemma) === normalizedLemma ||
        cardForms.includes(normalizedWord)
      );
    });

    if (existingCard) {
      // check if we need to add word form or context
      const wordExists = existingCard.wordForms
        .map(normalize)
        .includes(normalizedWord);
      const contextExists = existingCard.contexts
        .map(normalize)
        .includes(normalizedContext);

      if (!wordExists || !contextExists) {
        const updatedCard: FlashCard = {
          ...existingCard,
          wordForms: wordExists
            ? existingCard.wordForms
            : [...existingCard.wordForms, normalizedWord],
          contexts: contextExists
            ? existingCard.contexts
            : [...existingCard.contexts, context],
        };

        setCards((prev) =>
          prev.map((c) => (c.id === existingCard.id ? updatedCard : c))
        );

        // sync with backend
        if (existingCard.id) {
          await addContextToFlashcard(existingCard.id, context, textId);
        }
      }
      return; // already handled existing card
    }

    // create new card locally
    const newCard: FlashCard = {
      id: "", // will be set after server
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

    setCards((prev) => [newCard, ...prev]);

    // create on backend
    try {
      const result = await createFlashcard(word, "", context, textId);

      // update card with real id and translation
      setCards((prev) =>
        prev.map((c) =>
          c === newCard
            ? {
                ...c,
                id: result.flashcard.id,
                translation: result.flashcard.translation || "",
                createdAt: new Date(result.flashcard.created_at),
              }
            : c
        )
      );
    } catch (err) {
      console.error("Error syncing with backend:", err);
    }
  };

  const updateCard = async (cardId: string, updates: Partial<FlashCard>) => {
    try {
      const result = await updateFlashcard(cardId, updates);
      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, ...result.flashcard } : card
        )
      );

      if (selectedCard?.id === cardId) {
        setSelectedCard((prev) => prev && { ...prev, ...result.flashcard });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const deleteCard = (cardId: string) => {
  //   setCards(cards.filter((card) => card.id !== cardId));
  // };
  const handleDelete = async (cardId: string) => {
    try {
      await deleteFlashcard(cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (error) {
      console.error(error);
    }
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
        onLogin={login}
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
            onDelete={handleDelete}
          />
        )}

        {currentScreen === "dictionary" && (
          <Dictionary
            cards={filteredCards}
            onCardClick={(card) => {
              setSelectedCard(card);
              setCurrentScreen("card-detail");
            }}
            onDeleteCard={handleDelete}
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
          onAdd={addTextHandler}
          onClose={() => setShowAddTextModal(false)}
        />
      )}
    </div>
  );
}
