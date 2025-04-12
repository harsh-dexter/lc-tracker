import { useState, useCallback } from 'react';
import axios from 'axios';

const useDashboardData = () => {
  const [contests, setContests] = useState([]);
  const [userStatuses, setUserStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDashboardData = useCallback(async (page) => {
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
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
    // Add state setters to dependency array for safety, though they are stable.
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
    fetchDashboardData
  };
};

export default useDashboardData;
