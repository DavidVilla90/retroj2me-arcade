import { GameMetadata } from '../types/game';

export type EmulatorStatus = 'idle' | 'loading_engine' | 'loading_jar' | 'running' | 'paused' | 'error';

export interface EmulatorEventHandlers {
  onCanvasReady?: (width: number, height: number) => void;
  onStatusChange?: (status: EmulatorStatus, message?: string) => void;
  onError?: (error: string) => void;
  onTitleChange?: (title: string) => void;
}

export interface IEmulatorAdapter {
  attach(iframe: HTMLIFrameElement, handlers: EmulatorEventHandlers): void;
  detach(): void;
  loadGame(game: GameMetadata): void;
  sendKeyDown(code: string, symbol?: string): void;
  sendKeyUp(code: string, symbol?: string): void;
  setVolume(volume: number): void;
  restart(): void;
  pause(): void;
  resume(): void;
  getOriginalResolution(): { width: number; height: number };
}

/**
 * FreeJ2ME WebAdapter
 * Integrates FreeJ2ME via CheerpJ 3.0 WebAssembly JVM inside an isolated sandboxed iframe.
 */
export class FreeJ2MEWebAdapter implements IEmulatorAdapter {
  private iframe: HTMLIFrameElement | null = null;
  private handlers: EmulatorEventHandlers = {};
  private currentWidth = 240;
  private currentHeight = 320;
  private messageListener: ((event: MessageEvent) => void) | null = null;
  private isPaused = false;

  attach(iframe: HTMLIFrameElement, handlers: EmulatorEventHandlers): void {
    this.iframe = iframe;
    this.handlers = handlers;

    this.messageListener = (event: MessageEvent) => {
      // Security check: only accept events from this iframe window
      if (!this.iframe || event.source !== this.iframe.contentWindow) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case 'EMULATOR_CANVAS_READY':
          this.currentWidth = data.width || 240;
          this.currentHeight = data.height || 320;
          this.handlers.onCanvasReady?.(this.currentWidth, this.currentHeight);
          this.handlers.onStatusChange?.('running', 'Juego ejecutándose');
          break;
        case 'EMULATOR_STATUS':
          if (data.status === 'running') {
            this.handlers.onStatusChange?.('running', 'Motor J2ME listo');
          } else if (data.status === 'cheerpj_init') {
            this.handlers.onStatusChange?.('loading_engine', 'Inicializando WebAssembly JVM...');
          }
          break;
        case 'EMULATOR_ERROR':
          this.handlers.onError?.(data.error || 'Error inesperado en MIDlet');
          this.handlers.onStatusChange?.('error', data.error);
          break;
        case 'TITLE':
          if (data.title) {
            this.handlers.onTitleChange?.(data.title);
          }
          break;
      }
    };

    window.addEventListener('message', this.messageListener);
  }

  detach(): void {
    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
      this.messageListener = null;
    }
    this.iframe = null;
    this.handlers = {};
  }

  loadGame(game: GameMetadata): void {
    if (!this.iframe) return;

    this.handlers.onStatusChange?.('loading_jar', `Cargando archivo JAR de ${game.name}...`);

    let runnerUrl = '/emulator/run.html?embed=1';

    if (game.isCustom) {
      runnerUrl += '&custom=1';
    } else if (game.id === 'connect4') {
      runnerUrl += '&app=Connect4';
    } else if (game.id === 'kakuro') {
      runnerUrl += '&app=k4kur0';
    } else if (game.jar) {
      // Pass the jar path directly
      runnerUrl += `&jar=${encodeURIComponent(game.jar)}`;
    }

    this.iframe.src = runnerUrl;
  }

  sendKeyDown(code: string, symbol?: string): void {
    if (!this.iframe || !this.iframe.contentWindow) return;
    this.iframe.contentWindow.postMessage(
      {
        type: 'KEY_DOWN',
        code,
        symbol: symbol || '',
      },
      '*'
    );
  }

  sendKeyUp(code: string, symbol?: string): void {
    if (!this.iframe || !this.iframe.contentWindow) return;
    this.iframe.contentWindow.postMessage(
      {
        type: 'KEY_UP',
        code,
        symbol: symbol || '',
      },
      '*'
    );
  }

  setVolume(volume: number): void {
    if (!this.iframe || !this.iframe.contentWindow) return;
    this.iframe.contentWindow.postMessage(
      {
        type: 'SET_VOLUME',
        volume: Math.max(0, Math.min(1, volume)),
      },
      '*'
    );
  }

  restart(): void {
    if (!this.iframe || !this.iframe.contentWindow) return;
    this.iframe.contentWindow.postMessage({ type: 'RELOAD' }, '*');
    this.handlers.onStatusChange?.('loading_engine', 'Reiniciando emulador...');
  }

  pause(): void {
    this.isPaused = true;
    this.handlers.onStatusChange?.('paused', 'En pausa');
  }

  resume(): void {
    this.isPaused = false;
    this.handlers.onStatusChange?.('running', 'Juego ejecutándose');
  }

  getOriginalResolution(): { width: number; height: number } {
    return { width: this.currentWidth, height: this.currentHeight };
  }
}
