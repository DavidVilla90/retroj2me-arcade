import React from 'react';
import { Play, Heart, Clock, Smartphone, Info } from 'lucide-react';
import { GameMetadata } from '../types/game';
import { getGameStats } from '../services/storage';

interface GameCardProps {
  game: GameMetadata;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onPlay: (game: GameMetadata) => void;
  onSelectDetail: (game: GameMetadata) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
  onSelectDetail,
}) => {
  const stats = getGameStats(game.id);

  return (
    <div className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-3 flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
      {/* Cover Artwork Container */}
      <div 
        onClick={() => onSelectDetail(game)}
        className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 cursor-pointer"
      >
        <img
          src={game.cover}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Scanline overlay subtle effect */}
        <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono-retro font-bold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700/60">
            {game.year}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30">
            {game.genre}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-slate-950/70 text-slate-400 hover:text-rose-400 border border-slate-800'
          }`}
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Bottom Resolution pill */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono-retro bg-slate-950/85 text-slate-300 border border-slate-800 backdrop-blur-sm">
          <Smartphone className="w-2.5 h-2.5 text-slate-400" />
          <span>{game.resolution}</span>
        </div>

        {/* Quick Hover Play overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 bg-slate-900/90 px-3 py-1 rounded-full border border-amber-500/40">
            <Play className="w-3 h-3 fill-amber-400" /> Jugar ahora
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onSelectDetail(game)}
            className="font-bold text-slate-100 text-base leading-tight group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
          >
            {game.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
            {game.developer}
          </p>
        </div>

        {/* Play stats & file size */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono-retro">
          <span>{game.size}</span>
          {stats.playCount > 0 ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <Clock className="w-3 h-3" /> {stats.playCount} {stats.playCount === 1 ? 'partida' : 'partidas'}
            </span>
          ) : (
            <span className="text-slate-400">Listo para jugar</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          <button
            onClick={() => onPlay(game)}
            className="col-span-4 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" /> JUGAR
          </button>
          <button
            onClick={() => onSelectDetail(game)}
            className="col-span-1 flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Ver detalles y controles"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
