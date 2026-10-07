import React from 'react';
import { Gamepad2, Upload, HelpCircle, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { GameMetadata } from '../types/game';

interface HeaderProps {
  currentView: 'library' | 'detail' | 'playing';
  activeGame: GameMetadata | null;
  onNavigateHome: () => void;
  onNavigateToGame: (game: GameMetadata) => void;
  onOpenUpload: () => void;
  onOpenTechInfo: () => void;
  volume: number;
  muted: boolean;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activeGame,
  onNavigateHome,
  onNavigateToGame,
  onOpenUpload,
  onOpenTechInfo,
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-retro-heading text-lg font-bold tracking-wider text-slate-100 group-hover:text-amber-400 transition-colors">
                RETRO<span className="text-amber-500">J2ME</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-retro font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                WASM ARCADE
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Emulador Java Mobile en el Navegador
            </p>
          </div>
        </div>

        {/* Center: Current game quick shortcut (if playing or viewed) */}
        {activeGame && currentView !== 'library' && (
          <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400">Juego activo:</span>
            <span className="text-xs font-semibold text-slate-200">{activeGame.name}</span>
            {currentView !== 'playing' && (
              <button
                onClick={() => onNavigateToGame(activeGame)}
                className="ml-2 text-xs text-amber-400 hover:text-amber-300 font-medium underline"
              >
                Volver a jugar
              </button>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Quick Control */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 gap-2">
            <button
              onClick={onToggleMute}
              title={muted ? 'Activar sonido' : 'Silenciar'}
              className="text-slate-400 hover:text-amber-400 transition-colors"
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              aria-label="Volumen del emulador"
              className="w-14 sm:w-20 h-1.5 accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Upload Custom JAR Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white transition-all shadow-sm"
            title="Cargar archivo .JAR propio"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Cargar .JAR</span>
          </button>

          {/* Architecture / Tech Info */}
          <button
            onClick={onOpenTechInfo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:text-amber-300 transition-all"
            title="Ver arquitectura técnica del emulador"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tecnología</span>
          </button>
        </div>
      </div>
    </header>
  );
};
