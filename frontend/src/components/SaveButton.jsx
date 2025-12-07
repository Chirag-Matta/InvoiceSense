// frontend/src/components/SaveButton.jsx
import React from 'react';
import { Save } from 'lucide-react';

function SaveButton({ onClick, hasChanges, tabName, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || !hasChanges}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        hasChanges && !disabled
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
      }`}
      title={hasChanges ? 'Click to save changes' : 'No changes to save'}
    >
      <Save className="w-4 h-4" />
      Save {tabName}
    </button>
  );
}

export default SaveButton;