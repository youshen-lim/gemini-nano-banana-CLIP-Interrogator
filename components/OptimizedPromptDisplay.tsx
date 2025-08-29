
import React, { useState, useCallback } from 'react';

interface OptimizedPromptDisplayProps {
  prompt: string;
  onChange: (value: string) => void;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const OptimizedPromptDisplay: React.FC<OptimizedPromptDisplayProps> = ({ prompt, onChange }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            // Try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(prompt);
                setCopied(true);
                const timer = setTimeout(() => setCopied(false), 2000);
                return () => clearTimeout(timer);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = prompt;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand('copy');
                    setCopied(true);
                    const timer = setTimeout(() => setCopied(false), 2000);
                    return () => clearTimeout(timer);
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        } catch (error) {
            console.error('Failed to copy text:', error);
            // Show a brief error indication
            setCopied(false);
            // Could add a toast notification here in the future
        }
    }, [prompt]);

    return (
        <div className="relative">
            <textarea
                value={prompt}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-28 p-4 pr-12 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#1974e8]/50 focus:border-[#1974e8] transition-all duration-300 resize-none font-mono text-sm"
                aria-label="Optimized prompt input"
            />
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors duration-200"
                aria-label="Copy optimized prompt"
                title="Copy prompt"
            >
                {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CopyIcon className="h-5 w-5 text-slate-500" />}
            </button>
        </div>
    );
};

export default OptimizedPromptDisplay;
