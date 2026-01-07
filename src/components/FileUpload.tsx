import React, { useCallback, useState } from 'react';
import { UploadIcon, FileTextIcon } from './Icons';
import { FileData } from '../types';

interface FileUploadProps {
  onFileSelect: (fileData: FileData) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp', 'image/heic'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPEG, PNG) or PDF file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      
      let previewUrl = null;
      if (file.type.startsWith('image/')) {
        previewUrl = result;
      }

      setSelectedFileName(file.name);
      onFileSelect({
        file,
        base64,
        previewUrl,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(false);
  }, [disabled]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [disabled]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-in-out text-center cursor-pointer group
        ${isDragging 
          ? 'border-teal-500 bg-teal-50 shadow-lg scale-[1.01]' 
          : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      <input
        type="file"
        onChange={onInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full transition-colors duration-300 ${isDragging ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-500'}`}>
          {selectedFileName ? <FileTextIcon className="w-8 h-8" /> : <UploadIcon className="w-8 h-8" />}
        </div>
        
        <div className="space-y-1">
          {selectedFileName ? (
            <>
              <p className="text-lg font-medium text-slate-800 break-all">{selectedFileName}</p>
              <p className="text-sm text-teal-600">Click or drag to replace</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-slate-800">
                Click to upload or drag & drop
              </p>
              <p className="text-sm text-slate-500">
                Supports PDF, JPEG, PNG (Max 10MB)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
