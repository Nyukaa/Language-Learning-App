import { Plus, FileText } from "lucide-react";
import type { Language } from "../App";

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onAddCard: () => void;
  onAddText: () => void;
  showAddButtons: boolean;
  userEmail?: string | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

const languageNames: Record<Language, string> = {
  // ru: "Русский",
  fi: "Suomi",
  en: "English",
};

export function Header({
  currentLanguage,
  onLanguageChange,
  onAddCard,
  onAddText,
  showAddButtons,
  onLogin,
  onLogout,
  userEmail,
}: HeaderProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(languageNames).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            {showAddButtons && (
              <>
                {userEmail ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{userEmail}</span>
                    <button
                      onClick={onLogout}
                      className="text-gray-500 text-sm hover:text-gray-600 border border-blue-500 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onLogin}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Sign in with Google
                  </button>
                )}
              </>
            )}
          </div>

          <div className="text-sm text-gray-600 capitalize">{dateStr}</div>
        </div>

        {showAddButtons && (
          <div className="flex gap-2">
            <button
              onClick={onAddCard}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add card</span>
            </button>

            <button
              onClick={onAddText}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Add text</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
