import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ImageUpload = ({ onImageSelect, disabled, label = "Upload Leaf Image", value }) => {
  const [internalPreview, setInternalPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const preview = value !== undefined ? value : internalPreview;

  const handleFile = useCallback((file) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (value === undefined) setInternalPreview(base64);
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect, value]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile, disabled]);

  const onSelect = useCallback((e) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile, disabled]);

  const handleClear = (e) => {
    e.stopPropagation();
    if (value === undefined) setInternalPreview(null);
    onImageSelect(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 transition-all duration-300 flex flex-col items-center justify-center min-h-[300px]",
          isDragging ? "border-emerald-500 bg-emerald-50/50" : "border-stone-300 hover:border-emerald-400 hover:bg-stone-50",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        {preview ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img src={preview} alt="Preview" className="max-h-[400px] rounded-2xl shadow-lg object-contain" />
            <button
              onClick={handleClear}
              className="absolute -top-4 -right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Upload className="text-emerald-600" size={32} />
            </div>
            <h3 className="text-xl font-medium text-stone-800 mb-2">{label}</h3>
            <p className="text-stone-500 text-center max-w-xs">
              Drag and drop your plant leaf image here, or click to browse
            </p>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={onSelect}
              accept="image/*"
            />
          </>
        )}
      </div>
    </div>
  );
};
