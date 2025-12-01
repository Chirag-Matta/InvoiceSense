import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

function StatusMessage({ type, message, onClose }) {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className={`mt-4 rounded-lg p-4 flex items-start gap-3 ${
      isError 
        ? 'bg-red-50 border border-red-200' 
        : 'bg-green-50 border border-green-200'
    }`}>
      {isError ? (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      )}
      
      <div className="flex-1">
        {isError && <p className="text-sm font-medium text-red-800">Error</p>}
        <p className={`text-sm mt-1 ${isError ? 'text-red-700' : 'text-green-800'}`}>
          {message}
        </p>
      </div>
      
      <button 
        onClick={onClose} 
        className={isError ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export default StatusMessage;