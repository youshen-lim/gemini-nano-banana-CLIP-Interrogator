
import React from 'react';

const NanoBananaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="48" height="48" rx="24" fill="#D8F295"/>
        <g clipPath="url(#clip0_101_2)">
            <path d="M24 35C29.5228 35 34 30.5228 34 25C34 19.4772 29.5228 15 24 15C18.4772 15 14 19.4772 14 25C14 30.5228 18.4772 35 24 35Z" stroke="#131313" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24 21V25" stroke="#131313" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs>
            <clipPath id="clip0_101_2">
                <rect width="24" height="24" fill="white" transform="translate(12 12)"/>
            </clipPath>
        </defs>
    </svg>
);


const Header: React.FC = () => (
  <header className="flex flex-col items-start">
    <h1 className="text-4xl sm:text-5xl font-medium tracking-tighter text-slate-900">
      Reverse Engineer Images to Generate Prompts for Gemini 2.5 Flash Image (aka nano-banana)
    </h1>
    <p className="mt-6 text-lg text-slate-600 max-w-3xl">
      Self-hosted CLIP Interrogator application to analyze image and generate descriptive JSON-format prompts for high-quality image generation from Gemini 2.5 Flash Image (aka nano-banana) using Gemini API.
    </p>
  </header>
);

export default Header;