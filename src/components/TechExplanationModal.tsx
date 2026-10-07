import React from 'react';
import { X, Cpu, Layers, ShieldCheck, CheckCircle2, AlertTriangle, Monitor, Sparkles } from 'lucide-react';

interface TechExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechExplanationModal: React.FC<TechExplanationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                Arquitectura Técnica de Emulación
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono-retro">
                  WebAssembly
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Cómo se ejecutan los juegos Java ME (.jar) directamente en el navegador
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* Architecture diagram cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider font-mono-retro">
                1. CheerpJ 3.0 WASM
              </h4>
              <p className="text-xs text-slate-400">
                JVM OpenJDK compilada a WebAssembly. Interpreta y compila Just-In-Time (JIT) bytecode Java dentro del navegador.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider font-mono-retro">
                2. FreeJ2ME Core
              </h4>
              <p className="text-xs text-slate-400">
                Motor emulador de MIDP 1.0/2.0 y CLDC 1.1. Mapea la API gráfica LCDUI y Nokia UI a un Canvas 2D/WebGL HTML5.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Monitor className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider font-mono-retro">
                3. EmulatorAdapter
              </h4>
              <p className="text-xs text-slate-400">
                Capa desacoplada React que gestiona controles de teclado, persistencia localStorage, audio y escalado sin acoplamiento.
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ¿Por qué no requiere instalar Java ni extensiones?
            </h4>
            <p className="text-xs text-slate-300">
              Antiguamente, ejecutar Java en la web requería el plugin NPAPI de Oracle (Java Applet), el cual fue descontinuado por motivos de seguridad en todos los navegadores modernos. 
              Nuestra solución compila el runtime completo de Java a <strong>WebAssembly (WASM)</strong>, ejecutándose de forma aislada en el sandbox estándar del navegador (Chrome, Edge, Firefox, Safari).
            </p>
          </div>

          {/* Compatibility and Specs */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Compatibilidad Soportada
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-emerald-400 block">• Perfiles MIDP / CLDC:</span>
                <span className="text-slate-400">MIDP 1.0, MIDP 2.0, CLDC 1.0 y CLDC 1.1 completos.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-emerald-400 block">• Gráficos y Pantalla:</span>
                <span className="text-slate-400">LCDUI Canvas, Nokia UI Extensions, WebGL 2D/3D.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-emerald-400 block">• Sonido y Música:</span>
                <span className="text-slate-400">Sintetizador MIDI vía WebAssembly FluidSynth + Web Audio API.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-emerald-400 block">• Guardado de partidas:</span>
                <span className="text-slate-400">Record Management System (RMS) persistido en navegador.</span>
              </div>
            </div>
          </div>

          {/* Boundaries & Limitations */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs text-amber-200">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Limitaciones conocidas de emulación
            </h4>
            <ul className="list-disc list-inside space-y-1 text-amber-200/90">
              <li><strong>Funciones de red obsoletas:</strong> Juegos que intenten conectar a servidores de operadoras móviles cerrados en los años 2000 darán timeout de red.</li>
              <li><strong>Hardware móvil específico:</strong> Sensores propietarios de infrarrojos, cámara física o Bluetooth de teléfonos originales quedan omitidos de forma segura.</li>
              <li><strong>Juegos 3D avanzados M3G:</strong> La gran mayoría de juegos 2D y 3D funcionan fluidamente a 60 FPS; ciertos títulos con librerías nativas Symbian propietarias pueden tener variaciones gráficas.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
