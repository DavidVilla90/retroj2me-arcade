import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, Heart, Clock, Upload, ArrowUpDown, ChevronRight, Play } from 'lucide-react';
import { GameMetadata } from '../types/game';
import { GameCard } from './GameCard';
import { Historial } from './Historial';
import { getFavoriteIds, getRecentlyPlayedIds, toggleFavoriteId } from '../services/storage';

interface LibraryViewProps {
  games: GameMetadata[];
  onPlayGame: (game: GameMetadata) => void;
  onSelectGameDetail: (game: GameMetadata) => void;
  onOpenUploadModal: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  games,
  onPlayGame,
  onSelectGameDetail,
  onOpenUploadModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'year' | 'size'>('featured');
  const [favorites, setFavorites] = useState<string[]>(() => getFavoriteIds());

  const recentIds = useMemo(() => getRecentlyPlayedIds(), []);

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteId(id);
    setFavorites(getFavoriteIds());
  };

  // Distinct genres from games
  const genres = useMemo(() => {
    const set = new Set<string>();
    games.forEach((g) => set.add(g.genre));
    return ['all', ...Array.from(set)];
  }, [games]);

  // Favorite games list
  const favoriteGames = useMemo(() => {
    return favorites
      .map((id) => games.find((g) => g.id === id))
      .filter((g): g is GameMetadata => !!g);
  }, [favorites, games]);

  // Filtered & sorted games
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        const matchesSearch =
          game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.description.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (selectedGenre === 'favorites') {
          return favorites.includes(game.id);
        }
        if (selectedGenre !== 'all' && game.genre !== selectedGenre) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'year') return b.year - a.year;
        if (sortBy === 'size') return parseFloat(b.size) - parseFloat(a.size);
        return 0; // featured default
      });
  }, [games, searchQuery, selectedGenre, sortBy, favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Emulación WebAssembly Pura • Sin Java • Sin Plugins</span>
          </div>

          <h1 className="font-retro-heading text-3xl sm:text-5xl font-black text-white tracking-wide leading-tight">
            BIBLIOTECA RETRO <span className="text-amber-500">JAVA ME</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Revive la época dorada de los videojuegos móviles de Nokia, Sony Ericsson y Motorola. 
            Ejecuta directamente cualquier archivo <code className="text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono-retro">.jar</code> en tu navegador moderno sin necesidad de instalar Java, emuladores externos ni extensiones.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlayGame(games[0])}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Jugar Destacado ({games[0]?.name})
            </button>
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
            >
              <Upload className="w-4 h-4 text-amber-400" /> Cargar tu propio .JAR
            </button>
          </div>
        </div>
      </div>

      {/* HISTORIAL: Últimos 5 juegos jugados (guardado en localStorage) */}
      <Historial
        games={games}
        onPlayGame={onPlayGame}
        onSelectGameDetail={onSelectGameDetail}
      />

      {/* Search & Filters Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, desarrollador, descripción..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Ordenar:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="featured">Destacados</option>
              <option value="name">Nombre (A - Z)</option>
              <option value="year">Año de lanzamiento</option>
              <option value="size">Tamaño (.JAR)</option>
            </select>
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Todos ({games.length})
          </button>

          {favoriteGames.length > 0 && (
            <button
              onClick={() => setSelectedGenre('favorites')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedGenre === 'favorites'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-900 text-rose-400 hover:text-rose-300 border border-slate-800'
              }`}
            >
              <Heart className="w-3 h-3 fill-rose-500" />
              Favoritos ({favoriteGames.length})
            </button>
          )}

          {genres.filter((g) => g !== 'all').map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Games Catalog Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isFavorite={favorites.includes(game.id)}
              onToggleFavorite={handleToggleFavorite}
              onPlay={onPlayGame}
              onSelectDetail={onSelectGameDetail}
            />
          ))}

          {/* Add custom JAR card slot */}
          <div
            onClick={onOpenUploadModal}
            className="group border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/10 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
              Cargar otro .JAR
            </h4>
            <p className="mt-1 text-xs text-slate-400 max-w-[180px]">
              Arrastra o selecciona cualquier juego Java ME de tu colección
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
          <p className="text-slate-400 text-sm">
            No se encontraron juegos que coincidan con "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('all');
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
          >
            Restablecer filtros de búsqueda
          </button>
        </div>
      )}
    </div>
  );
};
