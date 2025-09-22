import React, { useState, useRef } from 'react';

interface FileUploadProps {
  network: string;
  onFileSelect: (file: File | null) => void;
  acceptedTypes: string;
  maxSizeMB?: number;
  selectedFile?: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  network, 
  onFileSelect, 
  acceptedTypes, 
  maxSizeMB = 50,
  selectedFile: propSelectedFile
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [localSelectedFile, setLocalSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local state with parent-controlled selectedFile prop so clearing from parent
  // (e.g. on successful submit) resets the displayed file in this component.
  React.useEffect(() => {
    if (typeof propSelectedFile !== 'undefined') {
      setLocalSelectedFile(propSelectedFile ?? null);
      if (propSelectedFile === null) {
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  }, [propSelectedFile]);

  const validateFile = (file: File): boolean => {
    setError('');
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }

    // Check file type
    const allowedExtensions = acceptedTypes.split(',').map(type => type.trim().toLowerCase());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type.toLowerCase();
    
    const isValidExtension = allowedExtensions.some(ext => 
      fileExtension === ext || mimeType.includes(ext.replace('.', ''))
    );
    
    if (!isValidExtension) {
      setError(`Only ${acceptedTypes} files are allowed`);
      return false;
    }

    return true;
  };

  const handleFileChange = (file: File | null) => {
    if (file && validateFile(file)) {
      setLocalSelectedFile(file);
      onFileSelect(file);
    } else {
      setLocalSelectedFile(null);
      onFileSelect(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setLocalSelectedFile(null);
    setError('');
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      <h3 className="upload-title">{network} File Upload</h3>
      
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${error ? 'error' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        
        {localSelectedFile ? (
          <div className="file-selected">
            <div className="file-info">
              <span className="file-name">{localSelectedFile.name}</span>
              <span className="file-size">{formatFileSize(localSelectedFile.size)}</span>
            </div>
            <button 
              type="button" 
              className="remove-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📁</div>
            <p>Click to select or drag and drop your file here</p>
            <p className="file-types">Accepted: {acceptedTypes}</p>
            <p className="file-size-limit">Max size: {maxSizeMB}MB</p>
          </div>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FileUpload;