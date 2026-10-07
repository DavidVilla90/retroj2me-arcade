import { KeyMapping, DEFAULT_KEY_MAPPING } from '../types/controls';
import { DisplayScaleMode, PhoneFrameStyle, GamePlayStats, GameMetadata } from '../types/game';

const KEYS = {
  FAVORITES: 'retroj2me_favorites',
  RECENT: 'retroj2me_recent',
  STATS: 'retroj2me_stats',
  GLOBAL_CONTROLS: 'retroj2me_controls_global',
  GAME_CONTROLS_PREFIX: 'retroj2me_controls_game_',
  VOLUME: 'retroj2me_volume',
  MUTED: 'retroj2me_muted',
  SCALE_MODE: 'retroj2me_scale_mode',
  FRAME_STYLE: 'retroj2me_frame_style',
  SCANLINES: 'retroj2me_scanlines',
  SHOW_VIRTUAL_KEYPAD: 'retroj2me_show_virtual_keypad',
  CUSTOM_GAMES: 'retroj2me_custom_games',
  HISTORY: 'retroj2me_history',
};

export interface HistoryEntry {
  gameId: string;
  playedAt: number;
}

// Historial (últimos 5 juegos jugados)
export function getGameHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    if (raw) {
      const parsed: HistoryEntry[] = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
    }
  } catch {
    // fallback
  }

  // Fallback to recent IDs if history is empty
  const recents = getRecentlyPlayedIds();
  return recents.slice(0, 5).map((id, index) => ({
    gameId: id,
    playedAt: Date.now() - index * 60000,
  }));
}

export function addGameToHistory(gameId: string): void {
  try {
    const current = getGameHistory().filter((item) => item.gameId !== gameId);
    const updated: HistoryEntry[] = [
      { gameId, playedAt: Date.now() },
      ...current,
    ].slice(0, 5);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history to localStorage', e);
  }
}

export function clearGameHistory(): void {
  try {
    localStorage.removeItem(KEYS.HISTORY);
  } catch (e) {
    console.error('Failed to clear history from localStorage', e);
  }
}

// Favorites
export function getFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteId(id: string): boolean {
  const current = getFavoriteIds();
  const exists = current.includes(id);
  const updated = exists ? current.filter((x) => x !== id) : [...current, id];
  try {
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
  return !exists;
}

// Recently played
export function getRecentlyPlayedIds(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.RECENT);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentlyPlayed(id: string): void {
  try {
    const current = getRecentlyPlayedIds().filter((x) => x !== id);
    const updated = [id, ...current].slice(0, 10);
    localStorage.setItem(KEYS.RECENT, JSON.stringify(updated));
    recordPlaySession(id);
    addGameToHistory(id);
  } catch (e) {
    console.error('Failed to save recently played', e);
  }
}

// Play Stats
export function getGameStats(id: string): GamePlayStats {
  try {
    const raw = localStorage.getItem(KEYS.STATS);
    const all = raw ? JSON.parse(raw) : {};
    return all[id] || { playCount: 0, totalTimeMinutes: 0, lastPlayedTimestamp: 0 };
  } catch {
    return { playCount: 0, totalTimeMinutes: 0, lastPlayedTimestamp: 0 };
  }
}

export function recordPlaySession(id: string): void {
  try {
    const raw = localStorage.getItem(KEYS.STATS);
    const all = raw ? JSON.parse(raw) : {};
    const existing: GamePlayStats = all[id] || { playCount: 0, totalTimeMinutes: 0, lastPlayedTimestamp: 0 };
    all[id] = {
      ...existing,
      playCount: existing.playCount + 1,
      lastPlayedTimestamp: Date.now(),
    };
    localStorage.setItem(KEYS.STATS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to record play session', e);
  }
}

export function addPlayTime(id: string, minutes: number): void {
  try {
    const raw = localStorage.getItem(KEYS.STATS);
    const all = raw ? JSON.parse(raw) : {};
    const existing: GamePlayStats = all[id] || { playCount: 0, totalTimeMinutes: 0, lastPlayedTimestamp: 0 };
    all[id] = {
      ...existing,
      totalTimeMinutes: existing.totalTimeMinutes + minutes,
    };
    localStorage.setItem(KEYS.STATS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to record play time', e);
  }
}

// Controls
export function getGlobalControls(): KeyMapping {
  try {
    const raw = localStorage.getItem(KEYS.GLOBAL_CONTROLS);
    return raw ? { ...DEFAULT_KEY_MAPPING, ...JSON.parse(raw) } : { ...DEFAULT_KEY_MAPPING };
  } catch {
    return { ...DEFAULT_KEY_MAPPING };
  }
}

export function saveGlobalControls(mapping: KeyMapping): void {
  try {
    localStorage.setItem(KEYS.GLOBAL_CONTROLS, JSON.stringify(mapping));
  } catch (e) {
    console.error('Failed to save global controls', e);
  }
}

export function getGameControls(gameId: string): KeyMapping {
  try {
    const raw = localStorage.getItem(KEYS.GAME_CONTROLS_PREFIX + gameId);
    if (raw) {
      return { ...DEFAULT_KEY_MAPPING, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return getGlobalControls();
}

export function saveGameControls(gameId: string, mapping: KeyMapping): void {
  try {
    localStorage.setItem(KEYS.GAME_CONTROLS_PREFIX + gameId, JSON.stringify(mapping));
  } catch (e) {
    console.error('Failed to save game controls', e);
  }
}

export function resetGameControls(gameId: string): void {
  try {
    localStorage.removeItem(KEYS.GAME_CONTROLS_PREFIX + gameId);
  } catch (e) {
    console.error('Failed to reset game controls', e);
  }
}

export function hasCustomGameControls(gameId: string): boolean {
  return localStorage.getItem(KEYS.GAME_CONTROLS_PREFIX + gameId) !== null;
}

// Audio
export function getStoredVolume(): number {
  try {
    const raw = localStorage.getItem(KEYS.VOLUME);
    return raw !== null ? Math.min(1, Math.max(0, parseFloat(raw))) : 0.8;
  } catch {
    return 0.8;
  }
}

export function setStoredVolume(vol: number): void {
  try {
    localStorage.setItem(KEYS.VOLUME, String(vol));
  } catch (e) {
    console.error('Failed to save volume', e);
  }
}

export function getStoredMuted(): boolean {
  try {
    return localStorage.getItem(KEYS.MUTED) === 'true';
  } catch {
    return false;
  }
}

export function setStoredMuted(muted: boolean): void {
  try {
    localStorage.setItem(KEYS.MUTED, String(muted));
  } catch (e) {
    console.error('Failed to save mute', e);
  }
}

// Display Settings
export function getStoredScaleMode(): DisplayScaleMode {
  try {
    const raw = localStorage.getItem(KEYS.SCALE_MODE) as DisplayScaleMode;
    return ['1x', '2x', '3x', '4x', 'fit', 'fullscreen'].includes(raw) ? raw : '2x';
  } catch {
    return '2x';
  }
}

export function setStoredScaleMode(mode: DisplayScaleMode): void {
  try {
    localStorage.setItem(KEYS.SCALE_MODE, mode);
  } catch (e) {
    console.error('Failed to save scale mode', e);
  }
}

export function getStoredFrameStyle(): PhoneFrameStyle {
  try {
    const raw = localStorage.getItem(KEYS.FRAME_STYLE) as PhoneFrameStyle;
    return ['nokia-retro', 'arcade-cabinet', 'clean-screen'].includes(raw) ? raw : 'nokia-retro';
  } catch {
    return 'nokia-retro';
  }
}

export function setStoredFrameStyle(style: PhoneFrameStyle): void {
  try {
    localStorage.setItem(KEYS.FRAME_STYLE, style);
  } catch (e) {
    console.error('Failed to save frame style', e);
  }
}

export function getStoredScanlines(): boolean {
  try {
    const raw = localStorage.getItem(KEYS.SCANLINES);
    return raw !== null ? raw === 'true' : true;
  } catch {
    return true;
  }
}

export function setStoredScanlines(enabled: boolean): void {
  try {
    localStorage.setItem(KEYS.SCANLINES, String(enabled));
  } catch (e) {
    console.error('Failed to save scanlines', e);
  }
}

export function getStoredVirtualKeypad(): boolean {
  try {
    const raw = localStorage.getItem(KEYS.SHOW_VIRTUAL_KEYPAD);
    return raw !== null ? raw === 'true' : false;
  } catch {
    return false;
  }
}

export function setStoredVirtualKeypad(enabled: boolean): void {
  try {
    localStorage.setItem(KEYS.SHOW_VIRTUAL_KEYPAD, String(enabled));
  } catch (e) {
    console.error('Failed to save virtual keypad', e);
  }
}

// Custom uploaded games
export function getCustomGames(): GameMetadata[] {
  try {
    const raw = localStorage.getItem(KEYS.CUSTOM_GAMES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomGame(game: GameMetadata): void {
  try {
    const current = getCustomGames().filter((g) => g.id !== game.id);
    localStorage.setItem(KEYS.CUSTOM_GAMES, JSON.stringify([game, ...current]));
  } catch (e) {
    console.error('Failed to save custom game', e);
  }
}
