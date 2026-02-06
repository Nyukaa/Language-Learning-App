import { useState } from "react";
import { ArrowLeft, Trash2, Edit2, Check, X } from "lucide-react";
import type { FlashCard } from "../App";

interface CardDetailProps {
  card: FlashCard;
  onUpdateKnowledge: (cardId: string, level: 0 | 1 | 2) => void;
  onUpdateCard: (cardId: string, updates: Partial<FlashCard>) => void;
  onBack: () => void;
  onDelete: (cardId: string) => void;
}

export function CardDetail({
  card,
  onUpdateKnowledge,
  onUpdateCard,
  onBack,
  onDelete,
}: CardDetailProps) {
  const [isEditingWord, setIsEditingWord] = useState(false);
  const [editedWord, setEditedWord] = useState(card.word);
  const [editingContextIndex, setEditingContextIndex] = useState<number | null>(
    null
  );
  const [editedContext, setEditedContext] = useState("");

  const handleDelete = () => {
    if (confirm("Delete this card?")) {
      onDelete(card.id);
      onBack();
    }
  };

  const handleSaveWord = () => {
    if (editedWord.trim()) {
      onUpdateCard(card.id, { word: editedWord.trim() });
      setIsEditingWord(false);
    }
  };

  const handleCancelWordEdit = () => {
    setEditedWord(card.word);
    setIsEditingWord(false);
  };

  const handleStartEditContext = (index: number) => {
    setEditingContextIndex(index);
    setEditedContext(card.contexts[index]);
  };

  const handleSaveContext = () => {
    if (editedContext.trim() && editingContextIndex !== null) {
      const newContexts = [...card.contexts];
      newContexts[editingContextIndex] = editedContext.trim();
      onUpdateCard(card.id, { contexts: newContexts });
      setEditingContextIndex(null);
      setEditedContext("");
    }
  };

  const handleCancelContextEdit = () => {
    setEditingContextIndex(null);
    setEditedContext("");
  };

  const handleDeleteContext = (index: number) => {
    if (card.contexts.length === 1) {
      alert(
        "Cannot delete the only context. Please add another context before deleting this one."
      );
      return;
    }
    if (confirm("Delete this context?")) {
      const newContexts = card.contexts.filter((_, i) => i !== index);
      onUpdateCard(card.id, { contexts: newContexts });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="text-center mb-8">
          {isEditingWord ? (
            <div className="flex items-center justify-center gap-2 mb-4">
              <input
                type="text"
                value={editedWord}
                onChange={(e) => setEditedWord(e.target.value)}
                className="text-4xl font-medium text-center border-b-2 border-blue-500 focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveWord();
                  if (e.key === "Escape") handleCancelWordEdit();
                }}
              />
              <button
                onClick={handleSaveWord}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancelWordEdit}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl font-medium">{card.word}</h1>
              <button
                onClick={() => setIsEditingWord(true)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="space-y-3">
            {card.contexts.map((context, index) => (
              <div key={index} className="border-t border-gray-200 pt-3">
                {editingContextIndex === index ? (
                  <div className="flex items-start gap-2">
                    <textarea
                      value={editedContext}
                      onChange={(e) => setEditedContext(e.target.value)}
                      className="flex-1 text-lg text-gray-600 italic border-2 border-blue-500 rounded-lg px-3 py-2 focus:outline-none resize-none"
                      rows={2}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) handleSaveContext();
                        if (e.key === "Escape") handleCancelContextEdit();
                      }}
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={handleSaveContext}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelContextEdit}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3 group">
                    <p className="flex-1 text-lg text-gray-600 italic">
                      "{context}"
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEditContext(index)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {card.contexts.length > 1 && (
                        <button
                          onClick={() => handleDeleteContext(index)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onUpdateKnowledge(card.id, 0)}
            className={`w-full py-4 px-6 rounded-lg text-lg transition-colors flex items-center justify-center gap-2 ${
              card.knowledgeLevel === 0
                ? "bg-gray-300 text-gray-900 ring-2 ring-gray-500"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            <span className="text-2xl">❌</span>
            <span>Don`t know</span>
          </button>

          <button
            onClick={() => onUpdateKnowledge(card.id, 1)}
            className={`w-full py-4 px-6 rounded-lg text-lg transition-colors flex items-center justify-center gap-2 ${
              card.knowledgeLevel === 1
                ? "bg-yellow-300 text-yellow-900 ring-2 ring-yellow-600"
                : "bg-yellow-100 hover:bg-yellow-200 text-yellow-900"
            }`}
          >
            <span className="text-2xl">⚠️</span>
            <span>Almost</span>
          </button>

          <button
            onClick={() => onUpdateKnowledge(card.id, 2)}
            className={`w-full py-4 px-6 rounded-lg text-lg transition-colors flex items-center justify-center gap-2 ${
              card.knowledgeLevel === 2
                ? "bg-green-300 text-green-900 ring-2 ring-green-600"
                : "bg-green-100 hover:bg-green-200 text-green-900"
            }`}
          >
            <span className="text-2xl">✅</span>
            <span>Know</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-medium mb-1">Reviews</div>
              <div className="text-2xl font-medium text-gray-900">
                {card.repetitions}
              </div>
            </div>
            <div>
              <div className="font-medium mb-1">Contexts</div>
              <div className="text-2xl font-medium text-blue-600">
                {card.contexts.length}
              </div>
            </div>
            <div>
              <div className="font-medium mb-1">Last rewiew</div>
              <div className="text-gray-900">
                {card.lastReviewed
                  ? new Date(card.lastReviewed).toLocaleDateString("en-US")
                  : "Never"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
