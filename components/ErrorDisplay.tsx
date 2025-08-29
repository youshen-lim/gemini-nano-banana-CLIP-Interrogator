
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg relative animate-fade-in" role="alert">
    <div className="flex items-center">
      <div className="py-1">
        <ErrorIcon className="h-6 w-6 mr-4 text-red-500" />
      </div>
      <div>
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline sm:ml-2">{message}</span>
      </div>
    </div>
  </div>
);

export default ErrorDisplay;
