import { GameMetadata } from '../types/game';
import { getCustomGames } from './storage';

export const DEFAULT_BUILTIN_GAMES: GameMetadata[] = [
  {
    id: 'snakewar',
    name: 'Snake War',
    year: 2009,
    genre: 'Arcade',
    developer: 'Rishabh Tripathi',
    resolution: '240x320',
    jar: '/games/snakewar/game.jar',
    jad: '/games/snakewar/game.jad',
    cover: '/games/snakewar/cover.svg',
    description: 'La evolución del legendario clásico de Nokia. Cuenta con múltiples arenas, niveles desafiantes, serpientes rivales en combate por manzanas y power-ups tácticos.',
    size: '513 KB',
    phonePreset: 'Nokia',
    compatibility: 'Excelente (MIDP 2.0 / CLDC 1.1)',
    features: ['Múltiples Arenas', 'Modo Desafío', 'Puntuaciones Altas', 'Animación Fluida'],
    defaultControls: {
      'Arriba': 'Flecha Arriba / W (Tecla 2)',
      'Abajo': 'Flecha Abajo / S (Tecla 8)',
      'Izquierda': 'Flecha Izquierda / A (Tecla 4)',
      'Derecha': 'Flecha Derecha / D (Tecla 6)',
      'Aceptar / Fuego': 'Enter / Espacio (Tecla 5)',
      'Softkey Izq': 'F1 / Q',
      'Softkey Der': 'F2 / E',
    },
  },
  {
    id: 'warehouse',
    name: 'Warehouse (Sokoban)',
    year: 2007,
    genre: 'Puzle',
    developer: 'Martin Cameron',
    resolution: '240x320',
    jar: '/games/warehouse/game.jar',
    cover: '/games/warehouse/cover.svg',
    description: 'El aclamado rompecabezas Sokoban transportado a Java Mobile. Empuja las cajas de madera hacia las marcas verdes en el almacén sin quedar atrapado en las esquinas.',
    size: '66 KB',
    phonePreset: 'Nokia',
    compatibility: 'Excelente (MIDP 2.0 / Nokia UI)',
    features: ['Deshacer Movimiento', '60+ Niveles', 'Bajo Consumo de Memoria', 'Diseño Minimalista'],
    defaultControls: {
      'Arriba': 'Flecha Arriba / W',
      'Abajo': 'Flecha Abajo / S',
      'Izquierda': 'Flecha Izquierda / A',
      'Derecha': 'Flecha Derecha / D',
      'Empujar / Seleccionar': 'Enter (Tecla 5)',
      'Menú / Opciones': 'F1 (Softkey Izq)',
    },
  },
  {
    id: 'connect4',
    name: 'Connect 4 Mobile',
    year: 2006,
    genre: 'Estrategia',
    developer: 'Zb3 / J2ME Labs',
    resolution: '240x320',
    jar: '/games/connect4/game.jar',
    cover: '/games/connect4/cover.svg',
    description: 'El clásico juego de mesa Cuatro en Línea adaptado para teléfonos Nokia Series 40 y 60. Juega contra la IA con fichas rojas y amarillas en pantalla completa.',
    size: '29 KB',
    phonePreset: 'Nokia',
    compatibility: 'Excelente (MIDP 2.0 / LCDUI Canvas)',
    features: ['Inteligencia Artificial', 'Partida Rápida', 'Colores Contrastados', 'Pantalla 240x320'],
    defaultControls: {
      'Mover Izquierda': 'Flecha Izquierda / A (Tecla 4)',
      'Mover Derecha': 'Flecha Derecha / D (Tecla 6)',
      'Soltar Ficha': 'Enter / Espacio (Tecla 5)',
      'Pausa': 'F1 (Softkey Izq)',
    },
  },
  {
    id: 'kakuro',
    name: 'Kakuro Logic Crosswords',
    year: 2008,
    genre: 'Lógica',
    developer: 'Mobile Logic Studio',
    resolution: '240x320',
    jar: '/games/kakuro/game.jar',
    cover: '/games/kakuro/cover.svg',
    description: 'El famoso pasatiempo numérico japonés que conquistó los teléfonos de la era dorada de Java. Rellena las cuadrículas sumando los números indicados en cada pista diagonal.',
    size: '79 KB',
    phonePreset: 'Nokia',
    compatibility: 'Excelente (MIDP 2.0)',
    features: ['Generador de Puzles', 'Entrada Teclado 1-9', 'Comprobación de Errores', 'RMS Save State'],
    defaultControls: {
      'Navegar Cuadrícula': 'Flechas de dirección',
      'Ingresar Números': 'Teclas 1 al 9',
      'Borrar': 'Retroceso / Tecla 0',
      'Confirmar': 'Enter (Tecla 5)',
    },
  },
  {
    id: 'realfootball',
    name: 'Real Football 2012',
    year: 2011,
    genre: 'Deportes',
    developer: 'Gameloft Mobile',
    resolution: '240x320',
    jar: '/games/realfootball/game.jar',
    cover: '/games/realfootball/cover.svg',
    description: 'Una de las joyas técnicas cumbre de la era Java ME. Gráficos detallados, torneos internacionales, comentarios en pantalla y jugabilidad arcade clásica de fútbol.',
    size: '377 KB',
    phonePreset: 'SonyEricsson',
    compatibility: 'Alta (MIDP 2.0 / Gameloft Engine)',
    features: ['Copa Internacional', 'Pase y Disparo Rápido', 'Tiros Libres y Penales', 'Física de Balón'],
    defaultControls: {
      'Mover Jugador': 'Flechas o WASD',
      'Pase Corto': 'Tecla 5 o J',
      'Disparo': 'Tecla 0 o K',
      'Entrada / Barrida': 'Tecla 7 o U',
      'Pausa / Tácticas': 'F1 (Softkey Izq)',
    },
  },
];

let cachedCatalog: GameMetadata[] | null = null;

export async function fetchGameCatalog(): Promise<GameMetadata[]> {
  try {
    const res = await fetch('/games/games.json');
    if (res.ok) {
      const data: GameMetadata[] = await res.json();
      const custom = getCustomGames();
      cachedCatalog = [...data, ...custom];
      return cachedCatalog;
    }
  } catch (err) {
    console.warn('Could not load /games/games.json, using built-in catalog', err);
  }
  const custom = getCustomGames();
  cachedCatalog = [...DEFAULT_BUILTIN_GAMES, ...custom];
  return cachedCatalog;
}

export function getCachedGame(id: string): GameMetadata | undefined {
  if (cachedCatalog) {
    return cachedCatalog.find((g) => g.id === id);
  }
  return DEFAULT_BUILTIN_GAMES.find((g) => g.id === id);
}

// In-memory holder for user-uploaded custom JAR array buffers
declare global {
  interface Window {
    __ACTIVE_CUSTOM_JAR_BUFFER?: ArrayBuffer;
  }
}

export async function parseUploadedJar(file: File): Promise<{ metadata: GameMetadata; buffer: ArrayBuffer }> {
  const buffer = await file.arrayBuffer();
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  
  // Try to inspect zip strings for MIDlet manifest
  const bytes = new Uint8Array(buffer);
  let manifestText = '';
  try {
    const textChunk = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, Math.min(bytes.length, 30000)));
    const manifestMatch = textChunk.match(/MIDlet-Name:([^\r\n]+)/i);
    if (manifestMatch) {
      manifestText = textChunk;
    }
  } catch {
    // ignore
  }

  const getAttr = (key: string, fallback: string): string => {
    const regex = new RegExp(`${key}:\\s*([^\\r\\n]+)`, 'i');
    const match = manifestText.match(regex);
    return match ? match[1].trim() : fallback;
  };

  const name = getAttr('MIDlet-Name', fileName.replace(/[-_]/g, ' '));
  const vendor = getAttr('MIDlet-Vendor', 'Desarrollador J2ME');
  const version = getAttr('MIDlet-Version', '1.0');

  const id = 'custom-' + Date.now();
  const sizeKb = Math.round(file.size / 1024);

  const customMetadata: GameMetadata = {
    id,
    name,
    year: 2006,
    genre: 'Personalizado',
    developer: `${vendor} (v${version})`,
    resolution: '240x320',
    jar: file.name,
    cover: createDefaultCoverSvg(name),
    description: `Juego Java ME cargado por el usuario: ${file.name} (${sizeKb} KB). Archivo procesado localmente en el navegador.`,
    size: `${sizeKb} KB`,
    phonePreset: 'Nokia',
    compatibility: 'Estándar MIDP 2.0 / CLDC 1.1',
    features: ['Carga Local', 'Sin Instalador', 'Sandboxed WebAssembly'],
    defaultControls: {
      'Navegación': 'Flechas o WASD',
      'Acción / Aceptar': 'Enter / Espacio (Tecla 5)',
      'Opciones / Menú': 'F1 / Q',
      'Atrás': 'F2 / E',
    },
    isCustom: true,
  };

  // Register buffer in window for emulator runner
  window.__ACTIVE_CUSTOM_JAR_BUFFER = buffer;

  return { metadata: customMetadata, buffer };
}

function createDefaultCoverSvg(title: string): string {
  const safeTitle = (title || 'J2ME GAME').substring(0, 18).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
    <rect width="400" height="500" fill="#0f172a"/>
    <rect x="20" y="20" width="360" height="460" rx="16" fill="none" stroke="#6366f1" stroke-width="2" stroke-opacity="0.4"/>
    <rect x="40" y="40" width="130" height="26" rx="6" fill="#312e81"/>
    <text x="105" y="58" fill="#a5b4fc" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">CUSTOM JAR</text>
    <text x="200" y="115" fill="#f8fafc" font-family="sans-serif" font-size="26" font-weight="900" text-anchor="middle">${safeTitle}</text>
    <g transform="translate(100, 170)">
      <rect width="200" height="200" rx="16" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
      <circle cx="100" cy="100" r="50" fill="#4f46e5" fill-opacity="0.2"/>
      <path d="M85 70 L130 100 L85 130 Z" fill="#6366f1"/>
    </g>
    <text x="200" y="440" fill="#818cf8" font-family="monospace" font-size="13" text-anchor="middle">JAVA ME ARCHIVE (.JAR)</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
