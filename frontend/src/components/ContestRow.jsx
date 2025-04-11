import React from 'react';
import ProblemStatusCell from './ProblemStatusCell';

const ContestRow = ({ contest, userStatuses, highlightMatches = false }) => {
  const problems = contest.problems.slice(0, 4);

  return (
    <>
      {/* Contest Title Cell - Enhanced mobile styling with improved dark mode colors */}
      <div className={`p-3 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-800 dark:text-gray-200 dark:bg-gray-750/80 sm:whitespace-nowrap ${
        highlightMatches && contest.isContestMatch 
          ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className={`${highlightMatches && contest.isContestMatch ? 'text-indigo-700 dark:text-indigo-300' : ''} mb-2 sm:mb-0 text-base sm:text-sm font-bold`}>
            {contest.title}
            {highlightMatches && contest.isContestMatch && (
              <span className="ml-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-800/50 dark:text-indigo-200">
                Match
              </span>
            )}
          </span>

          {/* Solution Link Button - improved dark mode colors */}
          {contest.link && contest.link.trim() !== '' && (
            <a
              href={contest.link}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:ml-4 px-2 py-1 text-xs font-medium text-white bg-blue-600 dark:bg-blue-700 rounded hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800 dark:focus:ring-blue-500 self-start sm:self-auto"
              title="Open Solution Video/Link"
            >
              Solution Link
            </a>
          )}
        </div>
        
        {/* Enhanced mobile problem header label */}
        <div className="mt-2 sm:hidden text-xs font-semibold text-gray-500 dark:text-gray-400 pb-1 border-b border-gray-200 dark:border-gray-700">
          Problems:
        </div>
      </div>

      {/* Problem Cells */}
      {problems.map((problem) => (
        <ProblemStatusCell
          key={problem.titleSlug}
          problem={problem}
          userId={'current'} // This needs to be passed down from parent
          hasLeetcodeKey={true} // This should be passed from parent
          initialStatus={userStatuses[problem.titleSlug]}
        />
      ))}
      
      {/* Empty Cells - only show on larger screens - improved dark mode colors */}
      {[...Array(4 - problems.length)].map((_, idx) => (
        <div key={`empty-${idx}`} className="hidden sm:block p-3 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30" />
      ))}
    </>
  );
};

export default ContestRow;
