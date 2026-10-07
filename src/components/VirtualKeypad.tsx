import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerDownLeft } from 'lucide-react';
import { IEmulatorAdapter } from '../services/emulatorAdapter';

interface VirtualKeypadProps {
  adapter: IEmulatorAdapter | null;
  onKeyDownCode: (code: string, symbol?: string) => void;
  onKeyUpCode: (code: string, symbol?: string) => void;
  compact?: boolean;
}

export const VirtualKeypad: React.FC<VirtualKeypadProps> = ({
  onKeyDownCode,
  onKeyUpCode,
  compact = false,
}) => {
  const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({});

  const handlePressStart = (code: string, symbol?: string) => {
    setActiveKeys((prev) => ({ ...prev, [code]: true }));
    onKeyDownCode(code, symbol);
  };

  const handlePressEnd = (code: string, symbol?: string) => {
    setActiveKeys((prev) => ({ ...prev, [code]: false }));
    onKeyUpCode(code, symbol);
  };

  const numpadKeys = [
    { num: '1', letters: '', code: 'Digit1', symbol: '1' },
    { num: '2', letters: 'ABC', code: 'Digit2', symbol: '2' },
    { num: '3', letters: 'DEF', code: 'Digit3', symbol: '3' },
    { num: '4', letters: 'GHI', code: 'Digit4', symbol: '4' },
    { num: '5', letters: 'JKL', code: 'Digit5', symbol: '5' },
    { num: '6', letters: 'MNO', code: 'Digit6', symbol: '6' },
    { num: '7', letters: 'PQRS', code: 'Digit7', symbol: '7' },
    { num: '8', letters: 'TUV', code: 'Digit8', symbol: '8' },
    { num: '9', letters: 'WXYZ', code: 'Digit9', symbol: '9' },
    { num: '*', letters: '', code: 'NumpadMultiply', symbol: '*' },
    { num: '0', letters: '+', code: 'Digit0', symbol: '0' },
    { num: '#', letters: '', code: 'NumpadDivide', symbol: '#' },
  ];

  return (
    <div className="w-full max-w-sm mx-auto select-none p-3 bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
      {/* Top Controls: Softkeys & D-Pad */}
      <div className="grid grid-cols-3 gap-2 items-center">
        {/* Left Softkey */}
        <div className="flex flex-col items-center">
          <button
            onPointerDown={() => handlePressStart('F1')}
            onPointerUp={() => handlePressEnd('F1')}
            onPointerLeave={() => activeKeys['F1'] && handlePressEnd('F1')}
            className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold transition-all shadow-md flex flex-col items-center justify-center ${
              activeKeys['F1']
                ? 'bg-amber-500 text-slate-950 scale-95 shadow-inner'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
          >
            <span>SOFT 1</span>
            <span className="text-[9px] opacity-70 font-mono-retro">F1 / Q</span>
          </button>
        </div>

        {/* Action Button OK / Select */}
        <div className="flex flex-col items-center">
          <button
            onPointerDown={() => handlePressStart('Enter', '\n')}
            onPointerUp={() => handlePressEnd('Enter', '\n')}
            onPointerLeave={() => activeKeys['Enter'] && handlePressEnd('Enter', '\n')}
            className={`w-14 h-14 rounded-2xl font-black text-sm transition-all shadow-lg flex flex-col items-center justify-center ${
              activeKeys['Enter']
                ? 'bg-amber-400 text-slate-950 scale-90'
                : 'bg-gradient-to-b from-amber-500 to-amber-600 text-slate-950 border border-amber-400'
            }`}
          >
            <span className="leading-none">OK</span>
            <span className="text-[9px] font-mono-retro opacity-80 mt-0.5">Enter</span>
          </button>
        </div>

        {/* Right Softkey */}
        <div className="flex flex-col items-center">
          <button
            onPointerDown={() => handlePressStart('F2')}
            onPointerUp={() => handlePressEnd('F2')}
            onPointerLeave={() => activeKeys['F2'] && handlePressEnd('F2')}
            className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold transition-all shadow-md flex flex-col items-center justify-center ${
              activeKeys['F2']
                ? 'bg-amber-500 text-slate-950 scale-95 shadow-inner'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
          >
            <span>SOFT 2</span>
            <span className="text-[9px] opacity-70 font-mono-retro">F2 / E</span>
          </button>
        </div>
      </div>

      {/* D-Pad Matrix */}
      <div className="flex justify-center">
        <div className="relative w-36 h-36 bg-slate-950 rounded-full border border-slate-800 p-2 shadow-inner flex items-center justify-center">
          {/* Up */}
          <button
            onPointerDown={() => handlePressStart('ArrowUp')}
            onPointerUp={() => handlePressEnd('ArrowUp')}
            onPointerLeave={() => activeKeys['ArrowUp'] && handlePressEnd('ArrowUp')}
            className={`absolute top-2 w-10 h-10 rounded-t-xl flex items-center justify-center transition-all ${
              activeKeys['ArrowUp']
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Arriba"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* Left */}
          <button
            onPointerDown={() => handlePressStart('ArrowLeft')}
            onPointerUp={() => handlePressEnd('ArrowLeft')}
            onPointerLeave={() => activeKeys['ArrowLeft'] && handlePressEnd('ArrowLeft')}
            className={`absolute left-2 w-10 h-10 rounded-l-xl flex items-center justify-center transition-all ${
              activeKeys['ArrowLeft']
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Izquierda"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Center / Action */}
          <button
            onPointerDown={() => handlePressStart('Digit5', '5')}
            onPointerUp={() => handlePressEnd('Digit5', '5')}
            onPointerLeave={() => activeKeys['Digit5'] && handlePressEnd('Digit5', '5')}
            className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all z-10 ${
              activeKeys['Digit5']
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-700 text-amber-400 border border-slate-600'
            }`}
            title="Centro (Tecla 5 / Fuego)"
          >
            5
          </button>

          {/* Right */}
          <button
            onPointerDown={() => handlePressStart('ArrowRight')}
            onPointerUp={() => handlePressEnd('ArrowRight')}
            onPointerLeave={() => activeKeys['ArrowRight'] && handlePressEnd('ArrowRight')}
            className={`absolute right-2 w-10 h-10 rounded-r-xl flex items-center justify-center transition-all ${
              activeKeys['ArrowRight']
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Derecha"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Down */}
          <button
            onPointerDown={() => handlePressStart('ArrowDown')}
            onPointerUp={() => handlePressEnd('ArrowDown')}
            onPointerLeave={() => activeKeys['ArrowDown'] && handlePressEnd('ArrowDown')}
            className={`absolute bottom-2 w-10 h-10 rounded-b-xl flex items-center justify-center transition-all ${
              activeKeys['ArrowDown']
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Abajo"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Numeric Matrix 3x4 */}
      {!compact && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
          {numpadKeys.map(({ num, letters, code, symbol }) => (
            <button
              key={num}
              onPointerDown={() => handlePressStart(code, symbol)}
              onPointerUp={() => handlePressEnd(code, symbol)}
              onPointerLeave={() => activeKeys[code] && handlePressEnd(code, symbol)}
              className={`h-11 rounded-xl flex flex-col items-center justify-center transition-all shadow-sm ${
                activeKeys[code]
                  ? 'bg-amber-500 text-slate-950 scale-95 shadow-inner'
                  : 'bg-slate-800/80 hover:bg-slate-750 text-slate-100 border border-slate-700/60'
              }`}
            >
              <span className="text-sm font-bold leading-tight font-mono-retro">{num}</span>
              {letters && (
                <span className="text-[8px] text-slate-400 font-semibold tracking-wider -mt-0.5">
                  {letters}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
