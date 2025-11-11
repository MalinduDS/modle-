
import React, { useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File, preview: string) => void;
  uploadedImagePreview: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      onImageUpload(file, preview);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      onImageUpload(file, preview);
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      {uploadedImagePreview ? (
        <div className="relative group cursor-pointer" onClick={handleClick}>
          <img src={uploadedImagePreview} alt="Product preview" className="w-full h-auto max-h-60 object-contain rounded-lg bg-gray-700" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
            <p className="text-white font-semibold">Click to change image</p>
          </div>
        </div>
      ) : (
        <label
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="cursor-pointer flex justify-center items-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg text-center hover:border-cyan-500 transition-colors duration-300 bg-gray-700/50"
        >
          <div className="flex flex-col items-center">
            <UploadIcon className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-gray-400">
              <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
            </span>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP</p>
          </div>
        </label>
      )}
    </div>
  );
};
