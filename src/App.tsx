import { useState, useEffect } from "react";
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
  context: string;
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
  const [vocabulary, setVocabulary] = useState<Set<string>>(new Set());

  // Load data from localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem("languageCards");
    const savedTexts = localStorage.getItem("languageTexts");
    //const savedDiary = localStorage.getItem("languageDiary");
    const savedVocabulary = localStorage.getItem("languageVocabulary");

    if (savedCards) {
      const parsedCards = JSON.parse(savedCards);
      setCards(
        parsedCards.map((card: any) => ({
          ...card,
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
    if (savedVocabulary) {
      setVocabulary(new Set(JSON.parse(savedVocabulary)));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("languageCards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("languageTexts", JSON.stringify(texts));
  }, [texts]);

  useEffect(() => {
    localStorage.setItem(
      "languageVocabulary",
      JSON.stringify(Array.from(vocabulary))
    );
  }, [vocabulary]);

  const addCard = (word: string, context: string) => {
    const newCard: FlashCard = {
      id: Date.now().toString(),
      word,
      context,
      language: currentLanguage,
      knowledgeLevel: 0,
      repetitions: 0,
      lastReviewed: null,
      createdAt: new Date(),
    };
    setCards([newCard, ...cards]);
    setVocabulary(new Set([...vocabulary, word.toLowerCase()]));
  };

  const updateCardKnowledge = (cardId: string, level: 0 | 1 | 2) => {
    setCards(
      cards.map((card) =>
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

  const addWordFromText = (word: string, context: string) => {
    addCard(word, context);
  };

  const deleteCard = (cardId: string) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const filteredCards = cards.filter(
    (card) => card.language === currentLanguage
  );

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
            onUpdateKnowledge={updateCardKnowledge}
          />
        )}

        {currentScreen === "main" && mainView === "text" && (
          <TextReader
            texts={texts.filter((t) => t.language === currentLanguage)}
            vocabulary={vocabulary}
            onAddWord={addWordFromText}
          />
        )}

        {currentScreen === "card-detail" && selectedCard && (
          <CardDetail
            card={selectedCard}
            onUpdateKnowledge={updateCardKnowledge}
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
