import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { TextEntry, FlashCard } from "../App";

interface TextReaderProps {
  texts: TextEntry[];
  vocabulary: Set<string>;
  cards: FlashCard[];
  onAddWord: (word: string, lemma: string, context: string) => void;
}

export function TextReader({
  texts,
  vocabulary,
  cards,
  onAddWord,
}: TextReaderProps) {
  const [selectedText, setSelectedText] = useState<TextEntry | null>(
    texts.length > 0 ? texts[0] : null
  );
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [editedLemma, setEditedLemma] = useState<string>("");
  const [selectedContext, setSelectedContext] = useState<string>("");
  const [showAddWordPopup, setShowAddWordPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    const rect = selection?.getRangeAt(0).getBoundingClientRect();
    if (!text || text.includes(" ")) return setShowAddWordPopup(false);

    const sentenceEl =
      selection?.anchorNode?.parentElement?.closest(".js-sentence");
    if (!sentenceEl || !selectedText || !rect) return;

    setSelectedWord(text);
    setEditedLemma(text);
    setSelectedContext(sentenceEl.textContent?.trim() || text);
    setPopupPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    setShowAddWordPopup(true);
  };

  const handleAddWord = () => {
    console.log("Adding word:", { selectedWord, editedLemma, selectedContext });
    if (editedLemma.trim() && selectedContext) {
      onAddWord(selectedWord, editedLemma.trim(), selectedContext);
      setShowAddWordPopup(false);
      setEditedLemma("");
      setSelectedWord("");
      setSelectedContext("");
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleCancelAdd = () => {
    setShowAddWordPopup(false);
    setEditedLemma("");
    setSelectedWord("");
    setSelectedContext("");
    window.getSelection()?.removeAllRanges();
  };

  const highlightVocabulary = (text: string) => {
    // Split text into sentences
    const sentences = text.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);

    return sentences.map((sentence, i) => {
      // Split sentence into words & punctuation for highlighting
      const words = sentence.split(/(\s+|[.,!?;:()"])/);

      const highlightedWords = words.map((word, index) => {
        const cleanWord = word
          .toLowerCase()
          .replace(/^[.,!?;:()"]+|[.,!?;:()"]+$/g, "");

        const isInVocabulary = cleanWord && vocabulary.has(cleanWord);

        if (isInVocabulary && cleanWord === word.toLowerCase()) {
          return (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 rounded px-1"
            >
              {word}
            </span>
          );
        } else if (isInVocabulary && cleanWord !== word.toLowerCase()) {
          const punctuationBefore = word.match(/^[.,!?;:()"]+/)?.[0] || "";
          const punctuationAfter = word.match(/[.,!?;:()"]+$/)?.[0] || "";
          const wordWithoutPunctuation = word.slice(
            punctuationBefore.length,
            word.length - punctuationAfter.length
          );

          return (
            <span key={index}>
              {punctuationBefore}
              <span className="bg-blue-100 text-blue-800 rounded px-1">
                {wordWithoutPunctuation}
              </span>
              {punctuationAfter}
            </span>
          );
        }
        return <span key={index}>{word}</span>;
      });

      return (
        <span key={i} className="js-sentence">
          {highlightedWords} {/* keep spacing between sentences */}
        </span>
      );
    });
  };

  // const existingCard = cards.find(
  //   (c) => c.word.toLowerCase() === editedLemma.toLowerCase()
  // );
  const normalize = (text: string) => text.trim().toLowerCase();

  const existingCard = cards.find((c) => {
    const normalizedLemma = normalize(editedLemma);
    const cardLemma = normalize(c.lemma);
    const cardForms = (c.wordForms || []).map(normalize);

    return (
      cardLemma === normalizedLemma ||
      cardForms.includes(normalize(selectedWord))
    );
  });
  if (texts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">
          No texts yet. Add your first text to read!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {texts.length > 1 && (
        <div className="mb-4">
          <select
            value={selectedText?.id || ""}
            onChange={(e) => {
              const text = texts.find((t) => t.id === e.target.value);
              setSelectedText(text || null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {texts.map((text) => (
              <option key={text.id} value={text.id}>
                {text.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedText && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-medium text-xl mb-4">{selectedText.title}</h2>
          <div
            className="text-gray-800 leading-relaxed whitespace-pre-wrap select-text"
            onMouseUp={handleTextSelection}
          >
            {highlightVocabulary(selectedText.content)}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            💡 Highlight a word to add it to the dictionary
          </div>
        </div>
      )}

      {showAddWordPopup && (
        <>
          {/* Overlay  */}
          <div className="fixed inset-0 z-40" onClick={handleCancelAdd} />

          <div
            className="fixed z-50 transform -translate-x-1/2 -translate-y-full bg-white rounded-lg shadow-2xl border border-gray-200"
            style={{
              left: popupPosition.x,
              top: popupPosition.y,
              width: "320px",
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm text-gray-700">
                  {existingCard
                    ? "Add context to existing word"
                    : "Add new word"}
                </h3>
                <button
                  onClick={handleCancelAdd}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Selected: <span className="font-medium">{selectedWord}</span>
                </label>
                {existingCard ? (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                    <div className="font-medium text-blue-900 mb-1">
                      Lemma: {existingCard.lemma}
                    </div>
                    <div className="text-blue-700">
                      {existingCard.contexts.length}{" "}
                      {existingCard.contexts.length === 1
                        ? "context"
                        : "contexts"}
                    </div>
                  </div>
                ) : (
                  <>
                    <label className="block text-xs text-gray-600 mb-1 mt-2">
                      Lemma(basic form):
                    </label>
                    <input
                      type="text"
                      value={editedLemma}
                      onChange={(e) => setEditedLemma(e.target.value)}
                      placeholder="For example: hyvä, tulla"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddWord();
                        if (e.key === "Escape") handleCancelAdd();
                      }}
                    />
                  </>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Context:
                </label>
                <textarea
                  value={selectedContext}
                  onChange={(e) => setSelectedContext(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  rows={2}
                />
              </div>

              <button
                onClick={handleAddWord}
                disabled={!editedLemma.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                {existingCard ? "Add context" : "Add word"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
