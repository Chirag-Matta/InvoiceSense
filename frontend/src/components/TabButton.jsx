import React from 'react';

function TabButton({ active, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
      }`}
    >
      {icon}
      {label}
      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
        active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
      }`}>
        {count}
      </span>
    </button>
  );
}

export default TabButton;