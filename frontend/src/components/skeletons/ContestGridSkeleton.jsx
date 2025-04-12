import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton CSS

const ContestGridSkeleton = ({ rows = 5, cols = 6 }) => {
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
  // Use Tailwind classes for background/hover where possible, as they handle dark mode automatically
  // const headerBg = isDarkMode ? 'rgba(55, 65, 81, 0.4)' : 'rgba(229, 231, 235, 0.4)'; // bg-muted/40 equivalent
  // const rowHoverBg = isDarkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(229, 231, 235, 0.2)'; // hover:bg-muted/20 equivalent

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/40"> {/* Use Tailwind class for header background */}
            {Array.from({ length: cols }).map((_, colIndex) => (
              <th key={colIndex} className={`p-2 ${colIndex === 0 ? 'w-[200px]' : 'w-[100px]'} text-center font-medium text-muted-foreground`}>
                <Skeleton
                  height={20}
                  width={colIndex === 0 ? '75%' : '50%'}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                  style={{ margin: '0 auto' }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border hover:bg-muted/20"> {/* Use Tailwind classes for border/hover */}
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td key={colIndex} className="p-0 text-center">
                  <div className="flex items-center justify-center h-12">
                    {colIndex === 0 ? (
                      <Skeleton
                        height={20}
                        width={'75%'}
                        baseColor={baseColor}
                        highlightColor={highlightColor}
                      />
                    ) : (
                      <Skeleton
                        circle
                        height={24}
                        width={24}
                        baseColor={baseColor}
                        highlightColor={highlightColor}
                      />
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContestGridSkeleton;
