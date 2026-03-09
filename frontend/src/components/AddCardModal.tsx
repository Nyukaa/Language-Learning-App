import { useState } from "react";
import { X, Mic, Loader2 } from "lucide-react";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { parseVoiceText } from "../Api/voiceService";
const languageLocales: Record<string, string> = {
  en: "en-US",
  fi: "fi-FI",
};
interface AddCardModalProps {
  onAdd: (word: string, context: string) => void;
  onClose: () => void;
  currentLanguage?: string; //
}

export function AddCardModal({
  onAdd,
  onClose,
  currentLanguage = "en",
}: AddCardModalProps) {
  const [word, setWord] = useState("");
  const [context, setContext] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const handleTranscript = async (text: string) => {
    setIsParsing(true);
    try {
      const result = await parseVoiceText(text, currentLanguage);
      if (result.word) setWord(result.word);
      if (result.context) setContext(result.context);
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsing(false);
    }
  };

  const { isListening, transcript, error, startListening } =
    useVoiceInput(handleTranscript);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && context.trim()) {
      onAdd(word.trim(), context.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Add card</h2>
          <div className="flex items-center gap-2">
            {/* Кнопка микрофона */}
            <button
              type="button"
              onClick={() =>
                startListening(languageLocales[currentLanguage] ?? "en-US")
              }
              disabled={isListening || isParsing}
              title="Add by voice"
              className={`p-2 rounded-lg transition-colors ${
                isListening
                  ? "text-red-500 bg-red-50 animate-pulse"
                  : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
              } disabled:opacity-50`}
            >
              {isParsing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Статус голоса */}
        {isListening && (
          <p className="text-sm text-red-500 mb-3 flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
            Listening...
          </p>
        )}
        {transcript && !isListening && (
          <p className="text-xs text-gray-400 mb-3 italic">"{transcript}"</p>
        )}
        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Word or phrase
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="For example: hyvää päivää"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Context (sentence)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="For example: Hyvää päivää! Mitä kuuluu?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
