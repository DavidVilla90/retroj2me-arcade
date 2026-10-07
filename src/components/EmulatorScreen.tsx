import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, Pause, RotateCcw, Settings, Maximize, Minimize, Volume2, VolumeX, 
  ArrowLeft, Smartphone, Monitor, Eye, Sparkles, AlertCircle, RefreshCw, Layers
} from 'lucide-react';
import { GameMetadata, DisplayScaleMode, PhoneFrameStyle } from '../types/game';
import { IEmulatorAdapter, FreeJ2MEWebAdapter, EmulatorStatus } from '../services/emulatorAdapter';
import { VirtualKeypad } from './VirtualKeypad';
import { getGameControls, addPlayTime } from '../services/storage';

interface EmulatorScreenProps {
  game: GameMetadata;
  volume: number;
  muted: boolean;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onOpenControlsModal: () => void;
  onBackToLibrary: () => void;
}

export const EmulatorScreen: React.FC<EmulatorScreenProps> = ({
  game,
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
  onOpenControlsModal,
  onBackToLibrary,
}) => {
  const [scaleMode, setScaleMode] = useState<DisplayScaleMode>('fit');
  const [frameStyle, setFrameStyle] = useState<PhoneFrameStyle>('nokia-retro');
  const [showKeypad, setShowKeypad] = useState(false);
  const [scanlines, setScanlines] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [status, setStatus] = useState<EmulatorStatus>('loading_engine');
  const [statusMessage, setStatusMessage] = useState<string>('Iniciando emulador WebAssembly...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gameResolution, setGameResolution] = useState<{ width: number; height: number }>({ width: 240, height: 320 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const adapterRef = useRef<IEmulatorAdapter | null>(null);
  const screenContainerRef = useRef<HTMLDivElement>(null);
  const playTimerRef = useRef<number | null>(null);

  // Parse width & height from metadata if possible
  useEffect(() => {
    if (game.resolution && game.resolution.includes('x')) {
      const parts = game.resolution.split('x');
      const w = parseInt(parts[0], 10);
      const h = parseInt(parts[1], 10);
      if (!isNaN(w) && !isNaN(h)) {
        setGameResolution({ width: w, height: h });
      }
    }
  }, [game]);

  // Setup emulator adapter and iframe
  useEffect(() => {
    const adapter = new FreeJ2MEWebAdapter();
    adapterRef.current = adapter;

    if (iframeRef.current) {
      adapter.attach(iframeRef.current, {
        onCanvasReady: (w, h) => {
          setGameResolution({ width: w, height: h });
          setStatus('running');
          setErrorMessage(null);
        },
        onStatusChange: (newStatus, msg) => {
          setStatus(newStatus);
          if (msg) setStatusMessage(msg);
        },
        onError: (err) => {
          setErrorMessage(err);
          setStatus('error');
        },
      });

      adapter.loadGame(game);
      adapter.setVolume(muted ? 0 : volume);
    }

    // Play time recording interval (every minute)
    playTimerRef.current = window.setInterval(() => {
      addPlayTime(game.id, 1);
    }, 60000);

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      adapter.detach();
      adapterRef.current = null;
    };
  }, [game]);

  // Update volume in adapter whenever it changes
  useEffect(() => {
    if (adapterRef.current) {
      adapterRef.current.setVolume(muted ? 0 : volume);
    }
  }, [volume, muted]);

  // Physical Keyboard listener hooked to configured mappings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when user is in input/modal
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (isPaused) return;

      const mapping = getGameControls(game.id);

      // Map physical key press to J2ME keyCode
      let matchedCode: string | null = null;
      let symbol = '\x00';

      if (e.code === mapping.up) matchedCode = 'ArrowUp';
      else if (e.code === mapping.down) matchedCode = 'ArrowDown';
      else if (e.code === mapping.left) matchedCode = 'ArrowLeft';
      else if (e.code === mapping.right) matchedCode = 'ArrowRight';
      else if (e.code === mapping.ok) matchedCode = 'Enter';
      else if (e.code === mapping.softLeft) matchedCode = 'F1';
      else if (e.code === mapping.softRight) matchedCode = 'F2';
      else if (e.code === mapping.actionA) { matchedCode = 'Digit5'; symbol = '5'; }
      else if (e.code === mapping.actionB) { matchedCode = 'Digit0'; symbol = '0'; }
      else if (e.code === mapping.star) { matchedCode = 'NumpadMultiply'; symbol = '*'; }
      else if (e.code === mapping.hash) { matchedCode = 'NumpadDivide'; symbol = '#'; }
      else if (e.code === mapping.num1) { matchedCode = 'Digit1'; symbol = '1'; }
      else if (e.code === mapping.num2) { matchedCode = 'Digit2'; symbol = '2'; }
      else if (e.code === mapping.num3) { matchedCode = 'Digit3'; symbol = '3'; }
      else if (e.code === mapping.num4) { matchedCode = 'Digit4'; symbol = '4'; }
      else if (e.code === mapping.num5) { matchedCode = 'Digit5'; symbol = '5'; }
      else if (e.code === mapping.num6) { matchedCode = 'Digit6'; symbol = '6'; }
      else if (e.code === mapping.num7) { matchedCode = 'Digit7'; symbol = '7'; }
      else if (e.code === mapping.num8) { matchedCode = 'Digit8'; symbol = '8'; }
      else if (e.code === mapping.num9) { matchedCode = 'Digit9'; symbol = '9'; }
      else if (e.code === mapping.num0) { matchedCode = 'Digit0'; symbol = '0'; }

      // Shortcut: Escape key pauses the game
      if (e.code === 'Escape') {
        e.preventDefault();
        setIsPaused((p) => !p);
        return;
      }

      if (matchedCode && adapterRef.current) {
        e.preventDefault();
        adapterRef.current.sendKeyDown(matchedCode, symbol);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const mapping = getGameControls(game.id);
      let matchedCode: string | null = null;
      let symbol = '\x00';

      if (e.code === mapping.up) matchedCode = 'ArrowUp';
      else if (e.code === mapping.down) matchedCode = 'ArrowDown';
      else if (e.code === mapping.left) matchedCode = 'ArrowLeft';
      else if (e.code === mapping.right) matchedCode = 'ArrowRight';
      else if (e.code === mapping.ok) matchedCode = 'Enter';
      else if (e.code === mapping.softLeft) matchedCode = 'F1';
      else if (e.code === mapping.softRight) matchedCode = 'F2';
      else if (e.code === mapping.actionA) { matchedCode = 'Digit5'; symbol = '5'; }
      else if (e.code === mapping.actionB) { matchedCode = 'Digit0'; symbol = '0'; }
      else if (e.code === mapping.star) { matchedCode = 'NumpadMultiply'; symbol = '*'; }
      else if (e.code === mapping.hash) { matchedCode = 'NumpadDivide'; symbol = '#'; }
      else if (e.code === mapping.num1) { matchedCode = 'Digit1'; symbol = '1'; }
      else if (e.code === mapping.num2) { matchedCode = 'Digit2'; symbol = '2'; }
      else if (e.code === mapping.num3) { matchedCode = 'Digit3'; symbol = '3'; }
      else if (e.code === mapping.num4) { matchedCode = 'Digit4'; symbol = '4'; }
      else if (e.code === mapping.num5) { matchedCode = 'Digit5'; symbol = '5'; }
      else if (e.code === mapping.num6) { matchedCode = 'Digit6'; symbol = '6'; }
      else if (e.code === mapping.num7) { matchedCode = 'Digit7'; symbol = '7'; }
      else if (e.code === mapping.num8) { matchedCode = 'Digit8'; symbol = '8'; }
      else if (e.code === mapping.num9) { matchedCode = 'Digit9'; symbol = '9'; }
      else if (e.code === mapping.num0) { matchedCode = 'Digit0'; symbol = '0'; }

      if (matchedCode && adapterRef.current) {
        e.preventDefault();
        adapterRef.current.sendKeyUp(matchedCode, symbol);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [game, isPaused]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!screenContainerRef.current) return;
    if (!document.fullscreenElement) {
      screenContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Compute game display container styles based on resolution and scale mode
  const screenDimensions = useMemo(() => {
    const baseW = gameResolution.width || 240;
    const baseH = gameResolution.height || 320;

    switch (scaleMode) {
      case '1x':
        return { width: `${baseW}px`, height: `${baseH}px` };
      case '2x':
        return { width: `${baseW * 2}px`, height: `${baseH * 2}px` };
      case '3x':
        return { width: `${baseW * 3}px`, height: `${baseH * 3}px` };
      case '4x':
        return { width: `${baseW * 4}px`, height: `${baseH * 4}px` };
      case 'fit':
      case 'fullscreen':
      default:
        // Proportional aspect ratio fitting container without stretching!
        return {
          aspectRatio: `${baseW} / ${baseH}`,
          width: '100%',
          maxWidth: `${baseW * 2.2}px`,
          maxHeight: '75vh',
        };
    }
  }, [gameResolution, scaleMode]);

  const handleRestart = () => {
    setIsPaused(false);
    adapterRef.current?.restart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl backdrop-blur-md">
        {/* Left: Back & Game Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLibrary}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Volver a la Biblioteca"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              {game.name}
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-retro bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {gameResolution.width} × {gameResolution.height}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-mono-retro">
              Escala: {scaleMode.toUpperCase()} • {frameStyle === 'nokia-retro' ? 'Chasis Nokia' : 'Monitor Limpio'}
            </p>
          </div>
        </div>

        {/* Center: Frame Style & Scale Selectors */}
        <div className="flex items-center gap-2">
          {/* Frame Style Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFrameStyle('nokia-retro')}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                frameStyle === 'nokia-retro'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Carcasa estilo teléfono Nokia"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Teléfono</span>
            </button>
            <button
              onClick={() => setFrameStyle('clean-screen')}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                frameStyle === 'clean-screen'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Pantalla limpia estilo monitor de arcade"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Monitor</span>
            </button>
          </div>

          {/* Scale Selector */}
          <select
            value={scaleMode}
            onChange={(e) => setScaleMode(e.target.value as DisplayScaleMode)}
            aria-label="Escala de pantalla"
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="fit">Ajustar a ventana</option>
            <option value="1x">1x (Original)</option>
            <option value="2x">2x Escala</option>
            <option value="3x">3x Escala</option>
            <option value="4x">4x Escala</option>
          </select>

          {/* Scanlines Effect Toggle */}
          <button
            onClick={() => setScanlines(!scanlines)}
            className={`p-2 rounded-xl border transition-all ${
              scanlines
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={scanlines ? 'Filtro LCD/Scanlines activado' : 'Activar filtro LCD/Scanlines'}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Controls & Screen Actions */}
        <div className="flex items-center gap-2">
          {/* Pause / Resume button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2 rounded-xl transition-all ${
              isPaused
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title={isPaused ? 'Reanudar juego' : 'Pausar juego (Esc)'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-slate-950" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Restart */}
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
            title="Reiniciar partida"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Keyboard Remapper Modal */}
          <button
            onClick={onOpenControlsModal}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
            title="Configurar controles de teclado"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Toggle Virtual Keypad */}
          <button
            onClick={() => setShowKeypad(!showKeypad)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showKeypad
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Teclado virtual
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Emulator Viewport Area */}
      <div 
        ref={screenContainerRef}
        className={`relative flex flex-col items-center justify-center min-h-[500px] p-4 rounded-3xl transition-all ${
          isFullscreen 
            ? 'fixed inset-0 z-50 bg-black p-0 m-0 w-screen h-screen' 
            : 'bg-slate-950/70 border border-slate-800 shadow-2xl'
        }`}
      >
        {/* RETRO PHONE CHASSIS or CLEAN MONITOR */}
        <div className={`relative flex flex-col items-center transition-all ${
          frameStyle === 'nokia-retro' && !isFullscreen
            ? 'p-6 sm:p-8 bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900 rounded-[48px] border-4 border-slate-700/80 shadow-2xl shadow-black/80 max-w-lg w-full'
            : 'w-full flex items-center justify-center'
        }`}>
          {/* Retro Phone Earpiece & Nokia-style chrome logo */}
          {frameStyle === 'nokia-retro' && !isFullscreen && (
            <div className="w-full flex flex-col items-center mb-4 space-y-2">
              <div className="w-16 h-1.5 rounded-full bg-slate-950/80 border border-slate-700 shadow-inner" />
              <div className="flex items-center gap-2 text-[11px] font-mono-retro font-bold text-slate-400 tracking-widest">
                <span>NOKIA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-400 font-normal">N-SERIES</span>
              </div>
            </div>
          )}

          {/* THE SCREEN BEZEL & CANVAS CONTAINER */}
          <div 
            className="relative overflow-hidden bg-black rounded-2xl border-4 border-slate-950 shadow-inner flex items-center justify-center transition-all"
            style={screenDimensions}
          >
            {/* The Emulator Iframe Runner */}
            <iframe
              ref={iframeRef}
              title={game.name}
              className="w-full h-full border-0 select-none"
              sandbox="allow-scripts allow-same-origin"
            />

            {/* Scanlines layer */}
            {scanlines && (
              <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
            )}

            {/* Screen Glass Reflection Glare */}
            <div className="absolute inset-0 screen-glare pointer-events-none" />

            {/* Loading / Status Overlay */}
            {status !== 'running' && status !== 'paused' && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4">
                {status === 'error' ? (
                  <div className="space-y-3 max-w-xs">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-rose-300">
                      No se pudo iniciar este juego
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {errorMessage || 'Ocurrió un error al cargar las clases Java del MIDlet.'}
                    </p>
                    <button
                      onClick={handleRestart}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reintentar carga
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-10 h-10 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">
                        {statusMessage}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 font-mono-retro">
                        CheerpJ WebAssembly • Compilando bytecode J2ME
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PAUSE OVERLAY MENU */}
            {isPaused && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-150 z-20">
                <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-retro-heading text-xs font-bold tracking-widest">
                  PAUSADO
                </div>
                <h3 className="font-retro-heading text-2xl font-black text-white tracking-wider">
                  {game.name}
                </h3>

                <div className="w-full max-w-xs space-y-2 pt-2">
                  <button
                    onClick={() => setIsPaused(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" /> Continuar Partida
                  </button>
                  <button
                    onClick={handleRestart}
                    className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Juego
                  </button>
                  <button
                    onClick={() => {
                      setIsPaused(false);
                      onOpenControlsModal();
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-amber-400" /> Configuración de Teclas
                  </button>
                  <button
                    onClick={onBackToLibrary}
                    className="w-full py-2 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Salir a la Biblioteca
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Integrated Phone Keypad below screen in Nokia Chassis view */}
          {frameStyle === 'nokia-retro' && !isFullscreen && (
            <div className="w-full mt-5">
              <VirtualKeypad
                adapter={adapterRef.current}
                onKeyDownCode={(code, sym) => adapterRef.current?.sendKeyDown(code, sym)}
                onKeyUpCode={(code, sym) => adapterRef.current?.sendKeyUp(code, sym)}
                compact={false}
              />
            </div>
          )}
        </div>

        {/* Floating/Side Virtual Keypad in Clean Monitor mode when toggled */}
        {frameStyle === 'clean-screen' && showKeypad && !isFullscreen && (
          <div className="mt-6 w-full max-w-sm">
            <VirtualKeypad
              adapter={adapterRef.current}
              onKeyDownCode={(code, sym) => adapterRef.current?.sendKeyDown(code, sym)}
              onKeyUpCode={(code, sym) => adapterRef.current?.sendKeyUp(code, sym)}
            />
          </div>
        )}
      </div>

      {/* Keyboard Controls Reminder Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">Controles rápidos de PC:</span>
          <span>Flechas / WASD para moverte</span>
          <span>•</span>
          <span>Enter / Espacio para aceptar</span>
          <span>•</span>
          <span>F1 / F2 para softkeys</span>
          <span>•</span>
          <span>Esc para pausar</span>
        </div>
        <button
          onClick={onOpenControlsModal}
          className="text-amber-400 hover:text-amber-300 font-semibold underline"
        >
          Personalizar asignación de teclas
        </button>
      </div>
    </div>
  );
};
