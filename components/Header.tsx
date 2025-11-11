
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-500 p-2 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              StyleShot AI
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
