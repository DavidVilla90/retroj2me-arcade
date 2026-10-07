import React, { useState, useEffect } from 'react';
import { GameMetadata } from './types/game';
import { fetchGameCatalog } from './services/gamesCatalog';
import { 
  getStoredVolume, setStoredVolume, 
  getStoredMuted, setStoredMuted, 
  addRecentlyPlayed 
} from './services/storage';
import { Header } from './components/Header';
import { LibraryView } from './components/LibraryView';
import { GameDetailView } from './components/GameDetailView';
import { EmulatorScreen } from './components/EmulatorScreen';
import { ControlsModal } from './components/ControlsModal';
import { CustomJarModal } from './components/CustomJarModal';
import { TechExplanationModal } from './components/TechExplanationModal';

export default function App() {
  const [games, setGames] = useState<GameMetadata[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [currentView, setCurrentView] = useState<'library' | 'detail' | 'playing'>('library');
  const [activeGame, setActiveGame] = useState<GameMetadata | null>(null);

  // Audio settings
  const [volume, setVolume] = useState<number>(() => getStoredVolume());
  const [muted, setMuted] = useState<boolean>(() => getStoredMuted());

  // Modals
  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);

  // Load catalog on mount
  useEffect(() => {
    fetchGameCatalog().then((list) => {
      setGames(list);
      setIsLoadingCatalog(false);
    });
  }, []);

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setStoredVolume(newVol);
    if (newVol > 0 && muted) {
      setMuted(false);
      setStoredMuted(false);
    }
  };

  const handleToggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    setStoredMuted(newMuted);
  };

  const handlePlayGame = (game: GameMetadata) => {
    setActiveGame(game);
    addRecentlyPlayed(game.id);
    setCurrentView('playing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectGameDetail = (game: GameMetadata) => {
    setActiveGame(game);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomGameLoaded = (customGame: GameMetadata) => {
    setGames((prev) => [customGame, ...prev]);
    handlePlayGame(customGame);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Header */}
      <Header
        currentView={currentView}
        activeGame={activeGame}
        onNavigateHome={() => setCurrentView('library')}
        onNavigateToGame={handlePlayGame}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenTechInfo={() => setIsTechModalOpen(true)}
        volume={volume}
        muted={muted}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
      />

      {/* Main View Body */}
      <main className="flex-1">
        {isLoadingCatalog ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm font-mono-retro text-slate-400">
              Cargando catálogo arcade J2ME...
            </p>
          </div>
        ) : currentView === 'playing' && activeGame ? (
          <EmulatorScreen
            game={activeGame}
            volume={volume}
            muted={muted}
            onVolumeChange={handleVolumeChange}
            onToggleMute={handleToggleMute}
            onOpenControlsModal={() => setIsControlsModalOpen(true)}
            onBackToLibrary={() => setCurrentView('library')}
          />
        ) : currentView === 'detail' && activeGame ? (
          <GameDetailView
            game={activeGame}
            isFavorite={false}
            onToggleFavorite={() => {}}
            onPlay={handlePlayGame}
            onConfigureControls={() => setIsControlsModalOpen(true)}
            onBackToLibrary={() => setCurrentView('library')}
          />
        ) : (
          <LibraryView
            games={games}
            onPlayGame={handlePlayGame}
            onSelectGameDetail={handleSelectGameDetail}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-retro-heading font-bold text-slate-300">
              RETRO<span className="text-amber-500">J2ME</span>
            </span>
            <span>• Preservación de videojuegos móviles Java ME</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTechModalOpen(true)}
              className="hover:text-amber-400 underline transition-colors"
            >
              Cómo funciona (CheerpJ WASM + FreeJ2ME)
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="hover:text-amber-400 underline transition-colors"
            >
              Cargar archivo .JAR
            </button>
          </div>
        </div>
      </footer>

      {/* Controls Remapper Modal */}
      <ControlsModal
        isOpen={isControlsModalOpen}
        onClose={() => setIsControlsModalOpen(false)}
        game={activeGame}
        onControlsUpdated={() => {}}
      />

      {/* Upload Custom JAR Modal */}
      <CustomJarModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onGameLoaded={handleCustomGameLoaded}
      />

      {/* Technical Explanation Modal */}
      <TechExplanationModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
      />
    </div>
  );
}
