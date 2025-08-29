import React, { useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64: string, file: File) => void;
  onImageRemove: () => void;
  onUploadError: (message: string) => void;
  imageFile: File | null;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onImageRemove, onUploadError, imageFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : null;

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB limit
      const recommendedSizeInBytes = 4 * 1024 * 1024; // 4MB recommended

      if (!allowedTypes.includes(file.type)) {
        onUploadError("Invalid file type. Please upload a PNG, JPG, or WEBP image.");
        return;
      }

      if (file.size > maxSizeInBytes) {
        onUploadError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please upload an image smaller than 10MB.`);
        return;
      }

      if (file.size > recommendedSizeInBytes) {
        console.warn(`Large file detected (${(file.size / 1024 / 1024).toFixed(1)}MB). This may take longer to process.`);
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            onImageUpload(result, file);
          } else {
            onUploadError("Failed to read the image file. Please try again.");
          }
        } catch (error) {
          console.error("Error processing file:", error);
          onUploadError("Failed to process the image file. Please try again.");
        }
      };

      reader.onerror = () => {
        console.error("FileReader error:", reader.error);
        onUploadError("Failed to read the image file. The file may be corrupted or too large.");
      };

      reader.onabort = () => {
        onUploadError("File reading was cancelled. Please try again.");
      };

      try {
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error starting file read:", error);
        onUploadError("Failed to start reading the image file. Please try again.");
      }
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent triggering the file input
    onImageRemove();
  }

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className="relative group w-full h-80 rounded-lg border border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50">
          <img src={imageUrl} alt="Uploaded preview" className="max-w-full max-h-full object-contain" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
            <button
              onClick={handleRemoveClick}
              className="px-4 py-2 bg-white text-slate-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold"
            >
              Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`relative w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
            isDragging ? 'border-[#1974e8] bg-[#1974e8]/10' : 'border-slate-300 bg-white'
          }`}
        >
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => handleFileChange(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload an image"
          />
          <UploadIcon className="h-10 w-10 text-slate-400" />
          <p className="mt-2 text-sm text-slate-500">
            <span className="font-semibold text-[#1974e8]">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-400">PNG, JPG or WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;