import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/dashboard/DashboardPage"; // Updated import path
import CreditsPage from "./pages/CreditsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import DisclaimerPage from "./pages/DisclaimerPage"; // Import DisclaimerPage
import Layout from "./layout/Layout";
import { AuthContext } from "./context/AuthContext"; // Import from the new file
import LoginCardSkeleton from "./components/skeletons/LoginCardSkeleton"; // Import the Login Card skeleton
import { checkLeetCodeKeyStatus } from "./utils/userDiagnostic"; // Import the frontend check utility

// Context removed from here

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error("VITE_BACKEND_URL is missing in .env");
       return;
     }
 
     console.log('Checking auth status with backend:', backendUrl); // Log: Indicate check start
 
     fetch(`${backendUrl}/auth/status`, { credentials: "include" })
       .then((res) => {
          console.log('Auth status response status:', res.status); // Log: Response status code
          // Clone response to log body without consuming it for the next .then()
          const clonedRes = res.clone();
          clonedRes.json().then(data => console.log('Auth status response data:', data)).catch(e => console.error('Error parsing auth status JSON:', e)); // Log: Response body
          if (!res.ok) {
             console.error('Auth status request failed with status:', res.status);
          }
          return res.json();
       })
       .then(async (data) => { // Make this async to await the frontend check
         if (data.isAuthenticated && data.user) {
           console.log('User is authenticated via backend, performing frontend key check...');
           try {
             // Perform frontend check *before* setting the final state
             const frontendHasKey = await checkLeetCodeKeyStatus();
             console.log(`Frontend key check result: ${frontendHasKey}`);
             // Set user state with the validated key status
             setUser({ ...data.user, hasLeetCodeKey: frontendHasKey });
           } catch (checkError) {
             console.error("Error during frontend key check:", checkError);
             // Fallback: Set user but assume no valid key if check fails
             setUser({ ...data.user, hasLeetCodeKey: false });
           }
         } else {
           console.log('User is not authenticated according to backend response.');
           setUser(null); // Ensure user is null if not authenticated
         }
         setLoading(false); // Set loading false after all checks
       })
       .catch((error) => {
         console.error("Error fetching auth status:", error.message, error); // Log: Fetch error details
        setLoading(false);
      });
  }, []);

  if (loading) {
    // Show LoginCardSkeleton during initial auth check
    // It provides a better placeholder before the login page might appear
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoginCardSkeleton />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {/* Pass theme state and toggle function to Layout */}
      <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}> 
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                // Remove theme props from DashboardPage, they are handled by Layout now
                <DashboardPage /> 
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          {/* Add routes for Credits, Privacy Policy, and Disclaimer */}
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} /> 
        </Routes>
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;
