
import React from 'react';
import { ImageUploader } from './ImageUploader';
import { SparklesIcon } from './icons/SparklesIcon';
import { VirtualModel } from '../types';

interface ControlPanelProps {
  scenePrompt: string;
  setScenePrompt: (prompt: string) => void;
  onImageUpload: (file: File, preview: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  uploadedImagePreview: string | null;
  virtualModels: VirtualModel[];
  selectedModelId: string | null;
  setSelectedModelId: (id: string) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
  warmth: number;
  setWarmth: (value: number) => void;
}

const studioBackgrounds = [
  {
    name: 'Parisian Apartment',
    full: 'in a chic Parisian apartment with herringbone floors, ornate wall moldings, and soft, natural light from a large window.',
  },
  {
    name: 'Art Gallery',
    full: 'in a spacious, modern art gallery with polished concrete floors, high ceilings, and minimalist sculptures. Bright, even lighting.',
  },
  {
    name: 'Runway Show',
    full: 'on a high-fashion runway with dramatic spotlights, a reflective black floor, and a blurred, energetic background.',
  },
  {
    name: 'Palace Garden',
    full: 'in a serene palace garden with marble statues and fountains, soft, ethereal morning light.',
  },
  {
    name: 'Grand Ballroom',
    full: 'in a grand ballroom with crystal chandeliers and ornate mirrors, cinematic, dramatic lighting.',
  },
  {
    name: 'Rooftop Lounge',
    full: 'in a luxurious rooftop lounge at dusk, with a stunning city skyline view and warm, ambient lighting.',
  },
];

const PROMPT_MAX_LENGTH = 300;

export const ControlPanel: React.FC<ControlPanelProps> = ({
  scenePrompt,
  setScenePrompt,
  onImageUpload,
  onGenerate,
  isLoading,
  uploadedImagePreview,
  virtualModels,
  selectedModelId,
  setSelectedModelId,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  warmth,
  setWarmth,
}) => {
  const selectedModel = virtualModels.find(m => m.id === selectedModelId);

  return (
    <div className="bg-gray-800 rounded-2xl p-6 flex flex-col space-y-6 h-full shadow-lg">
      <div>
        <label className="text-lg font-semibold text-gray-200 mb-2 block">1. Upload Product Image</label>
        <p className="text-sm text-gray-400 mb-4">Upload a flat lay or hanger photo of your clothing item.</p>
        <ImageUploader onImageUpload={onImageUpload} uploadedImagePreview={uploadedImagePreview} />
      </div>

      <div>
        <label className="text-lg font-semibold text-gray-200 mb-2 block">2. Choose a Virtual Model</label>
        <p className="text-sm text-gray-400 mb-4">Select a model to wear your product.</p>
        <div className="flex space-x-3 overflow-x-auto pb-3 -mx-6 px-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {virtualModels.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className={`flex-shrink-0 flex flex-col items-center space-y-2 p-3 rounded-lg border-2 transition-all duration-300 w-24 text-center transform focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                selectedModelId === model.id 
                ? 'border-cyan-500 bg-cyan-500/10 scale-105' 
                : 'border-transparent bg-gray-700 hover:bg-gray-600 hover:scale-105'
              }`}
            >
              <img 
                src={model.thumbnail} 
                alt={model.name}
                className={`w-12 h-12 rounded-full object-cover shadow-lg transition-all duration-300 ${
                  selectedModelId === model.id ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-gray-800' : ''
                }`}
              />
              <span className={`text-sm font-medium transition-colors duration-300 ${selectedModelId === model.id ? 'text-cyan-400' : 'text-gray-300'}`}>{model.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-lg font-semibold text-gray-200 mb-2 block">3. Select a Studio Background</label>
        <p className="text-sm text-gray-400 mb-4">Choose a scene that complements your product's style.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {studioBackgrounds.map((bg) => (
            <button
              key={bg.name}
              onClick={() => setScenePrompt(bg.full)}
              className={`text-left p-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                scenePrompt === bg.full
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-transparent bg-gray-700 hover:bg-gray-600'
              }`}
              aria-pressed={scenePrompt === bg.full}
            >
              <span className={`text-sm font-semibold ${scenePrompt === bg.full ? 'text-cyan-400' : 'text-gray-200'}`}>{bg.name}</span>
              <p className="text-xs text-gray-400 mt-1">{bg.full.split(',')[0]}.</p>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="text-lg font-semibold text-gray-200 mb-2 block">4. Adjust Lighting</label>
        <p className="text-sm text-gray-400 mb-4">Fine-tune the mood of your image.</p>
        <div className="space-y-4">
            <div>
                <label htmlFor="brightness" className="flex justify-between text-sm font-medium text-gray-300 mb-1">
                    <span>Brightness</span>
                    <span className="font-mono">{brightness}</span>
                </label>
                <input
                    id="brightness"
                    type="range"
                    min="-50"
                    max="50"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label htmlFor="contrast" className="flex justify-between text-sm font-medium text-gray-300 mb-1">
                    <span>Contrast</span>
                    <span className="font-mono">{contrast}</span>
                </label>
                <input
                    id="contrast"
                    type="range"
                    min="-50"
                    max="50"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label htmlFor="warmth" className="flex justify-between text-sm font-medium text-gray-300 mb-1">
                    <span>Warmth</span>
                    <span className="font-mono">{warmth}</span>
                </label>
                <input
                    id="warmth"
                    type="range"
                    min="-50"
                    max="50"
                    value={warmth}
                    onChange={(e) => setWarmth(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <label htmlFor="prompt" className="text-lg font-semibold text-gray-200 mb-2 block">
          5. Customize Your Scene
        </label>
        
        {selectedModel && (
          <div className="bg-gray-900/50 p-3 rounded-lg mb-4 border border-gray-700 transition-all duration-300">
            <div className="flex items-start space-x-3">
              <img src={selectedModel.thumbnail} alt={selectedModel.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-cyan-400">Active Model: {selectedModel.name}</p>
                <p className="text-xs text-gray-400 mt-1 italic">Prompt contribution: "{selectedModel.description}"</p>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-400 mb-4">
          Further refine the background, setting, and style. Be descriptive!
        </p>
        <div className="relative">
          <textarea
            id="prompt"
            value={scenePrompt}
            onChange={(e) => setScenePrompt(e.target.value)}
            placeholder="e.g., On a wooden hanger against a minimalist white studio wall..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pr-14 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 resize-none"
            rows={3}
            maxLength={PROMPT_MAX_LENGTH}
          />
          <span className={`absolute bottom-3 right-3 text-xs font-mono ${
              scenePrompt.length > PROMPT_MAX_LENGTH ? 'text-red-400' : 'text-gray-400'
            }`}>
            {scenePrompt.length}/{PROMPT_MAX_LENGTH}
          </span>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || !uploadedImagePreview}
        className="w-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 text-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 transform hover:scale-105 disabled:scale-100 mt-auto"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-6 h-6 mr-2" />
            Generate Photo
          </>
        )}
      </button>
    </div>
  );
};
