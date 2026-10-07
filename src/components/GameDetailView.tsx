import React from 'react';
import { Play, ArrowLeft, Settings, Smartphone, Calendar, User, Cpu, FileArchive, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { GameMetadata } from '../types/game';
import { getGameControls } from '../services/storage';

interface GameDetailViewProps {
  game: GameMetadata;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onPlay: (game: GameMetadata) => void;
  onConfigureControls: (game: GameMetadata) => void;
  onBackToLibrary: () => void;
}

export const GameDetailView: React.FC<GameDetailViewProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
  onConfigureControls,
  onBackToLibrary,
}) => {
  const currentControls = getGameControls(game.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={onBackToLibrary}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a la Biblioteca
      </button>

      {/* Main Hero Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cover Art & Quick Actions */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative aspect-[4/3] w-full max-w-md rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shadow-2xl">
            <img
              src={game.cover}
              alt={game.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-mono-retro font-bold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
              {game.resolution}
            </div>
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-950/80 text-slate-400 hover:text-rose-400 border border-slate-800'
              }`}
              title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-md mt-6 space-y-3">
            <button
              onClick={() => onPlay(game)}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-slate-950" /> JUGAR EN EL NAVEGADOR
            </button>

            <button
              onClick={() => onConfigureControls(game)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Settings className="w-4 h-4 text-amber-400" /> Configurar Controles de Teclado
            </button>
          </div>
        </div>

        {/* Right: Detailed Metadata & Description */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {game.genre}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono-retro bg-slate-800 text-slate-300">
                Año {game.year}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {game.compatibility}
              </span>
            </div>

            <h1 className="font-retro-heading text-3xl sm:text-4xl font-black text-white tracking-wide">
              {game.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Desarrollado por <span className="text-slate-200 font-semibold">{game.developer}</span>
            </p>

            <div className="mt-5 text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              {game.description}
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono-retro">RESOLUCIÓN</span>
                <span className="text-xs font-bold text-slate-100 mt-0.5 block flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" /> {game.resolution}
                </span>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono-retro">TAMAÑO ARCHIVO</span>
                <span className="text-xs font-bold text-slate-100 mt-0.5 block flex items-center gap-1">
                  <FileArchive className="w-3.5 h-3.5 text-blue-400" /> {game.size}
                </span>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono-retro">PERFIL EMULADO</span>
                <span className="text-xs font-bold text-slate-100 mt-0.5 block flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" /> {game.phonePreset}
                </span>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono-retro">LANZAMIENTO</span>
                <span className="text-xs font-bold text-slate-100 mt-0.5 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" /> {game.year}
                </span>
              </div>
            </div>

            {/* Features tags */}
            {game.features && game.features.length > 0 && (
              <div className="mt-5 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono-retro">
                  Características destacadas
                </span>
                <div className="flex flex-wrap gap-2">
                  {game.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 text-slate-200 border border-slate-700/60"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Controls Preview Table */}
          <div className="mt-6 border-t border-slate-800 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono-retro">
                Controles Recomendados
              </span>
              <button
                onClick={() => onConfigureControls(game)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
              >
                Personalizar teclas
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {Object.entries(game.defaultControls).map(([action, keyName]) => (
                <div
                  key={action}
                  className="bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800 flex items-center justify-between"
                >
                  <span className="text-slate-400 truncate mr-2">{action}:</span>
                  <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-mono-retro text-[11px] font-bold">
                    {keyName}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
