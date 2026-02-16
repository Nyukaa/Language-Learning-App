import { useState } from "react";
import { ArrowLeft, Trash2, Edit2, Check, X, Tag } from "lucide-react";
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
  const [isEditingLemma, setIsEditingLemma] = useState(false);
  const [editedLemma, setEditedLemma] = useState(card.lemma);
  const [isEditingTranslation, setIsEditingTranslation] = useState(false);
  const [editedTranslation, setEditedTranslation] = useState(card.translation);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editedCategory, setEditedCategory] = useState(card.category);
  const [editingContextIndex, setEditingContextIndex] = useState<number | null>(
    null
  );
  const [editedContext, setEditedContext] = useState("");
  const [localKnowledge, setLocalKnowledge] = useState(card.knowledgeLevel);
  // const handleKnowledgeClick = (level: 0 | 1 | 2) => {
  //   setLocalKnowledge(level); // обновляем сразу локально
  //   onUpdateKnowledge(card.id, level); // вызываем родителя для сохранения
  // };
  const handleDelete = () => {
    if (confirm("Delete this card?")) {
      onDelete(card.id);
      onBack();
    }
  };

  const handleSaveLemma = () => {
    if (editedLemma.trim()) {
      onUpdateCard(card.id, { lemma: editedLemma.trim() });
      setIsEditingLemma(false);
    }
  };

  const handleCancelLemmaEdit = () => {
    setEditedLemma(card.lemma);
    setIsEditingLemma(false);
  };

  const handleSaveTranslation = () => {
    onUpdateCard(card.id, { translation: editedTranslation.trim() });
    setIsEditingTranslation(false);
  };

  const handleCancelTranslationEdit = () => {
    setEditedTranslation(card.translation);
    setIsEditingTranslation(false);
  };

  const handleSaveCategory = () => {
    onUpdateCard(card.id, { category: editedCategory.trim() });
    setIsEditingCategory(false);
  };

  const handleCancelCategoryEdit = () => {
    setEditedCategory(card.category);
    setIsEditingCategory(false);
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
          Назад
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
          {isEditingLemma ? (
            <div className="flex items-center justify-center gap-2 mb-4">
              <input
                type="text"
                value={editedLemma}
                onChange={(e) => setEditedLemma(e.target.value)}
                className="text-4xl font-medium text-center border-b-2 border-blue-500 focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveLemma();
                  if (e.key === "Escape") handleCancelLemmaEdit();
                }}
              />
              <button
                onClick={handleSaveLemma}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancelLemmaEdit}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl font-medium">{card.lemma}</h1>
              <button
                onClick={() => setIsEditingLemma(true)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          )}

          {card.word !== card.lemma && (
            <div className="text-sm text-gray-500 mb-2">
              (from text: <span className="italic">{card.word}</span>)
            </div>
          )}

          {isEditingTranslation ? (
            <div className="flex items-center justify-center gap-2 mb-4">
              <input
                type="text"
                value={editedTranslation}
                onChange={(e) => setEditedTranslation(e.target.value)}
                placeholder="Add translation..."
                className="text-xl text-gray-700 text-center border-b-2 border-blue-500 focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTranslation();
                  if (e.key === "Escape") handleCancelTranslationEdit();
                }}
              />
              <button
                onClick={handleSaveTranslation}
                className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelTranslationEdit}
                className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-4">
              {card.translation ? (
                <>
                  <p className="text-xl text-gray-700">{card.translation}</p>
                  <button
                    onClick={() => setIsEditingTranslation(true)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingTranslation(true)}
                  className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
                >
                  + Add translation
                </button>
              )}
            </div>
          )}

          {isEditingCategory ? (
            <div className="flex items-center justify-center gap-2 mb-6">
              <input
                type="text"
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                placeholder="Category..."
                className="text-sm px-3 py-1 border-2 border-blue-500 rounded-full focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveCategory();
                  if (e.key === "Escape") handleCancelCategoryEdit();
                }}
              />
              <button
                onClick={handleSaveCategory}
                className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={handleCancelCategoryEdit}
                className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-6">
              {card.category ? (
                <>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    <Tag className="w-3 h-3" />
                    {card.category}
                  </span>
                  <button
                    onClick={() => setIsEditingCategory(true)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingCategory(true)}
                  className="text-xs text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  Add category
                </button>
              )}
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
