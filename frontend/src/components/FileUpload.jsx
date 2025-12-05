import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { validateFileType } from '../utils/helpers';

function FileUpload({ onUpload, loading }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFileType(file)) {
        onUpload(file);
      } else {
        setError('Invalid file type. Please upload Excel, PDF, or Image files.');
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setError(null);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFileType(file)) {
        onUpload(file);
      } else {
        setError('Invalid file type. Please upload Excel, PDF, or Image files.');
      }
    }
  };

  return (
    <div>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
            : error 
            ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${error ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {loading ? 'Processing...' : 'Upload Invoice File'}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Drag and drop or click to browse
        </p>
        
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
          Supports: Excel (.xlsx, .xls), PDF, Images (PNG, JPG, JPEG)
        </p>
        
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
        )}
        
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleChange}
          accept=".xlsx,.xls,.pdf,.png,.jpg,.jpeg"
          disabled={loading}
        />
        
        <label
          htmlFor="file-upload"
          className={`inline-block px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
            loading
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
          }`}
        >
          {loading ? 'Processing...' : 'Choose File'}
        </label>
      </div>
    </div>
  );
}

export default FileUpload;