import { Home, BookOpen, TrendingUp, BookMarked } from "lucide-react";
import type { Screen, MainView } from "../App";

interface BottomNavProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  mainView: MainView;
  onMainViewChange: (view: MainView) => void;
}

export function BottomNav({
  currentScreen,
  onScreenChange,
  mainView,
  onMainViewChange,
}: BottomNavProps) {
  const isMainScreen = currentScreen === "main";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto">
        {isMainScreen && (
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => onMainViewChange("cards")}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mainView === "cards"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => onMainViewChange("text")}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mainView === "text"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Texts
            </button>
          </div>
        )}

        <div className="flex items-center justify-around">
          <button
            onClick={() => onScreenChange("main")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === "main"
                ? "text-blue-500"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Main</span>
          </button>

          <button
            onClick={() => onScreenChange("dictionary")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === "dictionary"
                ? "text-blue-500"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Dictionary</span>
          </button>

          <button
            onClick={() => onScreenChange("progress")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === "progress"
                ? "text-blue-500"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">Progress</span>
          </button>

          {/* <button
            onClick={() => onScreenChange('diary')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === 'diary'
                ? 'text-blue-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookMarked className="w-5 h-5" />
            <span className="text-xs">Дневник</span>
          </button> */}
        </div>
      </div>
    </nav>
  );
}
