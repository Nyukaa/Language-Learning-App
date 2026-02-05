import { useState } from "react";
import { Plus } from "lucide-react";
import type { TextEntry } from "../App";

interface TextReaderProps {
  texts: TextEntry[];
  vocabulary: Set<string>;
  onAddWord: (word: string, context: string) => void;
}

export function TextReader({ texts, vocabulary, onAddWord }: TextReaderProps) {
  const [selectedText, setSelectedText] = useState<TextEntry | null>(
    texts.length > 0 ? texts[0] : null
  );
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [showAddWordPopup, setShowAddWordPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0 && !text.includes(" ")) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();

      if (rect) {
        setSelectedWord(text);
        setPopupPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
        setShowAddWordPopup(true);
      }
    } else {
      setShowAddWordPopup(false);
    }
  };

  const handleAddWord = () => {
    if (selectedText && selectedWord) {
      // Get context sentence
      const sentences = selectedText.content.split(/[.!?]+/);
      const contextSentence =
        sentences.find((s) =>
          s.toLowerCase().includes(selectedWord.toLowerCase())
        ) || selectedWord;

      onAddWord(selectedWord, contextSentence.trim());
      setShowAddWordPopup(false);
      window.getSelection()?.removeAllRanges();
    }
  };

  const highlightVocabulary = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, "");
      const isInVocabulary = vocabulary.has(cleanWord);

      if (isInVocabulary) {
        return (
          <span key={index} className="bg-blue-100 text-blue-800 rounded px-1">
            {word}
          </span>
        );
      }
      return <span key={index}>{word}</span>;
    });
  };

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
        <div
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full"
          style={{ left: popupPosition.x, top: popupPosition.y }}
        >
          <button
            onClick={handleAddWord}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add to dictionary
          </button>
        </div>
      )}
    </div>
  );
}
