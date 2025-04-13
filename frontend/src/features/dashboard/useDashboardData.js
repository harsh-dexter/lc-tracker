import { useState, useCallback, useRef } from 'react'; // Import useRef
import axios from 'axios';

const useDashboardData = () => {
  const [contests, setContests] = useState([]);
  const [userStatuses, setUserStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const dataCache = useRef({}); // Use useRef for cache to avoid re-renders on cache update

  // Function to clear the cache
  const clearCache = useCallback(() => {
    // console.log("[useDashboardData] Clearing cache."); // Optional: Log cache clear
    dataCache.current = {};
  }, []); // No dependencies needed

  const fetchDashboardData = useCallback(async (page) => {
    // Check cache first
    if (dataCache.current[page]) {
      // console.log(`[useDashboardData] Cache hit for page ${page}. Loading from cache.`); // Optional: Log cache hit
      const cachedData = dataCache.current[page];
      setContests(cachedData.contests);
      setUserStatuses(cachedData.userStatuses);
      setIsLastPage(cachedData.isLastPage);
      setLoading(false);
      setError(''); // Clear any previous error
      return; // Exit early
    }

    // console.log(`[useDashboardData] Cache miss for page ${page}. Fetching from API.`); // Optional: Log cache miss
    setLoading(true);
    setError('');
    try {
      // console.log(`[useDashboardData] Fetching data for page ${page}...`); // Removed log
      const res = await axios.get(`/api/dashboard-data?page=${page}`);
      const fetchedContests = Array.isArray(res.data.contests) ? res.data.contests : [];
      // console.log(`[useDashboardData] Fetched ${fetchedContests.length} contests from API.`); // Removed log

      // Filter out upcoming contests
      const now = new Date();
      // Assuming contest.startTime is a comparable date string (e.g., ISO) or timestamp
      const pastOrPresentContests = fetchedContests.filter(contest => {
        // Add a check for valid startTime property
        if (!contest.startTime) return false; 
        try {
          return new Date(contest.startTime) <= now;
        } catch (e) {
          console.error("Error parsing contest startTime:", contest.startTime, e);
          return false; // Exclude if date parsing fails
        }
      });
      // console.log(`[useDashboardData] ${pastOrPresentContests.length} contests remaining after filtering.`); // Removed log

      setContests(pastOrPresentContests);
      setUserStatuses(res.data.userStatuses || {});
      // Base isLastPage on the length of the *fetched* contests before filtering
      const isLast = fetchedContests.length < 10;
      // console.log(`[useDashboardData] Setting isLastPage to: ${isLast} (based on fetched ${fetchedContests.length} < 10)`); // Removed log
      setIsLastPage(isLast);

      // Store fetched data in cache
      dataCache.current[page] = {
        contests: pastOrPresentContests,
        userStatuses: res.data.userStatuses || {},
        isLastPage: isLast,
      };
      // console.log(`[useDashboardData] Stored data for page ${page} in cache.`); // Optional: Log cache store

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
      // Clear potentially stale data on error? Maybe not, depends on desired UX.
    } finally {
      setLoading(false);
    }
    // Add state setters to dependency array for safety, though they are stable.
    // dataCache is a ref, so it doesn't need to be in the dependency array.
  }, [setLoading, setError, setContests, setUserStatuses, setIsLastPage]);

  return {
    contests,
    setContests,
    userStatuses,
    setUserStatuses,
    loading,
    setLoading,
    isLastPage,
    error,
    setError,
    currentPage,
    setCurrentPage,
    fetchDashboardData,
    clearCache // Expose the clearCache function
  };
};

export default useDashboardData;
