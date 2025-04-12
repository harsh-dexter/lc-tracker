import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LayoutSkeleton = () => {
  // Initialize state based on current document class for immediate correctness
  const [isDarkMode, setIsDarkMode] = useState(
    () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    // Check dark mode on mount and listen for changes
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Define colors based on dark mode state
  const baseColor = isDarkMode ? "#374151" : "#e5e7eb"; // gray-700 : gray-200
  const highlightColor = isDarkMode ? "#4b5563" : "#d1d5db"; // gray-600 : gray-300

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4 md:px-6">
          <div className="mr-4 hidden md:flex">
            <Skeleton height={24} width={100} baseColor={baseColor} highlightColor={highlightColor} />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Skeleton circle height={32} width={32} baseColor={baseColor} highlightColor={highlightColor} />
            <Skeleton circle height={32} width={32} baseColor={baseColor} highlightColor={highlightColor} />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 container py-8 px-4 md:px-6">
        <Skeleton height={40} width="30%" className="mb-6" baseColor={baseColor} highlightColor={highlightColor} />
        <Skeleton height={300} baseColor={baseColor} highlightColor={highlightColor} />
      </main>

      {/* Footer Skeleton */}
      <footer className="py-6 md:px-6 md:py-0 border-t border-border bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <Skeleton height={16} width={200} baseColor={baseColor} highlightColor={highlightColor} />
          <div className="flex space-x-4">
            <Skeleton height={16} width={60} baseColor={baseColor} highlightColor={highlightColor} />
            <Skeleton height={16} width={60} baseColor={baseColor} highlightColor={highlightColor} />
            <Skeleton height={16} width={60} baseColor={baseColor} highlightColor={highlightColor} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LayoutSkeleton;
