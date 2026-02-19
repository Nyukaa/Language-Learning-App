import type { FlashCard } from "../App";
import { Tag } from "lucide-react";

interface CardProps {
  card: FlashCard;
  onClick: () => void;
  onUpdateKnowledge: (cardId: string, level: 0 | 1 | 2) => void;
}

const knowledgeLevelColors = {
  0: "bg-gray-200 text-gray-700",
  1: "bg-yellow-200 text-yellow-800",
  2: "bg-green-200 text-green-800",
};

const knowledgeLevelBorders = {
  0: "border-gray-300",
  1: "border-yellow-300",
  2: "border-green-300",
};

const knowledgeLevelLabels = {
  0: "Don`t know",
  1: "Almost",
  2: "Know",
};

export function Card({ card, onClick, onUpdateKnowledge }: CardProps) {
  return (
    <div
      className={`bg-white border-2 ${
        knowledgeLevelBorders[card.knowledgeLevel]
      } rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-lg">{card.lemma}</h3>
            {card.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                <Tag className="w-3 h-3" />
                {card.category}
              </span>
            )}
          </div>
          {card.translation && (
            <p className="text-sm text-gray-500 mb-1">{card.translation}</p>
          )}
          <p className="text-sm text-gray-600 italic">
            {card.contexts?.[0]?.sentence}
          </p>
          {card.contexts?.length > 1 && (
            <p className="text-xs text-blue-600 mt-1">
              +{card.contexts.length - 1}{" "}
              {card.contexts.length === 2 ? "context" : "contexts"}
            </p>
          )}
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            knowledgeLevelColors[card.knowledgeLevel]
          }`}
        >
          {knowledgeLevelLabels[card.knowledgeLevel]}
        </div>
      </div>

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onUpdateKnowledge(card.id, 0)}
          className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
        >
          ❌ Don´t know
        </button>
        <button
          onClick={() => onUpdateKnowledge(card.id, 1)}
          className="flex-1 py-2 px-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm transition-colors"
        >
          ⚠️ Almost
        </button>
        <button
          onClick={() => onUpdateKnowledge(card.id, 2)}
          className="flex-1 py-2 px-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm transition-colors"
        >
          ✅ Know
        </button>
      </div>

      {card.repetitions > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Repetitions: {card.repetitions}
        </div>
      )}
    </div>
  );
}
