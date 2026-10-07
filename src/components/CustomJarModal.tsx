import React, { useState, useRef } from 'react';
import { X, Upload, FileArchive, CheckCircle2, AlertCircle, Play, Sparkles } from 'lucide-react';
import { parseUploadedJar } from '../services/gamesCatalog';
import { GameMetadata } from '../types/game';
import { saveCustomGame } from '../services/storage';

interface CustomJarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameLoaded: (game: GameMetadata) => void;
}

export const CustomJarModal: React.FC<CustomJarModalProps> = ({
  isOpen,
  onClose,
  onGameLoaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedGame, setParsedGame] = useState<GameMetadata | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.jar')) {
      setErrorMsg('Por favor selecciona un archivo con extensión .jar válido de Java ME.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { metadata } = await parseUploadedJar(file);
      setParsedGame(metadata);
      saveCustomGame(metadata);
    } catch (err: any) {
      console.error('Error parsing jar', err);
      setErrorMsg('No se pudo leer el archivo .jar. Asegúrate de que sea un MIDlet válido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleStartPlay = () => {
    if (parsedGame) {
      onGameLoaded(parsedGame);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Cargar Juego Java ME (.JAR)
              </h3>
              <p className="text-xs text-slate-400">
                Ejecución 100% segura y privada en el sandbox de tu navegador
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {!parsedGame ? (
            <>
              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/10 scale-[0.99]'
                    : 'border-slate-700 hover:border-amber-500/50 bg-slate-950/60 hover:bg-slate-950'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".jar"
                  onChange={(e) => e.target.files?.[0] && handleProcessFile(e.target.files[0])}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-md">
                  <FileArchive className="w-7 h-7" />
                </div>

                <h4 className="mt-4 text-sm font-bold text-slate-100">
                  Arrastra tu archivo <span className="text-amber-400">.jar</span> aquí
                </h4>
                <p className="mt-1 text-xs text-slate-400 max-w-xs">
                  o haz clic para buscar en tu equipo (ej. juegos clásicos de Nokia, Sony Ericsson o Motorola)
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Compatible con MIDP 1.0, 2.0 y Nokia UI</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </>
          ) : (
            /* Parsed Success Preview */
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30 flex items-center gap-4">
                <img
                  src={parsedGame.cover}
                  alt={parsedGame.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>JAR preparado exitosamente</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100 truncate mt-0.5">
                    {parsedGame.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {parsedGame.developer} • {parsedGame.size}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Este juego se cargará directamente en el emulador WebAssembly. Podrás configurar los controles de teclado en cualquier momento.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setParsedGame(null)}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Elegir otro archivo
                </button>
                <button
                  onClick={handleStartPlay}
                  className="flex-2 py-2.5 px-6 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-slate-950" /> JUGAR AHORA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
