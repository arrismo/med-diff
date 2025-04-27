import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, X, FileText } from 'lucide-react';
import Button from '../UI/Button';
import { useReports } from '../../contexts/ReportContext';

interface ReportUploaderProps {
  onComplete?: () => void;
}

const ReportUploader: React.FC<ReportUploaderProps> = ({ onComplete }) => {
  const { uploadReport } = useReports();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles].slice(0, 2));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles].slice(0, 2));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // Upload each file sequentially
      for (let i = 0; i < files.length; i++) {
        setProgress((i / files.length) * 100);
        await uploadReport(files[i]);
      }
      
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setFiles([]);
        if (onComplete) onComplete();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload reports');
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <h3 className="text-lg font-medium mb-4">Upload Reports</h3>
      
      <div 
        className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <FileUp className="h-10 w-10 text-neutral-400 mx-auto mb-4" />
        <p className="text-neutral-600 mb-2">Drag and drop report files here</p>
        <p className="text-neutral-500 text-sm mb-4">or</p>
        <input 
          type="file" 
          className="hidden" 
          id="file-upload" 
          onChange={handleFileChange}
          multiple
        />
        <label htmlFor="file-upload">
          <Button
            variant="outline"
            type="button"
            as="span"
          >
            Browse Files
          </Button>
        </label>
        <p className="text-neutral-400 text-xs mt-3">
          Supported formats: PDF, TXT, DOC, DOCX
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Selected Files</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <motion.li 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-neutral-50 p-3 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-neutral-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{file.name}</p>
                    <p className="text-xs text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button 
                  className="text-neutral-400 hover:text-error-500 p-1"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.li>
            ))}
          </ul>
          
          {error && (
            <p className="text-error-500 text-sm mt-3">{error}</p>
          )}
          
          {uploading ? (
            <div className="mt-4">
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary-500" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-neutral-500 mt-2 text-center">
                Uploading files... {Math.round(progress)}%
              </p>
            </div>
          ) : (
            <Button
              variant="primary"
              className="mt-4 w-full"
              onClick={handleUpload}
            >
              Upload Reports
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportUploader;