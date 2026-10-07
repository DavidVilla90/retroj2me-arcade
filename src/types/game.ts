export interface GameMetadata {
  id: string;
  name: string;
  year: number;
  genre: string;
  developer: string;
  resolution: string;
  jar: string;
  jad?: string;
  cover: string;
  description: string;
  size: string;
  phonePreset: 'Nokia' | 'SonyEricsson' | 'Motorola' | 'Standard';
  compatibility: string;
  features: string[];
  defaultControls: Record<string, string>;
  isCustom?: boolean;
}

export type DisplayScaleMode = '1x' | '2x' | '3x' | '4x' | 'fit' | 'fullscreen';
export type PhoneFrameStyle = 'nokia-retro' | 'arcade-cabinet' | 'clean-screen';

export interface GamePlayStats {
  playCount: number;
  totalTimeMinutes: number;
  lastPlayedTimestamp: number;
}
