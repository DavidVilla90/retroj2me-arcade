import React, { useState, useEffect } from 'react';
import { History, Play, Trash2, Clock, Smartphone, ChevronRight } from 'lucide-react';
import { GameMetadata } from '../types/game';
import { getGameHistory, clearGameHistory, HistoryEntry } from '../services/storage';

interface HistorialProps {
  games: GameMetadata[];
  onPlayGame: (game: GameMetadata) => void;
  onSelectGameDetail: (game: GameMetadata) => void;
}

export const Historial: React.FC<HistorialProps> = ({
  games,
  onPlayGame,
  onSelectGameDetail,
}) => {
  const [historyItems, setHistoryItems] = useState<HistoryEntry[]>([]);

  // Load history on mount or when games change
  useEffect(() => {
    setHistoryItems(getGameHistory());
  }, [games]);

  const handleClearHistory = () => {
    clearGameHistory();
    setHistoryItems([]);
  };

  // Match history entries with current game metadata (max 5)
  const populatedHistory = historyItems
    .map((item) => {
      const game = games.find((g) => g.id === item.gameId);
      return game ? { ...item, game } : null;
    })
    .filter((entry): entry is { gameId: string; playedAt: number; game: GameMetadata } => entry !== null)
    .slice(0, 5);

  const formatRelativeTime = (timestamp: number): string => {
    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
  };

  return (
    <section aria-labelledby="historial-heading" className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-lg space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 id="historial-heading" className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2 font-mono-retro uppercase tracking-wider">
              Historial de Partidas
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Últimos {populatedHistory.length} de 5
              </span>
            </h2>
          </div>
        </div>

        {populatedHistory.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-400 py-1 px-2 rounded-lg hover:bg-slate-800/80 transition-colors"
            title="Borrar historial guardado"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vaciar historial</span>
          </button>
        )}
      </div>

      {/* History Items list / cards */}
      {populatedHistory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {populatedHistory.map(({ game, playedAt }, index) => (
            <div
              key={`${game.id}-${playedAt}-${index}`}
              className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-950 transition-all hover:shadow-md hover:shadow-amber-500/5"
            >
              {/* Cover thumbnail */}
              <div 
                onClick={() => onSelectGameDetail(game)}
                className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0 cursor-pointer"
              >
                <img
                  src={game.cover}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
                <span className="absolute top-0.5 left-0.5 px-1 rounded text-[8px] font-mono-retro font-bold bg-slate-950/90 text-amber-400 border border-slate-800">
                  #{index + 1}
                </span>
              </div>

              {/* Game meta */}
              <div className="min-w-0 flex-1">
                <h4 
                  onClick={() => onSelectGameDetail(game)}
                  className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-400 cursor-pointer transition-colors"
                  title={game.name}
                >
                  {game.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-mono-retro">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-2.5 h-2.5" />
                    {formatRelativeTime(playedAt)}
                  </span>
                  <span>•</span>
                  <span className="text-slate-400">{game.resolution}</span>
                </div>
              </div>

              {/* Play quick button */}
              <button
                onClick={() => onPlayGame(game)}
                className="w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 flex items-center justify-center shrink-0 transition-all shadow-sm active:scale-90"
                title={`Reanudar ${game.name}`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty history prompt */
        <div className="py-4 px-4 text-center rounded-xl bg-slate-950/40 border border-slate-800/80">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Aún no tienes partidas registradas. ¡Selecciona cualquier juego abajo para comenzar a jugar!</span>
          </p>
        </div>
      )}
    </section>
  );
};
