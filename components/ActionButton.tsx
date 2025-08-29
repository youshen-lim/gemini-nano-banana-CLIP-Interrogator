
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  text: string;
  loadingText: string;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, isLoading, disabled, text, loadingText }) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#1974e8] hover:bg-[#1565c0] disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#1974e8] transition-all duration-300"
  >
    {isLoading && <LoadingSpinner />}
    {isLoading ? loadingText : text}
  </button>
);

export default ActionButton;
