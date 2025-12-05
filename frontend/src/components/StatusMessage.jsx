import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

function StatusMessage({ type, message, onClose }) {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className={`mt-4 rounded-lg p-4 flex items-start gap-3 ${
      isError 
        ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800' 
        : 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
    }`}>
      {isError ? (
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
      )}
      
      <div className="flex-1">
        {isError && <p className="text-sm font-medium text-red-800 dark:text-red-200">Error</p>}
        <p className={`text-sm mt-1 ${isError ? 'text-red-700 dark:text-red-300' : 'text-green-800 dark:text-green-200'}`}>
          {message}
        </p>
      </div>
      
      <button 
        onClick={onClose} 
        className={isError 
          ? 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300' 
          : 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300'
        }
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export default StatusMessage;