export interface KeyMapping {
  up: string;
  down: string;
  left: string;
  right: string;
  ok: string;
  softLeft: string;
  softRight: string;
  actionA: string;
  actionB: string;
  star: string;
  hash: string;
  num1: string;
  num2: string;
  num3: string;
  num4: string;
  num5: string;
  num6: string;
  num7: string;
  num8: string;
  num9: string;
  num0: string;
}

export interface ControlDefinition {
  id: keyof KeyMapping;
  label: string;
  description: string;
  j2meEquivalent: string;
  category: 'dpad' | 'softkeys' | 'actions' | 'numpad';
}

export const CONTROL_DEFINITIONS: ControlDefinition[] = [
  { id: 'up', label: 'Arriba', description: 'Dirección arriba o navegación', j2meEquivalent: 'Arriba / Tecla 2', category: 'dpad' },
  { id: 'down', label: 'Abajo', description: 'Dirección abajo o agacharse', j2meEquivalent: 'Abajo / Tecla 8', category: 'dpad' },
  { id: 'left', label: 'Izquierda', description: 'Dirección izquierda', j2meEquivalent: 'Izquierda / Tecla 4', category: 'dpad' },
  { id: 'right', label: 'Derecha', description: 'Dirección derecha', j2meEquivalent: 'Derecha / Tecla 6', category: 'dpad' },
  { id: 'ok', label: 'Aceptar / Centro', description: 'Botón de acción central o selección', j2meEquivalent: 'Enter / Tecla 5', category: 'actions' },
  { id: 'softLeft', label: 'Softkey Izquierda', description: 'Menú principal / Opción izquierda', j2meEquivalent: 'Soft 1 (F1 / Q)', category: 'softkeys' },
  { id: 'softRight', label: 'Softkey Derecha', description: 'Atrás / Salir / Opción derecha', j2meEquivalent: 'Soft 2 (F2 / E)', category: 'softkeys' },
  { id: 'actionA', label: 'Botón A (Fuego/Salto)', description: 'Acción primaria en juegos', j2meEquivalent: 'Tecla 5 o J', category: 'actions' },
  { id: 'actionB', label: 'Botón B (Secundario)', description: 'Acción secundaria o disparo especial', j2meEquivalent: 'Tecla 0 o K', category: 'actions' },
  { id: 'star', label: 'Tecla Asterisco (*)', description: 'Modo especial / Pausa / Menú', j2meEquivalent: '*', category: 'numpad' },
  { id: 'hash', label: 'Tecla Numeral (#)', description: 'Cambio de arma / Bloqueo', j2meEquivalent: '#', category: 'numpad' },
  { id: 'num1', label: 'Número 1', description: 'Diagonal Arriba-Izq o selección', j2meEquivalent: '1', category: 'numpad' },
  { id: 'num2', label: 'Número 2', description: 'Arriba alternativo', j2meEquivalent: '2 (ABC)', category: 'numpad' },
  { id: 'num3', label: 'Número 3', description: 'Diagonal Arriba-Der', j2meEquivalent: '3 (DEF)', category: 'numpad' },
  { id: 'num4', label: 'Número 4', description: 'Izquierda alternativo', j2meEquivalent: '4 (GHI)', category: 'numpad' },
  { id: 'num5', label: 'Número 5', description: 'Acción / Fuego principal', j2meEquivalent: '5 (JKL)', category: 'numpad' },
  { id: 'num6', label: 'Número 6', description: 'Derecha alternativo', j2meEquivalent: '6 (MNO)', category: 'numpad' },
  { id: 'num7', label: 'Número 7', description: 'Diagonal Abajo-Izq', j2meEquivalent: '7 (PQRS)', category: 'numpad' },
  { id: 'num8', label: 'Número 8', description: 'Abajo alternativo', j2meEquivalent: '8 (TUV)', category: 'numpad' },
  { id: 'num9', label: 'Número 9', description: 'Diagonal Abajo-Der', j2meEquivalent: '9 (WXYZ)', category: 'numpad' },
  { id: 'num0', label: 'Número 0', description: 'Espacio / Disparo alternativo', j2meEquivalent: '0 (+)', category: 'numpad' },
];

export const DEFAULT_KEY_MAPPING: KeyMapping = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  ok: 'Enter',
  softLeft: 'F1',
  softRight: 'F2',
  actionA: 'KeyJ',
  actionB: 'KeyK',
  star: 'KeyE',
  hash: 'KeyR',
  num1: 'Digit1',
  num2: 'Digit2',
  num3: 'Digit3',
  num4: 'Digit4',
  num5: 'Digit5',
  num6: 'Digit6',
  num7: 'Digit7',
  num8: 'Digit8',
  num9: 'Digit9',
  num0: 'Digit0',
};

export const PRESETS: Record<string, { name: string; description: string; mapping: KeyMapping }> = {
  standard: {
    name: 'Estándar (Flechas + Enter)',
    description: 'Navegación clásica con flechas, Enter para confirmar y F1/F2 para softkeys.',
    mapping: { ...DEFAULT_KEY_MAPPING },
  },
  wasd: {
    name: 'Gamer (WASD + J/K)',
    description: 'Movimiento con W/A/S/D, acción con J y K, softkeys en Q y E.',
    mapping: {
      ...DEFAULT_KEY_MAPPING,
      up: 'KeyW',
      down: 'KeyS',
      left: 'KeyA',
      right: 'KeyD',
      ok: 'Space',
      softLeft: 'KeyQ',
      softRight: 'KeyE',
      actionA: 'KeyJ',
      actionB: 'KeyK',
    },
  },
  numpad: {
    name: 'Teclado Numérico (Numpad 2/4/6/8)',
    description: 'Imita con precisión los teléfonos móviles físicos usando el bloque numérico del teclado.',
    mapping: {
      ...DEFAULT_KEY_MAPPING,
      up: 'Numpad8',
      down: 'Numpad2',
      left: 'Numpad4',
      right: 'Numpad6',
      ok: 'Numpad5',
      actionA: 'Numpad0',
      actionB: 'NumpadDecimal',
      star: 'NumpadMultiply',
      hash: 'NumpadDivide',
    },
  },
};
