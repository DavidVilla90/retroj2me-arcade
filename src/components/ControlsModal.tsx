import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Save, AlertTriangle, Check, Keyboard, Sliders, Smartphone } from 'lucide-react';
import { KeyMapping, CONTROL_DEFINITIONS, PRESETS, DEFAULT_KEY_MAPPING } from '../types/controls';
import { GameMetadata } from '../types/game';
import { getGameControls, saveGameControls, resetGameControls, saveGlobalControls, getGlobalControls, hasCustomGameControls } from '../services/storage';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  game?: GameMetadata | null;
  onControlsUpdated: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({
  isOpen,
  onClose,
  game,
  onControlsUpdated,
}) => {
  const [scope, setScope] = useState<'game' | 'global'>(game ? 'game' : 'global');
  const [mapping, setMapping] = useState<KeyMapping>(DEFAULT_KEY_MAPPING);
  const [activeBindingId, setActiveBindingId] = useState<keyof KeyMapping | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load current configuration when modal opens or scope/game changes
  useEffect(() => {
    if (!isOpen) return;
    if (scope === 'game' && game) {
      setMapping(getGameControls(game.id));
    } else {
      setMapping(getGlobalControls());
    }
    setActiveBindingId(null);
    setSaveSuccess(false);
  }, [isOpen, scope, game]);

  // Key listening effect when a binding slot is clicked ("Presiona una tecla...")
  useEffect(() => {
    if (!activeBindingId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Don't capture Escape if canceling
      if (e.code === 'Escape') {
        setActiveBindingId(null);
        return;
      }

      setMapping((prev) => ({
        ...prev,
        [activeBindingId]: e.code,
      }));
      setActiveBindingId(null);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [activeBindingId]);

  // Conflict Detection: check if any code is assigned to more than one action
  const conflicts = React.useMemo(() => {
    const codeCounts: Record<string, string[]> = {};
    for (const def of CONTROL_DEFINITIONS) {
      const code = mapping[def.id];
      if (code) {
        if (!codeCounts[code]) codeCounts[code] = [];
        codeCounts[code].push(def.label);
      }
    }
    const result: { code: string; labels: string[] }[] = [];
    for (const [code, labels] of Object.entries(codeCounts)) {
      if (labels.length > 1) {
        result.push({ code, labels });
      }
    }
    return result;
  }, [mapping]);

  const handleApplyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setMapping({ ...preset.mapping });
    }
  };

  const handleResetDefaults = () => {
    setMapping({ ...DEFAULT_KEY_MAPPING });
    if (scope === 'game' && game) {
      resetGameControls(game.id);
    }
  };

  const handleSave = () => {
    if (scope === 'game' && game) {
      saveGameControls(game.id, mapping);
    } else {
      saveGlobalControls(mapping);
    }
    setSaveSuccess(true);
    onControlsUpdated();
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  const formatKeyName = (code: string) => {
    if (!code) return 'Ninguna';
    return code
      .replace('Key', '')
      .replace('Digit', 'Num ')
      .replace('Arrow', 'Flecha ')
      .replace('Numpad', 'Pad ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                Configuración de Teclado
              </h3>
              <p className="text-xs text-slate-400">
                Mapea las teclas de tu PC a los controles del teléfono Java ME
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

        {/* Scope selector & Presets Bar */}
        <div className="p-4 bg-slate-950/30 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Scope: Global vs Game */}
          {game && (
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setScope('game')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  scope === 'game'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Solo para {game.name}
              </button>
              <button
                onClick={() => setScope('global')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  scope === 'global'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Configuración Global
              </button>
            </div>
          )}

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-mono-retro">Perfiles:</span>
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title={preset.description}
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Conflicts Alert Banner */}
        {conflicts.length > 0 && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Conflicto de teclas detectado:</p>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-amber-200/90 text-[11px]">
                {conflicts.map((c, i) => (
                  <li key={i}>
                    La tecla <span className="font-mono font-bold text-amber-400">[{formatKeyName(c.code)}]</span> está asignada a: {c.labels.join(' y ')}.
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Key Mapping Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CONTROL_DEFINITIONS.map((def) => {
              const isBinding = activeBindingId === def.id;
              const hasConflict = conflicts.some((c) => c.code === mapping[def.id]);

              return (
                <div
                  key={def.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isBinding
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20'
                      : hasConflict
                      ? 'bg-rose-500/5 border-rose-500/40 hover:bg-slate-850'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <span className="text-xs font-bold text-slate-200 block truncate">
                      {def.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate font-mono-retro">
                      {def.j2meEquivalent}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveBindingId(def.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono-retro font-bold transition-all min-w-[100px] text-center shadow-sm ${
                      isBinding
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : hasConflict
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {isBinding ? 'Presiona tecla...' : formatKeyName(mapping[def.id])}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-2 px-3 rounded-lg hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar predeterminados
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" /> ¡Guardado!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Guardar configuración
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
