import { useState } from "react";
import { Trash2, Search } from "lucide-react";
import type { FlashCard } from "../App";

interface DictionaryProps {
  cards: FlashCard[];
  onCardClick: (card: FlashCard) => void;
  onDeleteCard: (cardId: string) => void;
}

type SortBy = "frequency" | "knowledge" | "date";

export function Dictionary({
  cards,
  onCardClick,
  onDeleteCard,
}: DictionaryProps) {
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = cards.filter(
    (card) =>
      card.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.contexts.some((ctx) =>
        ctx.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case "frequency":
        return a.repetitions - b.repetitions; // По возрастанию: меньше повторений сначала
      case "knowledge":
        return a.knowledgeLevel - b.knowledgeLevel; // По возрастанию: хуже знание сначала
      case "date":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  const knowledgeLevelColors = {
    0: "bg-gray-100 border-gray-300 text-gray-700",
    1: "bg-yellow-100 border-yellow-300 text-yellow-800",
    2: "bg-green-100 border-green-300 text-green-800",
  };

  const handleDelete = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this card from the dictionary?")) {
      onDeleteCard(cardId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the dictionary…"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("date")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
              sortBy === "date"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            By date
          </button>
          <button
            onClick={() => setSortBy("frequency")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
              sortBy === "frequency"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            By frequency
          </button>
          <button
            onClick={() => setSortBy("knowledge")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
              sortBy === "knowledge"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            By knowledge
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {sortedCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onCardClick(card)}
            className={`bg-white border-2 ${
              knowledgeLevelColors[card.knowledgeLevel]
            } rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium mb-1">{card.word}</h3>
                <p className="text-sm text-gray-600 italic mb-2">
                  {card.contexts[0]}
                </p>
                {card.contexts.length > 1 && (
                  <p className="text-xs text-blue-600 mb-2">
                    +{card.contexts.length - 1}{" "}
                    {card.contexts.length === 2 ? "context" : "contexts"}
                  </p>
                )}
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>Repetitions: {card.repetitions}</span>
                  <span>•</span>
                  <span>
                    {new Date(card.createdAt).toLocaleDateString("en-Us")}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => handleDelete(card.id, e)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedCards.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {searchQuery
            ? "Nothing found"
            : "The dictionary is empty. Add your first word!"}
        </div>
      )}
    </div>
  );
}
