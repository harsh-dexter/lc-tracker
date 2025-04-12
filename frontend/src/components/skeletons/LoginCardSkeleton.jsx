import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton CSS

const LoginCardSkeleton = () => {
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
    <div className="w-full max-w-sm mx-auto rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
      <div className="space-y-2 text-center mb-4">
        <Skeleton
          height={24}
          width="75%"
          baseColor={baseColor}
          highlightColor={highlightColor}
          style={{ margin: '0 auto' }}
        />
        <Skeleton
          height={16}
          width="50%"
          baseColor={baseColor}
          highlightColor={highlightColor}
          style={{ margin: '0 auto' }}
        />
      </div>
      <div className="space-y-4 mb-6">
        <Skeleton height={40} baseColor={baseColor} highlightColor={highlightColor} />
        <Skeleton height={40} baseColor={baseColor} highlightColor={highlightColor} />
      </div>
      <div className="flex justify-center">
        <Skeleton height={40} width="50%" baseColor={baseColor} highlightColor={highlightColor} />
      </div>
    </div>
  );
};

export default LoginCardSkeleton;
