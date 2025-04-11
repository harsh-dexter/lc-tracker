import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../App';
import axios from 'axios';
import Header from '../components/Header';
import ContestGrid from '../components/ContestGrid';
import Pagination from '../components/Pagination';
import SearchSection from '../components/search/SearchSection';
import SyncButton from '../components/SyncButton';
import { refreshVisibleProblemStatuses } from '../utils/problemStatusRefresh';
import useDashboardData from '../hooks/useDashboardData';
import useSearch from '../hooks/useSearch';
import { checkLeetCodeKeyStatus } from '../utils/userDiagnostic';

function DashboardPage({ isDarkMode, toggleDarkMode }) {
  const { user, setUser } = useAuth();
  const [statusMessage, setStatusMessage] = useState("");
  const [searchLimit, setSearchLimit] = useState(10);
  
  const {
    contests,
    userStatuses,
    setUserStatuses,
    loading,
    isLastPage,
    error,
    currentPage,
    setCurrentPage,
    fetchDashboardData
  } = useDashboardData();
  
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    setSearchResults,
    searchUserStatuses,
    setSearchUserStatuses,  // Added this line to fix the error
    searchError,
    handleSearch,
    isActiveSearch
  } = useSearch(searchLimit);

  // Effect for fetching dashboard data
  useEffect(() => {
    document.title = 'Dashboard - LeetCode Tracker';
    if (!searchQuery) {
      fetchDashboardData(currentPage);
    }
  }, [currentPage, searchQuery, fetchDashboardData]);

  const handleLogout = () => {
    window.location.href = '/auth/logout';
  };

  // Handle user update (e.g., when LeetCode key is added)
  const handleUserUpdate = useCallback(async (updatedUser) => {
    setUser(updatedUser);
    setStatusMessage("LeetCode key added successfully! Refreshing your data...");
    
    await fetchDashboardData(currentPage);
    
    if (updatedUser.hasLeetCodeKey) {
      try {
        const updatedStatuses = await refreshVisibleProblemStatuses(
          updatedUser.id, 
          contests
        );
        
        setUserStatuses(prev => ({
          ...prev,
          ...updatedStatuses
        }));
        
        setStatusMessage("Your problem statuses have been updated!");
      } catch (error) {
        console.error("Error refreshing problem statuses:", error);
        setStatusMessage("Your data has been loaded but some problem statuses may not be up to date.");
      }
    }
    
    setTimeout(() => setStatusMessage(""), 3000);
  }, [fetchDashboardData, currentPage, contests, setUser, setUserStatuses]);

  // Add handler for sync completion
  const handleSyncComplete = useCallback((newStatuses) => {
    if (isActiveSearch) {
      // Update search results statuses
      setSearchUserStatuses(prev => ({
        ...prev,
        ...newStatuses
      }));
    } else {
      // Update main dashboard statuses
      setUserStatuses(prev => ({
        ...prev,
        ...newStatuses
      }));
    }
    
    setStatusMessage("Your problem statuses have been updated!");
    setTimeout(() => setStatusMessage(""), 3000);
  }, [isActiveSearch, setUserStatuses, setSearchUserStatuses, setStatusMessage]);

  // Determine which contests and statuses to display
  const displayContests = searchQuery ? searchResults : contests;
  const displayStatuses = searchQuery ? searchUserStatuses : userStatuses;
  const displayError = error || (searchQuery ? searchError : '');

  useEffect(() => {
    // At component mount, verify LeetCode key status
    const verifyKeyStatus = async () => {
      const hasKey = await checkLeetCodeKeyStatus();
      if (hasKey !== user.hasLeetCodeKey) {
        // console.log(`Updating LeetCode key status: ${hasKey}`); // Commented out non-essential log
        setUser(prev => ({
          ...prev,
          hasLeetCodeKey: hasKey
        }));
      }
    };
    
    if (user) {
      verifyKeyStatus();
    }
  }, [user, setUser]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Header
        user={user}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onUserUpdate={handleUserUpdate}
      />
      
      {statusMessage && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900/40 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-2 rounded z-50 shadow-md transition-opacity duration-300 max-w-[90%] sm:max-w-md text-center">
          {statusMessage}
        </div>
      )}
      
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="px-3 py-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-0 text-center sm:text-left">
                Recent Contests & Your Progress
              </h2>
              
              {/* Add Sync Button here */}
              {user.hasLeetCodeKey && (
                <SyncButton 
                  userId={user.id}
                  contests={displayContests}
                  onSyncComplete={handleSyncComplete}
                />
              )}
            </div>
            
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearching={isSearching}
              handleSearch={handleSearch}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              searchLimit={searchLimit}
              setSearchLimit={setSearchLimit}
              isActiveSearch={isActiveSearch}
            />

            <ContestGrid
              contests={displayContests}
              userStatuses={displayStatuses}
              loading={loading || isSearching}
              error={displayError}
              highlightMatches={isActiveSearch}
              userId={user.id}
              hasLeetcodeKey={user.hasLeetCodeKey}
            />
            
            {/* Only show pagination when not searching */}
            {!loading && !isActiveSearch && (contests.length > 0 || currentPage > 1) && (
              <Pagination
                currentPage={currentPage}
                onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
                onNext={() => setCurrentPage((p) => p + 1)}
                isLastPage={isLastPage}
                loading={loading}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
