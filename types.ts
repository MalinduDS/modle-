export interface ExportOption {
  name: string;
  width: number;
  height: number;
}

export interface VirtualModel {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

export interface LightingState {
  brightness: number;
  contrast: number;
  warmth: number;
}
