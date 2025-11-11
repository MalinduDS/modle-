import React from 'react';
import { ExportOption } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ResultDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  exportOptions: ExportOption[];
}

const downloadImage = (dataUrl: string, width: number, height: number, fileName: string) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const link = document.createElement('a');
            link.download = fileName;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, isLoading, error, exportOptions }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center h-full shadow-lg">
      <div className="w-full aspect-square bg-gray-700/50 rounded-lg flex items-center justify-center relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <SparklesIcon className="w-16 h-16 text-cyan-400 animate-pulse" />
            <p className="mt-4 text-lg text-white">Generating your StyleShot...</p>
            <p className="text-sm text-gray-400">This may take a moment.</p>
          </div>
        )}
        {error && (
          <div className="text-center p-4">
             <p className="text-red-400 font-semibold">Generation Failed</p>
             <p className="text-sm text-gray-400 mt-2">{error}</p>
          </div>
        )}
        {!isLoading && !error && !generatedImage && (
          <div className="text-center p-4">
            <p className="text-lg font-semibold text-gray-400">Your generated image will appear here</p>
            <p className="text-sm text-gray-500 mt-2">Upload an image and write a prompt to get started.</p>
          </div>
        )}
        {generatedImage && (
          <img src={generatedImage} alt="Generated product shot" className="w-full h-full object-contain transition-opacity duration-500" />
        )}
      </div>
      {generatedImage && !isLoading && (
        <div className="w-full mt-6 animate-fade-in">
          <p className="text-lg font-semibold text-center mb-1">Export for Your Store</p>
          <p className="text-sm text-gray-400 text-center mb-4">Download optimized sizes for popular platforms.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {exportOptions.map((opt) => {
                const fileName = `styleshot-${opt.name.split('(')[0].trim().replace(/\s/g, '_').toLowerCase()}_${opt.width}x${opt.height}.png`;
                return (
                    <button
                        key={opt.name}
                        onClick={() => downloadImage(generatedImage, opt.width, opt.height, fileName)}
                        className="flex flex-col items-center justify-center w-full bg-gray-700 hover:bg-cyan-500/10 hover:border-cyan-500 border-2 border-transparent text-white py-3 px-4 rounded-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center">
                            <DownloadIcon className="w-5 h-5 mr-2 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            <span className="text-sm text-center font-semibold">{opt.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{opt.width} &times; {opt.height}px</span>
                    </button>
                )
            })}
          </div>
        </div>
      )}
    </div>
  );
};