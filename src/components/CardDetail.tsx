import { ArrowLeft, Trash2 } from "lucide-react";
import type { FlashCard } from "../App";

interface CardDetailProps {
  card: FlashCard;
  onUpdateKnowledge: (cardId: string, level: 0 | 1 | 2) => void;
  onBack: () => void;
  onDelete: (cardId: string) => void;
}

export function CardDetail({
  card,
  onUpdateKnowledge,
  onBack,
  onDelete,
}: CardDetailProps) {
  const handleDelete = () => {
    if (confirm("Delete this card?")) {
      onDelete(card.id);
      onBack();
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
          <h1 className="text-4xl font-medium mb-4">{card.word}</h1>
          <p className="text-lg text-gray-600 italic">"{card.context}"</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onUpdateKnowledge(card.id, 0)}
            className="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-2xl">❌</span>
            <span>Don`t know</span>
          </button>

          <button
            onClick={() => onUpdateKnowledge(card.id, 1)}
            className="w-full py-4 px-6 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-lg text-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-2xl">⚠️</span>
            <span>Almost</span>
          </button>

          <button
            onClick={() => onUpdateKnowledge(card.id, 2)}
            className="w-full py-4 px-6 bg-green-100 hover:bg-green-200 text-green-900 rounded-lg text-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-2xl">✅</span>
            <span>Know</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-medium mb-1">Reviews</div>
              <div className="text-2xl font-medium text-gray-900">
                {card.repetitions}
              </div>
            </div>
            <div>
              <div className="font-medium mb-1">Last review</div>
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
