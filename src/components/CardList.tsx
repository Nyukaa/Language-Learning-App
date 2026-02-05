import { Card } from "./Card";
import type { FlashCard } from "../App";

interface CardListProps {
  cards: FlashCard[];
  onCardClick: (card: FlashCard) => void;
  onUpdateKnowledge: (cardId: string, level: 0 | 1 | 2) => void;
}

export function CardList({
  cards,
  onCardClick,
  onUpdateKnowledge,
}: CardListProps) {
  if (cards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">No cards to study. Add your first card!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-3">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => onCardClick(card)}
            onUpdateKnowledge={onUpdateKnowledge}
          />
        ))}
      </div>
    </div>
  );
}
